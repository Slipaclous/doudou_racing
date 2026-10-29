/**
 * The public page, section by section, in reading order.
 * Drives the admin dashboard and the "Aperçu" links, so editors think in terms of the site, not the database.
 */
export type SiteSection = {
  title: string;
  hint: string;
  anchor: string;
  edit: { kind: "global" | "collection"; slug: string };
  // Sections fed by a collection keep their titles and buttons in a global of their own.
  texts?: string;
};

export const siteSections: SiteSection[] = [
  { title: "Ouverture", hint: "Nom, numéro, phrase d'accroche, photo ou vidéo plein écran.", anchor: "top", edit: { kind: "global", slug: "pilot" } },
  { title: "Le pilote", hint: "Biographie et fiche : âge, catégorie, équipe.", anchor: "pilote", edit: { kind: "global", slug: "pilot" } },
  { title: "Le parcours", hint: "Une saison par écran, en défilement horizontal.", anchor: "parcours", edit: { kind: "collection", slug: "seasons" }, texts: "careerTexts" },
  { title: "La suite", hint: "Les prochaines saisons et les objectifs sportifs.", anchor: "la-suite", edit: { kind: "global", slug: "future" } },
  { title: "En chiffres", hint: "Victoires, podiums, poles… un chiffre par écran.", anchor: "chiffres", edit: { kind: "global", slug: "stats" } },
  { title: "Courses", hint: "Le calendrier. Les courses passées disparaissent seules.", anchor: "courses", edit: { kind: "collection", slug: "races" }, texts: "upcomingTexts" },
  { title: "L'aventure", hint: "Rallye, activités, rencontres : les moments vécus avec les partenaires.", anchor: "aventure", edit: { kind: "collection", slug: "events" }, texts: "adventureTexts" },
  { title: "Partenaires", hint: "Les zones sponsor du kart et les partenaires actuels.", anchor: "partenaires", edit: { kind: "global", slug: "zones" } },
  { title: "Contact", hint: "Textes du formulaire et adresse e-mail. Menu et référencement Google dans les mêmes réglages.", anchor: "contact", edit: { kind: "global", slug: "settings" } },
];

/** Admin side menu: the site in reading order, one entry per section, its pages as sub-links. */
export const navSections: { title: string; links: { label: string; href: string }[] }[] = [
  { title: "Ouverture et pilote", links: [{ label: "Fiche pilote", href: "/admin/globals/pilot" }] },
  { title: "Le parcours", links: [{ label: "Saisons", href: "/admin/collections/seasons" }, { label: "Textes", href: "/admin/globals/careerTexts" }] },
  { title: "La suite", links: [{ label: "Objectifs et textes", href: "/admin/globals/future" }] },
  { title: "Citations", links: [{ label: "Les deux citations", href: "/admin/globals/quotes" }] },
  { title: "En chiffres", links: [{ label: "Chiffres et textes", href: "/admin/globals/stats" }] },
  { title: "Courses", links: [{ label: "Calendrier", href: "/admin/collections/races" }, { label: "Textes", href: "/admin/globals/upcomingTexts" }] },
  { title: "L'aventure", links: [{ label: "Événements et photos", href: "/admin/collections/events" }, { label: "Textes", href: "/admin/globals/adventureTexts" }] },
  { title: "Galerie", links: [{ label: "Textes de la page", href: "/admin/globals/galleryTexts" }] },
  { title: "Partenaires", links: [{ label: "Partenaires", href: "/admin/collections/partners" }, { label: "Zones du kart et textes", href: "/admin/globals/zones" }] },
  { title: "Contact et réglages", links: [{ label: "Contact, menu, Google, couleurs", href: "/admin/globals/settings" }] },
];

/** Where each back-office page shows on the site: opens the live preview at the right section. */
export const previewPaths: Record<string, string> = {
  pilot: "/",
  seasons: "/#parcours",
  careerTexts: "/#parcours",
  future: "/#la-suite",
  quotes: "/#chiffres",
  stats: "/#chiffres",
  races: "/#courses",
  upcomingTexts: "/#courses",
  events: "/#aventure",
  adventureTexts: "/#aventure",
  galleryTexts: "/galerie",
  partners: "/#partenaires",
  zones: "/#partenaires",
  settings: "/#contact",
};

export const sitePath = (anchor: string) => (anchor === "top" ? "/" : `/#${anchor}`);

export const editPath = ({ kind, slug }: SiteSection["edit"]) =>
  kind === "global" ? `/admin/globals/${slug}` : `/admin/collections/${slug}`;

/** Payload `admin.preview` helper: opens the public page at the matching section. */
export const previewAt = (anchor: string) => () => sitePath(anchor);
