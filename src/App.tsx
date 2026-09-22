import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Lock,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  aiModules,
  modules,
  services,
  standards,
  valueCards,
} from "./data/content";
import { useContactForm } from "./hooks/useContactForm";

// -----------------------------------------------------------------------------
// Shared configuration and form validation
// -----------------------------------------------------------------------------

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const schema = z.object({
  organisation: z.string().min(1, "Organisation name is required"),
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Enter a valid work email"),
  phone: z
    .string()
    .refine(
      (v) => !v || /^[+\d ()-]{7,20}$/.test(v),
      "Enter a valid phone number",
    )
    .optional(),
  role: z.string().min(1, "Role / job title is required"),
  service: z.string().min(1, "Select a service"),
  deployment: z.string().optional(),
  message: z.string().optional(),
});
type FormData = z.infer<typeof schema>;
const nav = [
  ["Services", "services"],
  ["Platform", "platform"],
  ["Standards", "standards"],
  ["Roadmap", "roadmap"],
  ["About", "team"],
  ["Get in Touch", "contact"],
];

// -----------------------------------------------------------------------------
// Shared layout components
// -----------------------------------------------------------------------------

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2 no-underline">
      <span
        className={`${footer ? "h-7 w-7" : "h-[34px] w-[34px]"} flex items-center justify-center rounded-md bg-accent`}
      >
        <Shield size={footer ? 16 : 20} fill="white" color="white" />
      </span>
      <span
        className={`${footer ? "text-[15px]" : "text-lg"} font-bold text-white`}
      >
        Standards<span className="text-[#93C6EA]">OS</span>
      </span>
    </a>
  );
}
function Header({ onDemo }: { onDemo: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 h-14 bg-primary shadow-lg">
      <div className="container flex h-14 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded px-2.5 py-1.5 text-[13.5px] font-semibold text-[#C5D9EE] transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </a>
          ))}
          <button
            onClick={onDemo}
            className="ml-2 rounded bg-app px-4 py-1.5 text-[13.5px] font-semibold text-white hover:bg-[#163d6b]"
          >
            Request Demo
          </button>
        </nav>
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
        >
          <Menu />
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-primary px-5 pb-4 lg:hidden">
          {nav.map(([label, id]) => (
            <a
              onClick={() => setOpen(false)}
              key={id}
              href={`#${id}`}
              className="block py-2 text-sm font-semibold text-[#C5D9EE]"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              onDemo();
            }}
            className="mt-2 w-full rounded bg-app py-2 text-sm font-semibold text-white"
          >
            Request Demo
          </button>
        </div>
      )}
    </header>
  );
}
function SectionIntro({
  eyebrow,
  title,
  desc,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  inverse?: boolean;
}) {
  return (
    <>
      <div className={`eyebrow ${inverse ? "text-[#93C6EA]" : ""}`}>
        {eyebrow}
      </div>
      <h2 className={`title ${inverse ? "text-white" : ""}`}>{title}</h2>
      {desc && (
        <p className={`desc ${inverse ? "text-[#C5D9EE]" : ""}`}>{desc}</p>
      )}
    </>
  );
}

// -----------------------------------------------------------------------------
// Main page sections
// -----------------------------------------------------------------------------

