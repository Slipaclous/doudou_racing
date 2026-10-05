/**
 * Fills an empty database with the placeholder content.
 * Usage: npm run seed. Safe to re-run: existing collections are left untouched.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { placeholderSite as site } from "./content/placeholder";

const payload = await getPayload({ config });
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`);

const { pilot } = site;
const existing = await payload.findGlobal({ slug: "pilot" });

if (existing.firstName) {
  log("Fiche pilote déjà remplie, globals ignorés.");
} else {
  await payload.updateGlobal({
    slug: "pilot",
    data: {
      firstName: pilot.firstName,
      nickname: pilot.nickname,
      lastName: pilot.lastName,
      number: pilot.number,
      age: pilot.age,
      nationality: pilot.nationality,
      category: pilot.category,
      team: pilot.team,
      tagline: pilot.tagline,
      bio: pilot.bio.join("\n\n"),
    },
  });
  await payload.updateGlobal({ slug: "stats", data: { items: site.stats.map((st) => ({ ...st, details: st.details.map((text) => ({ text })) })) } });
  await payload.updateGlobal({ slug: "pitch", data: { items: site.pitch.map(({ title, text }) => ({ title, text })) } });
  await payload.updateGlobal({
    slug: "zones",
    data: { items: site.zones.map(({ id, label, text }) => ({ zone: id, label, text })) },
  });
  await payload.updateGlobal({ slug: "settings", data: { contactEmail: site.contactEmail } });
  log("Globals remplis.");
}

async function isEmpty(collection: "seasons" | "races" | "partners") {
  const { totalDocs } = await payload.count({ collection });
  if (totalDocs > 0) log(`${collection} : déjà ${totalDocs} entrée(s), ignoré.`);
  return totalDocs === 0;
}

if (await isEmpty("seasons")) {
  for (const { year, category, headline, text, result } of site.seasons) {
    await payload.create({ collection: "seasons", data: { year, category, headline, text, result } });
  }
}
if (await isEmpty("races")) {
  for (const r of site.races) {
    await payload.create({ collection: "races", data: { ...r, date: new Date(`${r.date}T00:00:00Z`).toISOString() } });
  }
}
if (await isEmpty("partners")) {
  for (const { name, tier } of site.partners) {
    await payload.create({ collection: "partners", data: { name, tier } });
  }
}

log("Terminé.");
process.exit(0);
