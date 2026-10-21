/**
 * The public page, section by section, in reading order.
 * Drives the admin dashboard and the "Aperçu" links, so editors think in terms of the site, not the database.
 */
export type SiteSection = {
  title: string;
  hint: string;
  anchor: string;
  edit: { kind: "global" | "collection"; slug: string };
};

export const siteSections: SiteSection[] = [
  { title: "Ouverture", hint: "Nom, numéro, phrase d'accroche, photo ou vidéo plein écran.", anchor: "top", edit: { kind: "global", slug: "pilot" } },
  { title: "Le pilote", hint: "Biographie et fiche : âge, catégorie, équipe.", anchor: "pilote", edit: { kind: "global", slug: "pilot" } },
  { title: "Le parcours", hint: "Une saison par écran, en défilement horizontal.", anchor: "parcours", edit: { kind: "collection", slug: "seasons" } },
  { title: "La suite", hint: "Les prochaines saisons et les objectifs sportifs.", anchor: "la-suite", edit: { kind: "global", slug: "future" } },
  { title: "En chiffres", hint: "Victoires, podiums, poles… un chiffre par écran.", anchor: "chiffres", edit: { kind: "global", slug: "stats" } },
  { title: "Prochaines courses", hint: "Le calendrier. Les courses passées disparaissent seules.", anchor: "courses", edit: { kind: "collection", slug: "races" } },
  { title: "L'aventure", hint: "Rallye, activités, rencontres : les moments vécus avec les partenaires.", anchor: "aventure", edit: { kind: "collection", slug: "events" } },
  { title: "Votre logo en piste", hint: "Les zones sponsor du kart et les partenaires actuels.", anchor: "partenaires", edit: { kind: "global", slug: "zones" } },
  { title: "Contact", hint: "L'adresse e-mail affichée sur le site.", anchor: "contact", edit: { kind: "global", slug: "settings" } },
];

export const sitePath = (anchor: string) => (anchor === "top" ? "/" : `/#${anchor}`);

export const editPath = ({ kind, slug }: SiteSection["edit"]) =>
  kind === "global" ? `/admin/globals/${slug}` : `/admin/collections/${slug}`;

/** Payload `admin.preview` helper: opens the public page at the matching section. */
export const previewAt = (anchor: string) => () => sitePath(anchor);
