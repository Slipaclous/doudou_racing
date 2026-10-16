"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { escapeHtml, sendEmail } from "@/lib/email";

// Best-effort limit, per server instance: 5 messages per IP per 10 minutes.
// On Vercel each instance has its own memory; move to a shared store (Upstash) if spam persists.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  company: z.string().trim().min(2, "Indiquez votre entreprise.").max(120),
  email: z.string().trim().email("Adresse e-mail invalide.").max(200),
  message: z.string().trim().min(10, "Quelques mots de plus ?").max(3000),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional(),
});

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>> };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot means a bot: pretend it worked.
    if (fieldErrors.website) return { status: "success" };
    return { status: "error", message: "Certains champs sont à corriger.", fieldErrors };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Trop d'envois rapprochés. Réessayez dans quelques minutes." };
  }

  const { name, company, email, message } = parsed.data;
  const to = process.env.CONTACT_TO;
  if (!to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_TO missing, message not sent:", parsed.data);
      return { status: "success" };
    }
    console.error("[contact] CONTACT_TO missing");
    return { status: "error", message: "L'envoi est momentanément indisponible. Écrivez-nous directement par e-mail." };
  }

  const sent = await sendEmail({
    to: [to],
    replyTo: email,
    subject: `Partenariat — ${company}`,
    html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(company)}, ${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  });
  if (!sent) return { status: "error", message: "L'envoi a échoué. Réessayez dans un instant." };

  return { status: "success" };
}
