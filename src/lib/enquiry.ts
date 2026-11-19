import { getPublicClient } from "./supabase/public";

export type EnquiryFields = "name" | "email" | "phone" | "company" | "service" | "budget" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const limits: Record<EnquiryFields, number> = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  service: 120,
  budget: 60,
  message: 5000,
};

/**
 * Validates and saves a contact-form enquiry straight from the browser.
 * The database only lets the public *insert* enquiries (never read them) — see supabase/schema.sql.
 */
export async function submitEnquiry(formData: FormData): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field
  if (String(formData.get("website") ?? "").trim()) return { status: "success" };

  const get = (k: EnquiryFields) => String(formData.get(k) ?? "").trim().slice(0, limits[k]);
  const data = {
    name: get("name"),
    email: get("email"),
    phone: get("phone") || null,
    company: get("company") || null,
    // several services can be ticked on the form
    service: formData.getAll("service").map(String).map((v) => v.trim()).filter(Boolean).join(", ").slice(0, limits.service) || null,
    budget: get("budget") || null,
    message: get("message"),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!data.name) fieldErrors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fieldErrors.email = "Please enter a valid email.";
  if (data.message.length < 10) fieldErrors.message = "Tell us a little more about your project.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  const db = getPublicClient();
  if (!db) {
    return { status: "error", message: "The form isn't connected yet. Please email or WhatsApp us instead." };
  }

  const { error } = await db.from("enquiries").insert(data);
  if (error) {
    console.error("submitEnquiry:", error.message);
    return { status: "error", message: "Something went wrong. Please try again, or email us directly." };
  }
  return { status: "success" };
}
