"use server";

import { getPublicClient } from "@/lib/supabase/public";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: Record<string, string>;
};

const str = (fd: FormData, key: string, max: number) =>
  String(fd.get(key) ?? "")
    .trim()
    .slice(0, max);

export async function submitEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real people never fill this hidden field
  if (str(formData, "website", 200)) return { status: "success" };

  const data = {
    name: str(formData, "name", 120),
    email: str(formData, "email", 200),
    phone: str(formData, "phone", 40) || null,
    company: str(formData, "company", 160) || null,
    service: str(formData, "service", 120) || null,
    budget: str(formData, "budget", 60) || null,
    message: str(formData, "message", 5000),
  };

  const values = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""]));

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!data.name) fieldErrors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) fieldErrors.email = "Please enter a valid email.";
  if (data.message.length < 10) fieldErrors.message = "Tell us a little more about your project.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values };

  const db = getPublicClient();
  if (!db) {
    console.warn("Enquiry received but Supabase is not configured.");
    return {
      status: "error",
      message: "The form isn't connected yet. Please email or WhatsApp us instead.",
      values,
    };
  }

  const { error } = await db.from("enquiries").insert(data);
  if (error) {
    console.error("submitEnquiry:", error.message);
    return { status: "error", message: "Something went wrong. Please try again, or email us directly.", values };
  }

  return { status: "success" };
}
