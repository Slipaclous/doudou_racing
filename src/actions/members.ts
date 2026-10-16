"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { escapeHtml, sendEmail } from "@/lib/email";
import { sendInvitation } from "@/members/invite";
import {
  LOGIN_PATH,
  clearSessionCookie,
  getPayloadClient,
  memberPartnerId,
  requireMember,
  setSessionCookie,
} from "@/members/session";

export type FormState = { status: "idle" } | { status: "success"; message: string } | { status: "error"; message: string };

const HOME = "/espace-partenaires";

// Best-effort, per server instance (same trade-off as the public contact form).
const hits = new Map<string, number[]>();
function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const email = z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(200);
const password = z.string().min(10, "10 caractères minimum.").max(200);

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.object({ email, password: z.string().min(1).max(200) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: "E-mail ou mot de passe incorrect." };
  if (rateLimited(`login:${parsed.data.email}`, 10, 15 * 60 * 1000)) {
    return { status: "error", message: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const payload = await getPayloadClient();
  try {
    const { token, exp } = await payload.login({ collection: "members", data: parsed.data });
    if (!token) throw new Error("no token");
    await setSessionCookie(token, exp);
  } catch {
    return { status: "error", message: "E-mail ou mot de passe incorrect." };
  }
  redirect(HOME);
}

export async function logout() {
  await clearSessionCookie();
  redirect(LOGIN_PATH);
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = email.safeParse(formData.get("email"));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };

  // Same answer whether the account exists or not: no way to probe who is a member.
  const done: FormState = { status: "success", message: "Si un compte existe pour cette adresse, un lien vient de vous être envoyé." };
  if (rateLimited(`reset:${parsed.data}`, 3, 60 * 60 * 1000)) return done;

  const payload = await getPayloadClient();
  try {
    await sendInvitation(payload, parsed.data, { reset: true });
  } catch (err) {
    console.error("[members] reset", err);
  }
  return done;
}

export async function setPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ token: z.string().min(1), password, confirm: z.string() })
    .refine((d) => d.password === d.confirm, { message: "Les deux mots de passe ne correspondent pas." })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };

  const payload = await getPayloadClient();
  try {
    const { token } = await payload.resetPassword({
      collection: "members",
      data: { token: parsed.data.token, password: parsed.data.password },
      overrideAccess: true,
    });
    if (token) await setSessionCookie(token);
  } catch {
    return { status: "error", message: "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau." };
  }
  redirect(HOME);
}

const text = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireMember();
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
      jobTitle: text(100),
      offer: text(1500),
      lookingFor: text(1500),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };

  const { name, jobTitle, offer, lookingFor } = parsed.data;
  const payload = await getPayloadClient();
  await payload.update({ collection: "members", id: member.id, data: { name, jobTitle } });
  // Partners are admin-only through the API: only the networking fields of the member's own sponsor change here.
  await payload.update({ collection: "partners", id: memberPartnerId(member), data: { offer, lookingFor } });
  revalidatePath(HOME, "layout");
  return { status: "success", message: "Profil enregistré." };
}

export async function contactPartner(_prev: FormState, formData: FormData): Promise<FormState> {
  const member = await requireMember();
  const parsed = z
    .object({
      partnerId: z.coerce.number().int().positive(),
      message: z.string().trim().min(10, "Quelques mots de plus ?").max(3000),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };
  if (rateLimited(`contact:${member.id}`, 10, 60 * 60 * 1000)) {
    return { status: "error", message: "Vous avez envoyé beaucoup de messages. Réessayez dans une heure." };
  }

  const { partnerId, message } = parsed.data;
  if (partnerId === memberPartnerId(member)) return { status: "error", message: "C'est votre propre entreprise." };

  const payload = await getPayloadClient();
  const [target, from, recipients] = await Promise.all([
    payload.findByID({ collection: "partners", id: partnerId, depth: 0 }).catch(() => null),
    payload.findByID({ collection: "partners", id: memberPartnerId(member), depth: 0 }),
    payload.find({ collection: "members", where: { partner: { equals: partnerId } }, limit: 20, depth: 0, pagination: false }),
  ]);
  if (!target) return { status: "error", message: "Partenaire introuvable." };
  if (!recipients.docs.length) {
    return { status: "error", message: "Ce partenaire n'a pas encore de compte sur l'espace. L'équipe #105 peut faire le lien." };
  }

  const sender = `${member.name}${member.jobTitle ? `, ${member.jobTitle}` : ""} — ${from.name}`;
  const sent = await sendEmail({
    to: recipients.docs.map((m) => m.email),
    replyTo: member.email,
    subject: `${from.name} souhaite échanger avec vous — Espace partenaires #105`,
    html: `<p><strong>${escapeHtml(sender)}</strong> vous écrit via l'espace partenaires #105 :</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p>Répondez directement à cet e-mail pour lui écrire.</p>`,
  });
  return sent
    ? { status: "success", message: `Message envoyé à ${target.name}. La réponse arrivera dans votre boîte mail.` }
    : { status: "error", message: "L'envoi a échoué. Réessayez dans un instant." };
}
