import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Media } from "@/payload-types";
import { siteSchema, type Site } from "./schema";
import { placeholderSite } from "./placeholder";
import { themeCss } from "./theme";

const PHOTO_FALLBACK = "/placeholders/photo.svg";
const HERO_FALLBACK = placeholderSite.pilot.heroPoster;

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return typeof m === "object" && m?.url ? m.url : undefined;
}

const clean = (v: string | null | undefined) => v?.trim() || undefined;

/** Back-office colors as a :root override, for every public page (home and partner area). */
export async function getThemeCss(): Promise<string> {
  if (!process.env.DATABASE_URL) return "";
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "settings" });
  return themeCss(settings.theme ?? {});
}

/** Reads all public content. Without a database (first local run), serves placeholder content. */
export async function getSite(): Promise<Site> {
  if (!process.env.DATABASE_URL) return placeholderSite;

  const payload = await getPayload({ config });
  const today = new Date(new Date().toISOString().slice(0, 10)).toISOString();

  const [pilot, stats, pitch, zones, settings, seasons, races, partners, events, future] = await Promise.all([
    payload.findGlobal({ slug: "pilot", depth: 1 }),
    payload.findGlobal({ slug: "stats" }),
    payload.findGlobal({ slug: "pitch", depth: 1 }),
    payload.findGlobal({ slug: "zones" }),
    payload.findGlobal({ slug: "settings" }),
    payload.find({ collection: "seasons", sort: "year", limit: 50, depth: 1, pagination: false }),
    payload.find({ collection: "races", sort: "date", where: { date: { greater_than_equal: today } }, limit: 20, pagination: false }),
    payload.find({ collection: "partners", sort: "order", limit: 50, depth: 1, pagination: false }),
    payload.find({ collection: "events", sort: "-date", limit: 8, depth: 1, pagination: false }),
    payload.findGlobal({ slug: "future" }),
  ]);
  // Until the client fills them in, development shows sample events and goals; production shows nothing.
  const samples = process.env.NODE_ENV !== "production";

  if (!pilot.firstName) {
    throw new Error("Contenu manquant : remplissez la fiche « Pilote » dans /admin (ou lancez `npm run seed`).");
  }

  return siteSchema.parse({
    pilot: {
      firstName: pilot.firstName,
      nickname: pilot.nickname,
      lastName: pilot.lastName ?? "",
      number: pilot.number,
      nationality: pilot.nationality,
      age: pilot.age,
      category: pilot.category,
      team: pilot.team,
      tagline: pilot.tagline,
      heroPoster: mediaUrl(pilot.heroImage) ?? HERO_FALLBACK,
      heroVideo: mediaUrl(pilot.heroVideo),
      bio: pilot.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    },
    seasons: seasons.docs.map((s) => ({
      year: s.year,
      category: s.category,
      headline: s.headline,
      text: s.text,
      result: s.result,
      image: mediaUrl(s.image) ?? PHOTO_FALLBACK,
    })),
    stats: (stats.items ?? []).map(({ value, label, details }) => ({ value, label, details: (details ?? []).map((d) => d.text) })),
    races: races.docs.map((r) => ({
      date: r.date.slice(0, 10),
      name: r.name,
      circuit: r.circuit,
      country: r.country.toUpperCase(),
      category: r.category,
    })),
    pitch: (pitch.items ?? []).map(({ title, text, image }) => ({ title, text, image: mediaUrl(image) })),
    partners: partners.docs.map((p) => ({
      name: p.name,
      tier: p.tier,
      role: clean(p.role),
      sector: clean(p.sector),
      description: clean(p.description),
      logo: mediaUrl(p.logo),
      url: /^https?:\/\//i.test(p.url?.trim() ?? "") ? clean(p.url) : undefined,
      kartZone: p.kartZone ?? undefined,
    })),
    events: events.docs.length
      ? events.docs.map((e) => ({
          title: e.title,
          type: e.type,
          date: e.date.slice(0, 10),
          place: clean(e.place),
          guests: e.guests ?? undefined,
          text: e.text,
          image: mediaUrl(e.image) ?? PHOTO_FALLBACK,
        }))
      : samples ? placeholderSite.events : [],
    future: future.items?.length
      ? future.items.map(({ year, category, title, text }) => ({ year, category, title, text }))
      : samples ? placeholderSite.future : [],
    zones: (zones.items ?? []).map(({ zone, label, text }) => ({ id: zone, label, text })),
    contactEmail: settings.contactEmail,
  });
}
