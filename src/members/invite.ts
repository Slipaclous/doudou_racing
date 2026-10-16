import type { Payload, PayloadRequest } from "payload";
import { escapeHtml, sendEmail, siteUrl } from "@/lib/email";

/**
 * E-mails a link to choose a password (/espace-partenaires/mot-de-passe/nouveau).
 * Used for the first invitation and for "mot de passe oublié".
 */
export async function sendInvitation(payload: Payload, email: string, { req, reset = false }: { req?: Partial<PayloadRequest>; reset?: boolean } = {}) {
  const token = await payload.forgotPassword({
    collection: "members",
    data: { email },
    disableEmail: true,
    expiration: reset ? 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
    req,
  });
  if (!token) return false;

  const link = `${siteUrl()}/espace-partenaires/mot-de-passe/nouveau?token=${encodeURIComponent(token)}`;
  const intro = reset
    ? "Vous avez demandé à changer votre mot de passe de l'espace partenaires."
    : "Vous êtes invité à rejoindre l'espace partenaires : l'annuaire des sponsors pour échanger entre vous.";

  return sendEmail({
    to: [email],
    subject: reset ? "Votre nouveau mot de passe — Espace partenaires #105" : "Votre accès à l'espace partenaires #105",
    html: `<p>${intro}</p><p><a href="${escapeHtml(link)}">Choisir mon mot de passe</a></p><p>Ce lien expire ${reset ? "dans une heure" : "dans 7 jours"}.</p>`,
  });
}
