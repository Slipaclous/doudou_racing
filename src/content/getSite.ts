import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Event, Media } from "@/payload-types";
import { siteSchema, type Site, type SiteEvent } from "./schema";
import { placeholderSite } from "./placeholder";
import { themeCss } from "./theme";
import { defaultTexts as d, lines, withDefaults } from "./texts";

const PHOTO_FALLBACK = "/placeholders/photo.svg";
const HERO_FALLBACK = placeholderSite.pilot.heroPoster;

function mediaUrl(m: number | Media | null | undefined): string | undefined {
  return typeof m === "object" && m?.url ? m.url : undefined;
}

const clean = (v: string | null | undefined) => v?.trim() || undefined;

function toEvent(e: Event): SiteEvent {
  const main = mediaUrl(e.image);
  const gallery = (e.gallery ?? []).map(mediaUrl).filter((u): u is string => Boolean(u));
  return {
    title: e.title,
    type: e.type,
    date: e.date.slice(0, 10),
    place: clean(e.place),
    guests: e.guests ?? undefined,
    text: e.text,
    image: main ?? gallery[0] ?? PHOTO_FALLBACK,
    photos: [...new Set([...(main ? [main] : []), ...gallery])],
  };
}

/** Every event with its photos, newest first, for /galerie. Samples in development until the client adds some. */
export async function getGallery(): Promise<SiteEvent[]> {
  if (!process.env.DATABASE_URL) return placeholderSite.events;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "events", sort: "-date", depth: 1, limit: 200, pagination: false });
  if (docs.length) return docs.map(toEvent).filter((e) => e.photos.length);
  return process.env.NODE_ENV !== "production" ? placeholderSite.events : [];
}

/** Title and description for search engines and link previews, from "Google et partage" and the pilot sheet. */
export async function getSeo(): Promise<{ title: string; description: string; number: number }> {
  const fromPilot = (p: { firstName: string; nickname: string; number: number }) => `${p.firstName} « ${p.nickname} » #${p.number} — Pilote de karting`;
  if (!process.env.DATABASE_URL) return { title: fromPilot(placeholderSite.pilot), description: d.seo.description, number: placeholderSite.pilot.number };
  const payload = await getPayload({ config });
  const [pilot, settings] = await Promise.all([payload.findGlobal({ slug: "pilot", depth: 0 }), payload.findGlobal({ slug: "settings" })]);
  const seo = withDefaults(d.seo, settings.seo);
  const number = pilot.number ?? placeholderSite.pilot.number;
  return { title: seo.title || (pilot.firstName ? fromPilot(pilot) : fromPilot(placeholderSite.pilot)), description: seo.description, number };
}

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

  const [pilot, stats, pitch, zones, settings, seasons, races, partners, events, future, career, upcomingTexts, adventure, gallery, quotes] = await Promise.all([
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
    payload.findGlobal({ slug: "careerTexts" }),
    payload.findGlobal({ slug: "upcomingTexts" }),
    payload.findGlobal({ slug: "adventureTexts" }),
    payload.findGlobal({ slug: "galleryTexts" }),
    payload.findGlobal({ slug: "quotes" }),
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
    events: events.docs.length ? events.docs.map(toEvent) : samples ? placeholderSite.events : [],
    future: future.items?.length
      ? future.items.map(({ year, category, title, text }) => ({ year, category, title, text }))
      : samples ? placeholderSite.future : [],
    zones: (zones.items ?? []).map(({ zone, label, text }) => ({ id: zone, label, text })),
    contactEmail: settings.contactEmail,
    quotes: (quotes.items ?? []).map(({ text, author, context, year }) => ({ lines: lines(text), author, context: clean(context), year: year ?? undefined })),
    texts: {
      pilot: withDefaults(d.pilot, pilot.texts),
      sheet: withDefaults(d.sheet, pilot.sheet),
      career: withDefaults(d.career, career),
      future: withDefaults(d.future, future.texts),
      stats: withDefaults(d.stats, stats.texts),
      races: withDefaults(d.races, upcomingTexts),
      adventure: withDefaults(d.adventure, { ...adventure, ...adventure.pass }),
      partners: withDefaults(d.partners, zones.texts),
      contact: withDefaults(d.contact, settings.texts),
      gallery: withDefaults(d.gallery, gallery),
      menu: withDefaults(d.menu, settings.menu),
      seo: withDefaults(d.seo, settings.seo),
    },
  });
}