function Hero({ onDemo }: { onDemo: () => void }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#1a2f54_0%,#234a80_55%,#2E75B6_100%)] py-24 text-white md:py-28"
    >
      <div className="container relative z-10">
        <div className="mb-7 flex flex-wrap gap-2">
          {[
            "ISO 42001 - Live",
            "ISO 27001",
            "ISO 27701",
            "ISO 27017",
            "ISO 27018",
            "ISO 27035",
          ].map((x, i) => (
            <span
              key={x}
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${i === 0 ? "border-white/30 bg-white/20 text-white" : "border-white/15 bg-white/10 text-[#93C6EA]"}`}
            >
              {x}
            </span>
          ))}
        </div>
        <motion.div initial="hidden" animate="show" variants={fade}>
          <h1 className="max-w-[680px] text-[38px] font-bold leading-[1.08] tracking-tight md:text-[50px]">
            Implement compliance standards.
            <br />
            <em className="not-italic text-[#93C6EA]">The right way.</em>
          </h1>
          <p className="mt-5 max-w-[580px] text-[16px] leading-[1.72] text-[#C5D9EE] md:text-[17px]">
            StandardsOS gives organisations everything needed to implement and
            sustain compliance across ISO management system standards - editable
            document templates, a live compliance platform, and expert advisory.
            All three, built for how compliance actually works.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onDemo}
              className="rounded-md bg-app px-7 py-3 text-sm font-bold text-white shadow hover:-translate-y-0.5 hover:bg-[#163d6b]"
            >
              Request Demo
            </button>
            <a
              href="#services"
              className="rounded-md border-2 border-white/30 px-7 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/10"
            >
              Explore Services
            </a>
            <span className="text-[13px] text-white/40">
              No commitment required to enquire
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function Services({ go }: { go: (v: string) => void }) {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="services-intro">
          <div>
            <div className="eyebrow">Our Services</div>
            <h2 className="title">Three services.<br />One compliance programme.</h2>
          </div>
          <p className="services-intro-copy">
            Each service is independent - use one, two, or all three. Every service applies to all standards in the StandardsOS portfolio.
          </p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <motion.article
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              key={s.name}
              className="service-column"
            >
              <div className="service-heading">
                <div className={`service-marker service-marker-${i + 1}`}>{String(i + 1).padStart(2, "0")}</div>
                <div className="service-tag">{s.tag}</div>
              </div>
              <h3>{s.name}</h3>
              <p className="service-intro">
                {s.intro}
              </p>
              <ul className="service-list">
                {s.items.map((item) => (
                  <li key={item}><span><Check size={13} strokeWidth={3} /></span>{item}</li>
                ))}
              </ul>
              <div className="service-actions">
                <button onClick={() => go(s.value)}>{s.action}<span aria-hidden="true">→</span></button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Demo({ onDemo }: { onDemo: () => void }) {
  return (
    <section id="demo" className="section">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-10 rounded-xl border border-border bg-white p-7 md:flex-row md:items-center md:p-12">
          <div>
            <div className="eyebrow">Live demo environment</div>
            <h2 className="mb-3 text-2xl font-bold text-primary">
              See the platform before you commit
            </h2>
            <p className="max-w-[520px] text-sm leading-[1.7] text-muted">
              Sample Inc. is a fully populated ISO 42001:2023 compliance
              environment - realistic data across all 17 modules, live risks
              with open treatment actions, NCRs in progress, an active audit
              schedule, and a functioning compliance dashboard. Log in as Tenant
              Admin and explore the platform exactly as your team would use it.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2">
            <button
              onClick={onDemo}
              className="rounded-md bg-app px-8 py-3.5 text-sm font-bold text-white hover:bg-[#163d6b]"
            >
              Request Demo Access
            </button>
            <span className="text-xs text-muted">
              Access set up within one business day
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
function Platform() {
  return (
    <section id="platform" className="section bg-white">
      <div className="container">
        <SectionIntro
          eyebrow="Platform modules"
          title="Everything your compliance programme needs"
          desc="17 modules covering every element of an ISO management system. Standard-agnostic modules work across all active standards. ISO 42001-specific modules are visible only to tenants with that standard active."
        />
        <ModuleGroup
          title="Standard-agnostic - available across all active standards"
          items={modules}
        />
        <ModuleGroup
          title="ISO 42001 specific - visible only to tenants with ISO 42001 active"
          items={aiModules}
          ai
        />
      </div>
    </section>
  );
}
function ModuleGroup({
  title,
  items,
  ai = false,
}: {
  title: string;
  items: readonly (readonly [string, string])[];
  ai?: boolean;
}) {
  return (
    <div className="mb-9 last:mb-0">
      <h3
        className={`mb-3 border-b-2 pb-2 text-[11px] font-bold uppercase tracking-widest ${ai ? "border-accent text-accent" : "border-border text-muted"}`}
      >
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([name, desc]) => (
          <div
            key={name}
            className={`rounded-md border p-4 transition hover:border-accent hover:bg-[#EFF6FF] ${ai ? "border-[#BFDBFE] bg-[#F0F6FF]" : ""}`}
          >
            {ai && (
              <span className="mb-1 inline-block rounded border border-[#BFDBFE] bg-[#EFF6FF] px-1.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                ISO 42001
              </span>
            )}
            <h4 className="text-[13px] font-bold text-primary">{name}</h4>
            <p className="text-xs leading-relaxed text-muted">{desc}</p>
          </div>
        ))}
      </div>
      {ai && (
        <div className="mt-7 flex flex-col gap-4 border-t border-[#244b72] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[560px] text-sm leading-relaxed text-[#c7d9e8]">
            See how the ISO 42001 modules fit together in a live, populated compliance environment.
          </p>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-sm bg-white px-5 py-2.5 text-sm font-bold text-[#102a43] transition hover:bg-[#dceaf5]"
          >
            Request a platform demo
          </a>
        </div>
      )}
    </div>
  );
}
function Value() {
  return (
    <section
      id="value"
      className="section border-y border-[#E8D97A] bg-highlight"
    >
      <div className="container">
        <SectionIntro
          eyebrow="Long-term value"
          title="Compliance is not a one-time project"
          desc="StandardsOS is built for the full lifecycle - from initial implementation through to ongoing audit readiness, management review, and multi-standard expansion."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map(([icon, title, desc]) => (
            <div
              key={title}
              className="rounded-lg border border-[#E0CE60] bg-white/80 p-5"
            >
              <div className="mb-2 text-[22px]">{icon}</div>
              <h3 className="mb-1 text-sm font-bold text-primary">{title}</h3>
              <p className="text-[13px] leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const audiences = [
  [
    "🏢",
    "Organisations building a management system",
    "Companies implementing one or more ISO management system standards - starting with ISO 42001 and expanding to ISO 27001, 27701, and others as their programme matures.",
    ["DIY Kit", "Platform", "Consultancy"],
  ],
  [
    "🛡️",
    "Compliance and risk teams",
    "GRC professionals managing risks, controls, and audit evidence across multiple standards - who need a centralised, role-based system that grows with their portfolio without starting over.",
    ["Platform", "Consultancy"],
  ],
  [
    "💼",
    "Consultants and advisors",
    "Practitioners supporting client ISO implementations across AI governance, information security, and privacy - who need ready-to-use templates, a referenceable methodology, and a platform to onboard clients into.",
    ["DIY Kit", "Platform"],
  ],
] as const;

function Audience() {
  return (
    <section id="audience" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Who it's for"
          title="Built for teams taking compliance seriously"
          desc="StandardsOS serves three types of organisations - at any stage of their compliance journey."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map(([icon, title, desc, chips]) => (
            <div
              key={title}
              className="flex flex-col rounded-lg border border-border bg-white p-6"
            >
              <div className="mb-3 text-3xl">{icon}</div>
              <h3 className="mb-2 text-base font-bold text-primary">{title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-muted">
                {desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-accent"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Standards() {
  return (
    <section id="standards" className="section bg-white">
      <div className="container">
        <SectionIntro
          eyebrow="Standards we support"
          title="One portfolio, growing standard by standard"
          desc="Each standard ships as a complete set - document kit, platform activation, and consultancy scope. Adding a standard to the platform is a data activation, not an architectural change."
        />
        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {standards.map(([code, name, desc, status, meta1, meta2]) => (
            <div
              key={code}
              className={`rounded-lg border p-5 ${status.startsWith("Live") ? "border-accent bg-[#EFF6FF]" : "border-border bg-page"}`}
            >
              <span
                className={`mb-3 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.startsWith("Live") ? "border-green-200 bg-green-50 text-green-700" : "border-border bg-page text-muted"}`}
              >
                {status}
              </span>
              <div className="mb-0.5 text-[13px] font-bold text-accent">
                {code}
              </div>
              <h3 className="mb-2 text-[15px] font-bold leading-tight text-primary">
                {name}
              </h3>
              <p className="mb-3 text-[13px] leading-relaxed text-muted">
                {desc}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <span>
                  <b className="text-text">{meta1.split(":")[0]}:</b>
                  {meta1.split(":").slice(1).join(":")}
                </span>
                <span>
                  <b className="text-text">{meta2.split(":")[0]}:</b>
                  {meta2.split(":").slice(1).join(":")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Release roadmap"
          title="Structured delivery, standard by standard"
          desc="Each release activates a new standard across all three services simultaneously. No architectural change required - new standards are data activations into the existing schema."
        />
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-[760px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-primary text-[11px] uppercase tracking-wider text-white">
                <th className="p-3.5">Release</th>
                <th>Standard</th>
                <th>Description</th>
                <th>Services</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {standards.map(([code, name, , status]) => (
                <tr
                  key={code}
                  className={`border-b border-border bg-white text-sm last:border-0 ${status.startsWith("Live") ? "bg-green-50" : ""}`}
                >
                  <td className="p-3.5 font-bold">
                    {status.match(/v\d\.\d/)?.[0]}
                  </td>
                  <td className="font-bold">{code}</td>
                  <td>{name}</td>
                  <td>
                    <div className="flex gap-1">
                      <span className="rounded border border-border bg-page px-2 py-0.5 text-[11px] text-muted">
                        DIY Kit
                      </span>
                      <span className="rounded border border-border bg-page px-2 py-0.5 text-[11px] text-muted">
                        Platform
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${status.startsWith("Live") ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-blue-50 text-accent"}`}
                    >
                      {status.startsWith("Live") ? "Live" : "Planned"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
const principles = [
  [
    "Principle 01",
    "Multi-standard by design",
    "The entire product - document kits, compliance platform, and advisory - is built to support multiple ISO standards from day one. Adding a standard requires only a data activation - no rebuild, no migration, no downtime.",
  ],
  [
    "Principle 02",
    "Domain depth",
    "Built by a practitioner with direct implementation experience across AI governance, data privacy, and information security. Every template, control, and workflow reflects real compliance work - not generic tooling.",
  ],
  [
    "Principle 03",
    "No vendor lock-in",
    "The DIY Kit is a one-time delivery per edition - you own it outright. The platform can be installed on your own infrastructure. No opaque subscription models, no dependency on our infrastructure if you don’t want it.",
  ],
  [
    "Principle 04",
    "Compliance-grade data handling",
    "Soft delete only - no records ever physically removed. Immutable audit logs on every write. GDPR and India DPDP compliance built in from day one. All hosted data in India - DigitalOcean Bangalore BLR1.",
  ],
  [
    "Principle 05",
    "Practical, not theoretical",
    "Every service is designed to produce real compliance outcomes - a document suite usable on day one, a platform that reflects how compliance programmes actually operate, and advisory that leaves your team self-sufficient when the engagement ends.",
  ],
];

function Principles() {
  return (
    <section id="principles" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Product principles"
          title="What makes StandardsOS different"
          desc="Five principles that govern how StandardsOS is designed, built, and delivered."
        />
        <div className="grid gap-[18px] md:grid-cols-3">
          {principles.map(([num, title, desc], i) => (
            <div
              key={num}
              className={`rounded-lg border p-6 ${i === 4 ? "border-primary bg-primary md:col-span-3" : "border-border bg-white"}`}
            >
              <div
                className={`mb-2.5 text-[11px] font-bold uppercase tracking-widest ${i === 4 ? "text-[#93C6EA]" : "text-accent"}`}
              >
                {num}
              </div>
              <h3
                className={`mb-2 text-[15px] font-bold ${i === 4 ? "text-white" : "text-primary"}`}
              >
                {title}
              </h3>
              <p
                className={`text-[13px] leading-relaxed ${i === 4 ? "text-[#C5D9EE]" : "text-muted"}`}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Team() {
  return (
    <section id="team" className="section bg-white">
      <div className="container">
        <SectionIntro
          eyebrow="The practitioner behind StandardsOS"
          title="Built from experience, not theory"
        />
        <div className="grid gap-9 md:grid-cols-[1fr_300px] md:gap-[60px]">
          <div>
            <p className="mb-6 text-[15px] leading-[1.8]">
              StandardsOS is built by an independent consultant and developer
              with direct, hands-on experience implementing ISO management
              system standards across organisations in AI, fintech, healthcare,
              and professional services.{" "}
              <b className="text-primary">
                Every document, every module, every workflow reflects real
                implementation work
              </b>{" "}
              - not a repackaged audit framework or a generic compliance
              checklist.
            </p>
            <p className="mb-6 text-[15px] leading-[1.8]">
              The platform is designed so that once implementation is complete,{" "}
              <b className="text-primary">
                your team owns and operates the compliance programme
              </b>{" "}
              - not the consultant. The goal is self-sufficiency, not ongoing
              dependency.
            </p>
            <div className="mb-6 flex flex-wrap gap-9">
              <Stat value="10+" label="Years in compliance practice" />
              <Stat value="6" label="ISO standards in portfolio" />
              <Stat value="147" label="ISO 42001 documents built" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "ISO 42001",
                "ISO 27001",
                "ISO 27701",
                "ISO 27035",
                "GDPR",
                "DPDP Act",
                "HIPAA",
                "NIST CSF",
              ].map((x) => (
                <span
                  className="rounded border border-border bg-page px-2.5 py-1 text-[11px] font-bold text-primary"
                  key={x}
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-border bg-page p-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[22px] font-bold text-white">
              [Y]
            </div>
            <h3 className="text-[17px] font-bold text-primary">[Your Name]</h3>
            <p className="mb-3 text-[13px] font-semibold text-accent">
              Founder · StandardsOS
            </p>
            <p className="text-[13px] leading-relaxed text-muted">
              Independent consultant specialising in AI governance, data
              privacy, and information security. Expert in ISO 42001, ISO 27001,
              ISO 27701, ISO 27035, GDPR, India DPDP, HIPAA, and NIST. Building
              the compliance tooling that practitioners actually need.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col">
      <b className="text-3xl leading-none text-primary">{value}</b>
      <small className="mt-1 text-xs text-muted">{label}</small>
    </span>
  );
}
const trust = [
  [
    "Security",
    "HTTPS enforced across all environments. Bcrypt password hashing, 5-attempt lockout, rate limiting at server and API layers. Role-based access enforced at every endpoint.",
    Lock,
  ],
  [
    "Privacy",
    "Designed for GDPR and India DPDP Act compliance. Data minimisation at schema level. Soft delete only - data retained for compliance, never exposed. No data shared with third parties.",
    Shield,
  ],
  [
    "Immutable Audit Trail",
    "Every write - create, update, soft delete - logged with user, timestamp, record, and changed fields. Audit logs are immutable. No record is ever physically deleted.",
    FileText,
  ],
  [
    "No Hard Deletes",
    "Records are never physically removed. Every deletion is a soft delete - flagged, timestamped, and retained permanently. Draft records editable; submitted records locked.",
    Check,
  ],
  [
    "Role-Based Access",
    "Five roles - Super Admin, Tenant Admin, Contributor, Module User, Auditor - with tightly scoped permissions enforced at the API layer on every request, not just the UI.",
    Users,
  ],
  [
    "Uptime & Reliability",
    "Production monitored continuously. Automated daily backups. Dedicated production server - 4 vCPU, 8 GB RAM - sized for the platform’s v1.0 load profile.",
    Clock3,
  ],
] as const;

function Trust() {
  return (
    <section id="trust" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Security & Privacy"
          title="Built to handle compliance data responsibly"
          desc="Security and privacy obligations built in from day one - not retrofitted after the fact."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {trust.map(([title, desc, Icon]) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-white p-5 transition hover:border-accent"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-page">
                <Icon size={18} className="text-accent" />
              </span>
              <h3 className="mb-1.5 text-sm font-bold text-primary">{title}</h3>
              <p className="text-[13px] leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
          <div className="flex gap-5 rounded-lg border border-border bg-white p-5 md:col-span-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-page">
              <FileText size={18} className="text-accent" />
            </span>
            <div>
              <h3 className="mb-1.5 text-sm font-bold text-primary">
                Data Centre & Residency
              </h3>
              <p className="text-[13px] leading-relaxed text-muted">
                All customer data hosted exclusively on DigitalOcean Bangalore
                (BLR1) - meeting ISO 27001, SOC 2 Type II, and CSA STAR
                standards. India data residency guaranteed. Data never leaves
                the region. Infrastructure is GDPR-ready and compliant with
                Indian data localisation requirements under the DPDP Act 2023.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Contact({ initialService }: { initialService?: string }) {
  const [sent, setSent] = useState(false);
  const { mutateAsync, isPending } = useContactForm();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service: initialService || "" },
  });
  const service = watch("service");
  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      setSent(true);
    } catch {
      alert("We could not send your enquiry. Please try again.");
    }
  };
  const message: { [key: string]: string } = {
    kit: "Thank you - we will prepare the document kit details and be in touch within one business day.",
    platform:
      "Thank you - we have noted your demo request. We will set up your Sample Inc. access within one business day.",
    consultancy:
      "Thank you - we will review your requirements and be in touch within one business day.",
    multiple:
      "Thank you - we will be in touch within one business day to discuss your requirements.",
  };
  return (
    <section id="contact" className="section bg-primary">
      <div className="container">
        <div className="grid gap-9 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <div>
            <SectionIntro
              inverse
              eyebrow="Get in Touch"
              title="Start a conversation"
            />
            <p className="mb-7 text-[15px] leading-[1.7] text-[#C5D9EE]">
              Fill in the form and we will be in touch. No automated sequences -
              a real response from the team within one business day.
            </p>
            <div className="space-y-3.5 text-sm text-[#C5D9EE]">
              <p>
                <Clock3 className="mr-2 inline text-[#93C6EA]" size={18} />
                Response within 1 business day
              </p>
              <p>
                <Check className="mr-2 inline text-[#93C6EA]" size={18} />
                No commitment required to enquire
              </p>
              <p>
                <Shield className="mr-2 inline text-[#93C6EA]" size={18} />
                Your details are kept confidential
              </p>
              <p>
                <Check className="mr-2 inline text-[#93C6EA]" size={18} />
                Platform demo access set up within one business day
              </p>
            </div>
          </div>
          <div>
            {sent ? (
              <div className="rounded-[10px] border border-green-200 bg-white p-14 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <Check className="text-green-600" size={28} />
                </span>
                <h3 className="mb-2 text-lg font-bold text-primary">
                  Enquiry received
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {message[service] || message.multiple}
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    reset();
                  }}
                  className="mt-5 text-sm font-bold text-accent underline"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-[10px] bg-white p-6 md:p-7"
              >
                <div className="contact-field">
                  <Field
                    label="Organisation name"
                    error={errors.organisation?.message}
                  >
                    <input
                      {...register("organisation")}
                      placeholder="Acme Technologies Ltd"
                      className="field"
                    />
                  </Field>
                </div>
                <div className="contact-field">
                  <Field label="Contact name" error={errors.name?.message}>
                    <input
                      {...register("name")}
                      placeholder="Jane Smith"
                      className="field"
                    />
                  </Field>
                </div>
                <div className="contact-field">
                  <Field label="Work email" error={errors.email?.message}>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="jane@acme.com"
                      className="field"
                    />
                  </Field>
                </div>
                <div className="contact-field">
                  <Field label="Phone" optional error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="field"
                    />
                  </Field>
                </div>
                <div className="contact-field contact-field--full">
                  <Field label="Role / Job title" error={errors.role?.message}>
                    <input
                      {...register("role")}
                      placeholder="e.g. Head of Compliance, CTO, Privacy Officer"
                      className="field"
                    />
                  </Field>
                </div>
                <div className="contact-field contact-field--full">
                  <Field
                    label="How can we help?"
                    error={errors.service?.message}
                  >
                    <Select register={register("service")}>
                      <option value="">Select a service</option>
                      <option value="kit">
                        DIY Document Kit - request a kit
                      </option>
                      <option value="platform">
                        Compliance Platform - request demo access
                      </option>
                      <option value="consultancy">
                        Expert Consultancy - discuss my requirements
                      </option>
                      <option value="multiple">
                        Multiple services / Not sure yet
                      </option>
                    </Select>
                  </Field>
                </div>
                {service === "platform" && (
                  <div className="contact-field contact-field--full">
                    <Field label="Deployment preference">
                      <Select register={register("deployment")}>
                        <option value="">Not sure yet</option>
                        <option value="saas">
                          Hosted SaaS - StandardsOS manages the infrastructure
                        </option>
                        <option value="onpremise">
                          On-premise - installed on our own infrastructure
                        </option>
                      </Select>
                    </Field>
                  </div>
                )}
                <div className="contact-field contact-field--full">
                  <Field label="Message" optional>
                    <textarea
                      {...register("message")}
                      rows={3}
                      placeholder="Tell us where you are in your compliance journey, or anything else that would help us prepare."
                      className="field resize-y"
                    />
                  </Field>
                </div>
                <div className="contact-form-footer flex flex-col gap-5 border-t border-border pt-4 md:flex-row md:items-start md:justify-between">
                  <p className="max-w-[300px] text-xs leading-relaxed text-muted">
                    By submitting this form you agree to us storing your details
                    to manage your enquiry. We will not share your data with
                    third parties. See our{" "}
                    <a href="#privacy" className="text-accent underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                  <button
                    disabled={isPending}
                    className="shrink-0 rounded-md bg-app px-7 py-3 text-sm font-bold text-white hover:bg-[#163d6b] disabled:opacity-60"
                  >
                    {isPending ? "Sending…" : "Send enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Form, legal, and footer components
// -----------------------------------------------------------------------------

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-text">
      <span className="field-label">
        {label}{" "}
        {optional ? (
          <span className="font-normal text-muted">(optional)</span>
        ) : (
          <span className="text-red-600">*</span>
        )}
      </span>
      {children}
      {error && (
        <span className="text-xs font-normal text-red-600">{error}</span>
      )}
    </label>
  );
}
function Select({
  register,
  children,
}: {
  register: ReturnType<typeof useForm<FormData>>["register"] extends (
    ...args: any
  ) => infer R
    ? R
    : any;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select {...register} className="field appearance-none pr-9">
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-3 text-muted"
        size={16}
      />
    </div>
  );
}
function PrivacyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = old;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0f1932]/60 p-4 md:p-8"
    >
      <div className="mx-auto max-w-[820px] overflow-hidden rounded-[10px] bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-primary px-6 py-5 md:px-8">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#93C6EA]">
              Legal
            </div>
            <h2 id="privacy-title" className="text-xl font-bold text-white">
              Privacy Policy
            </h2>
            <p className="mt-0.5 text-[13px] text-[#93C6EA]">
              standardos.com · Effective date: [Date to be confirmed before
              go-live]
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy policy"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
          >
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6 text-[13.5px] leading-[1.7] text-text md:p-8">
          <p className="mb-5 text-xs italic text-muted">
            Last updated: [Date to be confirmed]. This policy will be published
            in full before the site goes live.
          </p>
          <PrivacySection title="1. Who we are">
            <p>
              StandardsOS is operated by <b>&lt;StandardsOS&gt;</b>, registered
              at <b>&lt;Registered Address&gt;</b>, India. StandardsOS is the
              data controller for personal data collected through this website
              and the compliance platform.
            </p>
            <p className="mt-2">
              For all privacy-related queries, contact us at{" "}
              <b>privacy@standardos.com</b>.
            </p>
          </PrivacySection>
          <PrivacySection title="2. What data we collect and why">
            <p>
              We collect only the personal data necessary for the purpose for
              which it is provided. We do not collect data speculatively or
              beyond what is needed.
            </p>
            <PrivacyTable
              rows={[
                [
                  "Organisation name, contact name, work email, phone (optional), role",
                  "To respond to your enquiry and manage the engagement",
                  "Legitimate interest (GDPR Art. 6(1)(f)) · Contract performance where applicable",
                ],
                [
                  "Service interest, deployment preference, message content",
                  "To route your enquiry to the appropriate service and respond meaningfully",
                  "Legitimate interest",
                ],
                [
                  "Platform user data (name, email, role, activity logs)",
                  "To operate the compliance platform, authenticate users, and maintain audit trails",
                  "Contract performance (GDPR Art. 6(1)(b)) · Legal obligation (Art. 6(1)(c))",
                ],
                [
                  "IP address",
                  "Security, rate limiting, and fraud prevention",
                  "Legitimate interest",
                ],
              ]}
            />
            <p className="mt-2">
              We do not use your data for marketing, profiling, or automated
              decision-making. We do not sell or share your data with third
              parties for commercial purposes.
            </p>
          </PrivacySection>
          <PrivacySection title="3. Cookies and tracking">
            <p>
              This website uses <b>strictly functional cookies only</b>. No
              analytics, advertising, or tracking cookies are used. No
              third-party tracking scripts are loaded. No cookie consent banner
              is required because no non-essential cookies are set.
            </p>
            <p className="mt-2">
              Functional cookies used: session authentication tokens (platform
              users only), form state preservation. These are essential for the
              site to operate and cannot be disabled without breaking
              functionality.
            </p>
          </PrivacySection>
          <PrivacySection title="4. Data retention">
            <PrivacyTable
              rows={[
                [
                  "Enquiry form submissions (non-customers)",
                  "24 months from enquiry date, or until you request deletion",
                  "Business development and follow-up",
                ],
                [
                  "Platform compliance records",
                  "Duration of subscription + 5 years",
                  "Regulatory and audit compliance obligations",
                ],
                [
                  "Audit logs (platform)",
                  "Permanent - immutable by design",
                  "Compliance with GDPR Art. 5(2) accountability, DPDP, and audit requirements",
                ],
                [
                  "User accounts (platform)",
                  "Duration of subscription + 12 months (soft delete)",
                  "Contract performance and legal obligation",
                ],
              ]}
            />
          </PrivacySection>
          <PrivacySection title="5. Third-party processors">
            <p>
              We use a limited number of third-party processors. Each is bound
              by data processing agreements and processes data only as
              instructed by us.
            </p>
            <PrivacyTable
              rows={[
                [
                  "DigitalOcean",
                  "Cloud infrastructure and hosting",
                  "India - Bangalore BLR1 only. Data never leaves this region.",
                ],
                [
                  "Mailgun (Sinch)",
                  "Transactional email delivery",
                  "USA - covered by Standard Contractual Clauses for EU/UK transfers",
                ],
                [
                  "Sentry",
                  "Error monitoring (production environment only)",
                  "USA - covered by Standard Contractual Clauses. No personal data intentionally sent; error payloads are scrubbed.",
                ],
              ]}
            />
            <p className="mt-2">
              No other third-party processors are used. We do not use Google
              Analytics, Meta Pixel, or any advertising technology.
            </p>
          </PrivacySection>
          <PrivacySection title="6. International data transfers">
            <p>
              Platform data is hosted exclusively in India (DigitalOcean
              Bangalore BLR1) and does not leave the region. Enquiry data and
              transactional emails may be processed by Mailgun in the United
              States. These transfers are covered by Standard Contractual
              Clauses (EU SCCs, 2021) where required by GDPR.
            </p>
            <p className="mt-2">
              For data subjects in India: data processing complies with the
              Digital Personal Data Protection Act 2023 (DPDP Act). Data is
              stored in India in accordance with applicable data localisation
              requirements.
            </p>
          </PrivacySection>
          <PrivacySection title="7. Your rights">
            <p>
              Depending on your jurisdiction, you may have the following rights
              regarding your personal data: access, rectification, erasure, data
              portability, objection, restriction, and withdrawal of consent.
              Email <b>privacy@standardos.com</b> to exercise them.
            </p>
            <p className="mt-2">
              We will respond to all rights requests within 30 days (GDPR) or 30
              days (DPDP). Requests will not be charged unless manifestly
              unfounded or excessive.
            </p>
            <p className="mt-2">
              If you believe we have not handled your data correctly, you have
              the right to lodge a complaint with your supervisory authority -
              the Data Protection Board of India (DPDP), the relevant EU/EEA
              supervisory authority, or the Information Commissioner’s Office
              (ICO) in the UK.
            </p>
          </PrivacySection>
          <PrivacySection title="8. Data breach notification">
            <p>
              In the event of a personal data breach that poses a risk to your
              rights and freedoms, we will notify the relevant supervisory
              authority within 72 hours of becoming aware (GDPR Art. 33) and
              notify affected individuals without undue delay where the breach
              is likely to result in high risk (GDPR Art. 34). Under the DPDP
              Act, we will notify the Data Protection Board and affected Data
              Principals as required by applicable rules.
            </p>
          </PrivacySection>
          <PrivacySection title="9. Applicable laws">
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-accent">
              This policy is written to comply with GDPR, the DPDP Act 2023,
              CCPA / CPRA, and PIPEDA / Quebec Law 25. GDPR sets the highest bar
              - compliance with GDPR substantially satisfies obligations under
              the other frameworks.
            </div>
          </PrivacySection>
          <PrivacySection title="10. Contact us - Data Protection & Privacy">
            <div className="rounded-lg border border-border bg-page p-4">
              <p>
                <b>Data Controller:</b> &lt;StandardsOS&gt;
              </p>
              <p>
                <b>Registered Address:</b> &lt;Registered Address&gt;, India
              </p>
              <p>
                <b>General privacy queries:</b> privacy@standardos.com
              </p>
              <p>
                <b>Data Protection Officer (DPO):</b> dpo@standardos.com
              </p>
              <p>
                <b>Grievance Officer (DPDP Act):</b> dpo@standardos.com ·
                Response within 30 days
              </p>
              <p>
                <b>Website:</b> standardos.com
              </p>
            </div>
          </PrivacySection>
          <PrivacySection title="11. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, legal requirements, or other
              factors. When we make material changes, we will update the
              effective date at the top of this page and, where appropriate,
              notify platform users by email. Continued use of the website or
              platform after changes are posted constitutes acceptance of the
              updated policy.
            </p>
          </PrivacySection>
        </div>
      </div>
    </div>
  );
}
function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7 last:mb-0">
      <h3 className="mb-2 border-b border-border pb-2 text-[15px] font-bold text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}
function PrivacyTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="min-w-[620px] w-full border-collapse text-[13px]">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-border p-2 align-top leading-snug even:bg-[#FAFCFF]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  return (
    <footer className="bg-[#12243D] py-10">
      <div className="container flex flex-col justify-between gap-5 md:flex-row">
        <div>
          <Logo footer />
          <p className="mt-1 text-[13px] text-[#50708A]">
            Multi-standard compliance implementation support
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="mb-2 flex flex-wrap justify-start gap-3.5 md:justify-end">
            {[...nav, ["Principles", "principles"], ["Security", "trust"]].map(
              ([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="text-[13px] text-[#7090AF] hover:text-[#93C6EA]"
                >
                  {label}
                </a>
              ),
            )}
            <button
              id="privacy"
              onClick={onPrivacy}
              className="text-[13px] text-[#7090AF] hover:text-[#93C6EA]"
            >
              Privacy Policy
            </button>
          </div>
          <p className="text-[13px] text-[#7090AF]">
            © 2026 StandardsOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default function App() {
  const [privacy, setPrivacy] = useState(false);
  const [service, setService] = useState<string>();
  const go = (value: string) => {
    setService(value);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const demo = () => go("platform");
  return (
    <>
      <Header onDemo={demo} />
      <main>
        <Hero onDemo={demo} />
        <Services go={go} />
        <Demo onDemo={demo} />
        <Platform />
        <Value />
        <Audience />
        <Standards />
        <Roadmap />
        <Principles />
        <Team />
        <Trust />
        <Contact initialService={service} />
      </main>
      <Footer onPrivacy={() => setPrivacy(true)} />
      <PrivacyModal open={privacy} onClose={() => setPrivacy(false)} />
    </>
  );
}
