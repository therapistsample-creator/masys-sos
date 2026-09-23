export type EnquiryStatus = "New" | "Contacted" | "In Discussion" | "Qualified" | "Converted" | "Rejected" | "Closed";
export type Enquiry = {
  id: number;
  organisation: string;
  contact: string;
  email: string;
  deployment_preference: string | null;
  message: string | null;
  date: string;
  status: EnquiryStatus;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const superAdminApi = {
  login: (email: string, password: string) => request<{ admin: { name: string; email: string }; token: string }>("/api/super-admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/api/super-admin/logout", { method: "POST" }),
  listEnquiries: (search = "", status = "all") => request<{ enquiries: Enquiry[]; statuses: EnquiryStatus[] }>(`/api/super-admin/enquiries?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`),
  updateStatus: (id: number, status: EnquiryStatus) => request<{ enquiry: Enquiry }>(`/api/super-admin/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
