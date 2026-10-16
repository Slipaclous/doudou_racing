export const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Email = { to: string[]; subject: string; html: string; replyTo?: string };

/**
 * Sends through Resend. Without RESEND_API_KEY outside production, logs the e-mail instead
 * (so invitation links can be copied from the terminal in dev). Returns false on failure.
 */
export async function sendEmail({ to, subject, html, replyTo }: Email): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] RESEND_API_KEY missing, not sent.\nTo: ${to.join(", ")}\nSubject: ${subject}\n${html}`);
      return true;
    }
    console.error("[email] RESEND_API_KEY missing");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Site #105 <onboarding@resend.dev>",
      to,
      reply_to: replyTo,
      subject,
      html,
    }),
  });
  if (!res.ok) console.error("[email] Resend error", res.status, await res.text());
  return res.ok;
}

/** Absolute site URL for links in e-mails. */
export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return (url || "http://localhost:3000").replace(/\/$/, "");
}
