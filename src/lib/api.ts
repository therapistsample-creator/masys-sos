export type ContactPayload = {
  organisation: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  service: string;
  deployment?: string;
  message?: string;
};

/**
 * Sends a contact enquiry to the server endpoint.
 * The API may return an empty response, so callers still receive a successful
 * result when the request itself completed successfully.
 */
export async function submitContact(payload: ContactPayload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to send enquiry");
  return response.json().catch(() => ({ ok: true }));
}
