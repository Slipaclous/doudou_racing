import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Member } from "@/payload-types";

export const LOGIN_PATH = "/espace-partenaires/connexion";

export const getPayloadClient = () => getPayload({ config });

/** The signed-in partner-area member, or null (admins signed into /admin don't count). */
export const getMember = cache(async (): Promise<Member | null> => {
  if (!process.env.DATABASE_URL) return null;
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  return user?.collection === "members" ? (user as Member & { collection: "members" }) : null;
});

export async function requireMember(): Promise<Member> {
  const member = await getMember();
  if (!member) redirect(LOGIN_PATH);
  return member;
}

export const memberPartnerId = (m: Member) => (typeof m.partner === "object" ? m.partner.id : m.partner);

/** Same cookie Payload reads in payload.auth(), so REST access rules apply to the member too. */
export async function setSessionCookie(token: string, exp?: number) {
  const payload = await getPayloadClient();
  (await cookies()).set(`${payload.config.cookiePrefix}-token`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: exp ? new Date(exp * 1000) : undefined,
  });
}

export async function clearSessionCookie() {
  const payload = await getPayloadClient();
  (await cookies()).delete(`${payload.config.cookiePrefix}-token`);
}
