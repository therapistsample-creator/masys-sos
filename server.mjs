import { createServer } from "node:http";
import tls from "node:tls";

const port = Number(process.env.PORT || 8787);
const adminEmail = process.env.CONTACT_ADMIN_EMAIL;
const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/[\s-]/g, "");

const requiredConfig = [
  ["CONTACT_ADMIN_EMAIL", adminEmail],
  ["GMAIL_USER", gmailUser],
  ["GMAIL_APP_PASSWORD", gmailAppPassword],
];

function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) reject(new Error("Request body too large"));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function validate(payload) {
  const required = ["organisation", "name", "email", "role", "service"];
  if (required.some((field) => !String(payload?.[field] || "").trim())) {
    return "Please complete all required fields.";
  }
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
    return "Please provide a valid email address.";
  }
  return null;
}

function smtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\r\n");
      const finalLine = [...lines].reverse().find((line) => /^\d{3} /.test(line));
      if (!finalLine) return;
      socket.off("data", onData);
      const code = Number(finalLine.slice(0, 3));
      code >= 400 ? reject(new Error(finalLine)) : resolve(code);
    };
    socket.on("data", onData);
    socket.once("error", reject);
  });
}

async function smtpCommand(socket, command, expectedCode) {
  socket.write(`${command}\r\n`);
  const code = await smtpResponse(socket);
  if (code !== expectedCode) throw new Error(`Unexpected SMTP response: ${code}`);
}

async function sendEmail({ to, subject, html, replyTo }) {
  const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
  try {
    await smtpResponse(socket); // Gmail greeting
    await smtpCommand(socket, "EHLO localhost", 250);
    await smtpCommand(socket, "AUTH LOGIN", 334);
    await smtpCommand(socket, Buffer.from(gmailUser).toString("base64"), 334);
    await smtpCommand(socket, Buffer.from(gmailAppPassword).toString("base64"), 235);
    await smtpCommand(socket, `MAIL FROM:<${gmailUser}>`, 250);
    await smtpCommand(socket, `RCPT TO:<${to}>`, 250);
    await smtpCommand(socket, "DATA", 354);

    const headers = [
      `From: ${gmailUser}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    ].join("\r\n");
    const message = `${headers}\r\n\r\n${html.replace(/^\./gm, "..")}`;
    socket.write(`${message}\r\n.\r\n`);
    await smtpResponse(socket);
    await smtpCommand(socket, "QUIT", 221);
  } finally {
    socket.end();
  }
}

async function handleContact(request, response) {
  if (requiredConfig.some(([, value]) => !value)) {
    return json(response, 500, { error: "Email service is not configured." });
  }

  try {
    const payload = JSON.parse(await readBody(request));
    const validationError = validate(payload);
    if (validationError) return json(response, 400, { error: validationError });

    const fields = [
      ["Organisation", payload.organisation],
      ["Contact name", payload.name],
      ["Work email", payload.email],
      ["Phone", payload.phone || "Not provided"],
      ["Role / Job title", payload.role],
      ["Service", payload.service],
      ["Deployment preference", payload.deployment || "Not provided"],
      ["Message", payload.message || "Not provided"],
    ];
    const detailsHtml = fields
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 12px;border:1px solid #d8e1e9;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #d8e1e9">${escapeHtml(value)}</td></tr>`,
      )
      .join("");

    await Promise.all([
      sendEmail({
        to: adminEmail,
        replyTo: payload.email,
        subject: `New enquiry from ${payload.name} — ${payload.organisation}`,
        html: `<h2>New contact enquiry</h2><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${detailsHtml}</table>`,
      }),
      sendEmail({
        to: payload.email,
        subject: "We received your enquiry",
        html: `<p>Hi ${escapeHtml(payload.name)},</p><p>Thanks for contacting us. We have received your enquiry and a member of our team will be in touch within one business day.</p><p>Regards,<br />StandardsOS</p>`,
      }),
    ]);

    return json(response, 200, { ok: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return json(response, 500, { error: "Unable to send enquiry." });
  }
}

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    return response.end();
  }

  if (request.method === "POST" && request.url === "/api/contact") {
    return handleContact(request, response);
  }

  return json(response, 404, { error: "Not found" });
}).listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`);
});
