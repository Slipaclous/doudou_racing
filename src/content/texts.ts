import type { Field } from "payload";

/**
 * Fixed wording of each section (titles, buttons, labels), editable in the back-office section by section.
 * These defaults are what the site shows while a field is empty, and what a new field starts with in /admin.
 * Multi-line titles: one line per line break; the last line is the highlighted one where the design has one.
 */
export const defaultTexts = {
  pilot: {
    title: "Le pilote",
    tabInfo: "Infos générales",
    tabRace: "En course",
  },
  sheet: {
    birth: "5 janvier 2012",
    birthplace: "Charleroi",
    firstKart: "4 ans",
    height: "1m53",
    weight: "39 kg",
    mentor: "Jonathan Dhaese",
  },
  career: {
    title: "Le\nparcours",
    since: "→ aujourd'hui",
    hint: "Faites défiler",
  },
  future: {
    kicker: "La suite",
    title: "La route\nest encore longue",
    closing: "Cette suite,\nécrivons-la ensemble.",
    cta: "Rejoindre l'équipe",
  },
  stats: {
    title: "En chiffres",
  },
  races: {
    title: "Prochaines\ncourses",
    countdown: "avant le prochain départ",
  },
  adventure: {
    kicker: "Bien plus qu'un logo",
    title: "Votre pass\npour la saison",
    passSeason: "Saison 2027",
    passRole: "Partenaire",
    passName: "Votre entreprise",
    passFoot: "Accès paddock · All areas",
    perks: [
      { word: "Vivre", stamp: "Paddock", text: "La saison au cœur de l'équipe : rallye, journées sur circuit, coulisses du paddock." },
      { word: "Inviter", stamp: "Invités", text: "Vos clients et vos équipes à des moments qu'ils n'oublieront pas." },
      { word: "Rencontrer", stamp: "Réseau", text: "Les autres entrepreneurs partenaires, pour faire grandir votre réseau." },
      { word: "Briller", stamp: "Visibilité", text: "Votre marque sur le kart, la combinaison et le casque, sur les circuits d'Europe." },
    ],
    closing: "Votre pass vous attend.",
    cta: "Devenir partenaire",
    galleryLink: "Voir la galerie →",
    memberLink: "Déjà partenaire ? Les prochains rendez-vous",
  },
  partners: {
    title: "Votre logo\nen piste",
    available: "Emplacement disponible",
    cta: "Rejoindre l'équipe",
    roster: "Partenaires actuels",
  },
  contact: {
    title: "Prenez\nle départ\navec nous",
    message: "Votre projet",
    submit: "Envoyer",
    success: "Message reçu. On vous répond sous 48 heures.",
  },
  gallery: {
    kicker: "Galerie",
    title: "Sur le terrain\navec nos partenaires",
    lead: "Rallye, journées sur circuit, coulisses du paddock, soirées clients : la saison vécue ensemble.",
    empty: "Les premières photos arrivent bientôt.",
    closing: "Et la prochaine photo,\nc'est avec vous ?",
    cta: "Devenir partenaire",
    back: "← Retour au site",
  },
  menu: {
    pilote: "Le pilote",
    parcours: "Le parcours",
    suite: "La suite",
    chiffres: "En chiffres",
    courses: "Courses",
    aventure: "L'aventure",
    galerie: "Galerie",
    partenaires: "Partenaires",
    contact: "Contact",
    cta: "Devenir partenaire",
    member: "Espace partenaires",
  },
  seo: {
    // Empty title: built from the pilot sheet ("Edouard « Doudou » #105 — Pilote de karting").
    title: "",
    description: "Le parcours, les résultats et les prochaines courses d'Edouard, jeune pilote de karting belge.",
  },
};

export type Texts = typeof defaultTexts;

export const defaultQuotes = [
  { text: "Je ne perds jamais.\nSoit je gagne,\nsoit j'apprends.", author: "Nelson Mandela", context: "Le fil rouge de Doudou en 2022", year: 2022 },
  { text: "Les sensations fortes\nne sont pas\ndans la victoire,\nmais dans le combat.", author: "Michael Schumacher", context: "Le fil rouge de Doudou en 2024", year: 2024 },
];

/** A multi-line title as the lines the design animates one by one. */
export const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);

type Group = Record<string, unknown>;

/** Back-office value over the default: an empty field keeps the default wording. */
export function withDefaults<T extends Group>(defaults: T, saved: object | null | undefined): T {
  const out: Group = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const v = (saved as Group | null | undefined)?.[key];
    if (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length : v != null) out[key] = typeof v === "string" ? v.trim() : v;
  }
  return out as T;
}

/**
 * Limits that keep the design intact: about half again the original wording, never below 24 characters.
 * Multi-line titles also keep their number of lines (one more allowed) and a line length that fits the big type.
 */
export function limitsFor(text: string) {
  const all = text.split("\n");
  return {
    maxLength: Math.max(24, Math.ceil(text.length * 1.5)),
    maxLines: all.length > 1 ? all.length + 1 : 1,
    maxLine: Math.max(20, Math.ceil(Math.max(...all.map((l) => l.length)) * 1.5)),
  };
}

/** Field validation for a wording limit; an empty field is fine (the default wording is used). */
export function checkWording(value: unknown, { maxLength, maxLines, maxLine }: ReturnType<typeof limitsFor>): true | string {
  if (typeof value !== "string" || !value.trim()) return true;
  if (value.length > maxLength) return `Trop long : ${value.length} caractères pour ${maxLength} au maximum.`;
  if (maxLines === 1) return true;
  const all = value.split("\n").filter((l) => l.trim());
  if (all.length > maxLines) return `Trop de lignes : ${all.length} pour ${maxLines} au maximum.`;
  const long = all.find((l) => l.length > maxLine);
  return long ? `La ligne « ${long.slice(0, 30)}… » est trop longue (${long.length} caractères pour ${maxLine} au maximum).` : true;
}

/** Payload text fields for a group of defaults: label, default value, limits; textarea when the default spans lines. */
export function textFields<T extends Record<string, string>>(defaults: T, labels: Record<keyof T, string>, hints: Partial<Record<keyof T, string>> = {}): Field[] {
  return (Object.keys(defaults) as (keyof T & string)[]).map((name) => {
    // No default (SEO title, built from the pilot sheet): Google shows about 70 characters.
    const text = defaults[name] || "x".repeat(48);
    const multi = defaults[name].includes("\n");
    const limits = limitsFor(text);
    const rule = multi ? `${limits.maxLines} lignes, ${limits.maxLine} caractères par ligne au maximum.` : `${limits.maxLength} caractères au maximum.`;
    const hint = hints[name] ?? (multi ? "Une ligne par retour à la ligne." : undefined);
    return {
      name,
      label: labels[name],
      type: multi ? "textarea" : "text",
      defaultValue: defaults[name] || undefined,
      validate: (value: unknown) => checkWording(value, limits),
      admin: {
        ...(multi ? { rows: defaults[name].split("\n").length } : {}),
        description: hint ? `${hint} ${rule}` : rule,
      },
    } as Field;
  });
}
