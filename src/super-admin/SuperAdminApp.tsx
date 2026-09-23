import { useEffect, useMemo, useState } from "react";
import { Bell, LogOut, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { superAdminApi, type Enquiry, type EnquiryStatus } from "./api";

const statuses: EnquiryStatus[] = ["New", "Contacted", "In Discussion", "Qualified", "Converted", "Rejected", "Closed"];

function statusClass(status: EnquiryStatus) {
  return { New: "sa-status-new", Contacted: "sa-status-contacted", "In Discussion": "sa-status-discussion", Qualified: "sa-status-qualified", Converted: "sa-status-converted", Rejected: "sa-status-rejected", Closed: "sa-status-closed" }[status];
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("iamtanujha@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError("");
    try { await superAdminApi.login(email, password); onLogin(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in"); } finally { setPending(false); }
  }
  return <main className="sa-login-page"><div className="sa-login-card"><div className="sa-brand"><span><ShieldCheck size={20} /></span><div><b>Super Admin</b><small>Platform Administration</small></div></div><h1>Welcome back</h1><p>Sign in to manage landing page enquiries.</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus /></label>{error && <div className="sa-error">{error}</div>}<button disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button></form><a href="/">← Back to landing page</a></div></main>;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const load = async () => { try { setEnquiries((await superAdminApi.listEnquiries(search, filter)).enquiries); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load enquiries"); } };
  useEffect(() => { void load(); }, [search, filter]);
  const counts = useMemo(() => statuses.reduce((acc, status) => ({ ...acc, [status]: enquiries.filter((item) => item.status === status).length }), {} as Record<string, number>), [enquiries]);
  async function changeStatus(id: number, status: EnquiryStatus) { const result = await superAdminApi.updateStatus(id, status); setEnquiries((items) => items.map((item) => item.id === id ? result.enquiry : item)); }
  return <div className="sa-shell"><header className="sa-topbar"><div className="sa-topbrand"><ShieldCheck size={19} /><b>Super Admin</b><span>Platform Administration</span></div><div className="sa-top-actions"><button title="Notifications"><Bell size={17} /></button><span className="sa-new-pill">{counts.New || 0} New Enquiries</span><span className="sa-avatar">T</span><button onClick={onLogout} title="Sign out"><LogOut size={17} /></button></div></header><main className="sa-main"><div className="sa-heading"><div><div className="sa-eyebrow">Overview</div><h1>Super Admin dashboard</h1><p>Manage and follow up on every Landing Page enquiry.</p></div><div className="sa-heading-meta"><span className="sa-live-dot" /> Live data</div></div><section className="sa-metrics"><div><span>Total enquiries</span><strong>{enquiries.length}</strong><small>All captured leads</small></div><div><span>New</span><strong>{counts.New || 0}</strong><small>Awaiting first contact</small></div><div><span>In progress</span><strong>{(counts.Contacted || 0) + (counts["In Discussion"] || 0) + (counts.Qualified || 0)}</strong><small>Being followed up</small></div><div><span>Converted</span><strong>{counts.Converted || 0}</strong><small>Successful outcomes</small></div></section><section className="sa-panel"><div className="sa-panel-heading"><div><h2>Landing Page Enquiries</h2><p>All contact submissions, newest first.</p></div><span className="sa-count">{enquiries.length} records</span></div><div className="sa-toolbar"><div className="sa-search"><Search size={16} /><input placeholder="Search organisation, contact or email…" value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="sa-filter"><SlidersHorizontal size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></div>{error && <div className="sa-error sa-table-error">{error}</div>}<div className="sa-table-wrap"><table className="sa-table"><thead><tr><th>Organisation</th><th>Contact</th><th>Email</th><th>Deployment</th><th>Message</th><th>Date</th><th>Status</th></tr></thead><tbody>{enquiries.map((enquiry) => <tr key={enquiry.id}><td><b>{enquiry.organisation}</b></td><td>{enquiry.contact}</td><td><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></td><td>{enquiry.deployment_preference || "—"}</td><td className="sa-message" title={enquiry.message || ""}>{enquiry.message || "—"}</td><td>{new Date(enquiry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td><td><select className={`sa-status ${statusClass(enquiry.status)}`} value={enquiry.status} onChange={(e) => void changeStatus(enquiry.id, e.target.value as EnquiryStatus)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}{enquiries.length === 0 && <tr><td colSpan={7} className="sa-empty">No enquiries match your search.</td></tr>}</tbody></table></div></section></main></div>;
}

export default function SuperAdminApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => { fetch("/api/super-admin/session").then((response) => response.json()).then((data) => setAuthenticated(Boolean(data.authenticated))).finally(() => setChecking(false)); }, []);
  if (checking) return <main className="sa-loading">Loading Super Admin…</main>;
  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;
  return <Dashboard onLogout={async () => { await superAdminApi.logout(); setAuthenticated(false); }} />;
}
