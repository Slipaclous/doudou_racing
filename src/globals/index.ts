import type { Field, GlobalConfig } from "payload";
import { revalidateSite } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";
import { adminOnlyGlobal } from "@/access";
import { HEX, themeColors } from "@/content/theme";
import { defaultQuotes, defaultTexts as d, textFields } from "@/content/texts";

const hooks = { afterChange: [revalidateSite] };
const at = (anchor: string) => ({ preview: previewAt(anchor) });

const TEXTS_HINT = "Titres, boutons et libellés affichés sur le site. Un champ vidé reprend le texte d'origine.";

/** Short fields side by side, a few per line, instead of one long row. */
const rows = (fields: Field[], size = 3): Field[] =>
  Array.from({ length: Math.ceil(fields.length / size) }, (_, i) => ({ type: "row", fields: fields.slice(i * size, (i + 1) * size) }) as Field);

/** The section's fixed wording, stored as a `texts` group (unlabelled: the tab names it). */
const texts = (fields: Field[]) => ({ name: "texts", label: false, type: "group", fields }) satisfies Field;

/** Every section page reads the same way: what the section shows, then its wording. Unnamed tabs: no schema change. */
const sectionTabs = (content: Field[], wording: Field[]): Field[] => [
  {
    type: "tabs",
    tabs: [
      { label: "Contenu", fields: content },
      { label: "Textes", description: TEXTS_HINT, fields: [texts(wording)] },
    ],
  },
];

export const PilotGlobal: GlobalConfig = {
  slug: "pilot",
  access: adminOnlyGlobal,
  label: "Pilote",
  admin: { ...at("top"), group: "Le site" },
  hooks,
  // Unnamed tabs only group fields in the UI: the database schema is unchanged.
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identité",
          description: "Affiché dans l'ouverture et dans la fiche « Le pilote ».",
          fields: [
            {
              type: "row",
              fields: [
                { name: "firstName", label: "Prénom", type: "text", required: true },
                { name: "nickname", label: "Surnom", type: "text", required: true },
                { name: "lastName", label: "Nom", type: "text" },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "number", label: "Numéro", type: "number", required: true, min: 1 },
                { name: "age", label: "Âge", type: "number", required: true, min: 1 },
                { name: "nationality", label: "Nationalité", type: "text", required: true },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "category", label: "Catégorie", type: "text", required: true },
                { name: "team", label: "Équipe", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Ouverture",
          description: "Le premier écran du site.",
          fields: [
            { name: "tagline", label: "Phrase d'accroche", type: "text", required: true, admin: { description: "Courte : une ligne, deux maximum." } },
            { name: "heroImage", label: "Image d'ouverture", type: "upload", relationTo: "media", admin: { description: "Format paysage, 2000 px de large minimum." } },
            { name: "heroVideo", label: "Vidéo d'ouverture (optionnelle)", type: "upload", relationTo: "media", admin: { description: "MP4 court et léger (< 10 Mo). Remplace l'image, qui sert alors d'affiche." } },
          ],
        },
        {
          label: "Biographie",
          fields: [
            {
              name: "bio",
              label: "Biographie",
              type: "textarea",
              required: true,
              admin: { description: "Séparer les paragraphes par une ligne vide.", rows: 8 },
            },
          ],
        },
        {
          label: "Fiche",
          description: "L'onglet « Infos générales » de la fiche « Le pilote ».",
          fields: [
            {
              name: "sheet",
              type: "group",
              label: false,
              fields: rows(
                textFields(d.sheet, {
                  birth: "Date de naissance",
                  birthplace: "Ville natale",
                  firstKart: "Premier kart",
                  height: "Taille",
                  weight: "Poids",
                  mentor: "Premier mentor",
                }),
              ),
            },
          ],
        },
        {
          label: "Textes",
          description: TEXTS_HINT,
          fields: [texts(rows(textFields(d.pilot, { title: "Titre de la section", tabInfo: "Onglet 1 de la fiche", tabRace: "Onglet 2 de la fiche" })))],
        },
      ],
    },
  ],
};

export const StatsGlobal: GlobalConfig = {
  slug: "stats",
  access: adminOnlyGlobal,
  label: "Chiffres",
  admin: { ...at("chiffres"), group: "Le site" },
  hooks,
  fields: sectionTabs(
    [
    {
      name: "items",
      label: "Chiffres clés",
      type: "array",
      maxRows: 6,
      labels: { singular: "Chiffre", plural: "Chiffres" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "value", label: "Valeur", type: "number", required: true, min: 0 },
            { name: "label", label: "Libellé", type: "text", required: true },
          ],
        },
        {
          name: "details",
          label: "Le détail (optionnel)",
          type: "array",
          labels: { singular: "Ligne", plural: "Lignes" },
          admin: {
            description: "Les courses derrière le chiffre, ex. « Genk 2023 ». Elles s’empilent pendant que le compteur monte (12 affichées au maximum).",
            initCollapsed: true,
          },
          fields: [{ name: "text", label: "Texte", type: "text", required: true, maxLength: 60 }],
        },
      ],
    },
    ],
    textFields(d.stats, { title: "Titre de la section" }),
  ),
};

export const PitchGlobal: GlobalConfig = {
  slug: "pitch",
  access: adminOnlyGlobal,
  label: "Pourquoi le soutenir",
  // Section removed from the site (merged into "L'aventure"); data kept, hidden from the admin.
  admin: { hidden: true, ...at("pourquoi"), group: "Sponsors" },
  hooks,
  fields: [
    {
      name: "items",
      label: "Arguments",
      type: "array",
      maxRows: 6,
      labels: { singular: "Argument", plural: "Arguments" },
      fields: [
        { name: "title", label: "Titre", type: "text", required: true },
        { name: "text", label: "Texte", type: "textarea", required: true },
        {
          name: "image",
          label: "Photo de fond (optionnelle)",
          type: "upload",
          relationTo: "media",
          admin: { description: "Traitée en bichromie sur le site. Sans photo, un motif graphique est affiché." },
        },
      ],
    },
  ],
};

export const ZonesGlobal: GlobalConfig = {
  slug: "zones",
  access: adminOnlyGlobal,
  label: "Votre logo en piste",
  admin: { ...at("partenaires"), group: "Sponsors", description: "Les quatre zones mises en avant sur le schéma du kart." },
  hooks,
  fields: sectionTabs(
    [
    {
      name: "items",
      label: "Zones",
      type: "array",
      maxRows: 4,
      labels: { singular: "Zone", plural: "Zones" },
      fields: [
        {
          name: "zone",
          label: "Zone du kart",
          type: "select",
          required: true,
          options: [
            { label: "Carénage avant", value: "nose" },
            { label: "Pontons latéraux", value: "pods" },
            { label: "Plaque numéro", value: "plate" },
            { label: "Pare-chocs arrière", value: "rear" },
          ],
        },
        { name: "label", label: "Titre", type: "text", required: true },
        { name: "text", label: "Texte", type: "textarea", required: true },
      ],
    },
    ],
    rows(
      textFields(
        d.partners,
        { title: "Titre de la section", available: "Zone sans partenaire", cta: "Bouton", roster: "Titre de la liste des partenaires" },
        { cta: "Suivi du numéro du pilote : « Rejoindre l'équipe #105 »." },
      ),
      2,
    ),
  ),
};

export const FutureGlobal: GlobalConfig = {
  slug: "future",
  access: adminOnlyGlobal,
  label: "La suite (objectifs)",
  admin: { ...at("la-suite"), group: "Le site" },
  hooks,
  fields: sectionTabs(
    [
    {
      name: "items",
      label: "Étapes à venir",
      type: "array",
      labels: { singular: "Étape", plural: "Étapes" },
      admin: { description: "Les prochaines saisons et leurs objectifs, dans l'ordre." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "year", label: "Année", type: "number", required: true, min: 2000, max: 2100 },
            { name: "category", label: "Catégorie visée", type: "text", required: true, admin: { placeholder: "OK Senior" } },
          ],
        },
        { name: "title", label: "Objectif", type: "text", required: true, admin: { placeholder: "Le championnat d'Europe" } },
        { name: "text", label: "Texte", type: "textarea", required: true, admin: { rows: 2 } },
      ],
    },
    ],
    rows(
      textFields(
        d.future,
        { kicker: "Surtitre", title: "Titre de la section", closing: "Phrase de fin", cta: "Bouton" },
        { closing: "La dernière ligne est mise en couleur.", cta: "Suivi du numéro du pilote : « Rejoindre l'équipe #105 »." },
      ),
      2,
    ),
  ),
};

// Sections whose content is a collection (seasons, races, events): their wording lives in a global of its own.

export const CareerTextsGlobal: GlobalConfig = {
  slug: "careerTexts",
  access: adminOnlyGlobal,
  label: "Le parcours",
  admin: { ...at("parcours"), group: "Textes des sections", description: "Les titres de la section. Les saisons elles-mêmes se gèrent dans « Le site › Saisons »." },
  hooks,
  fields: textFields(d.career, { title: "Titre", since: "Après la première année", hint: "Aide au défilement" }, { since: "Affiché après l'année de la première saison : « 2017 → aujourd'hui »." }),
};

export const RacesTextsGlobal: GlobalConfig = {
  slug: "upcomingTexts",
  access: adminOnlyGlobal,
  label: "Prochaines courses",
  admin: { ...at("courses"), group: "Textes des sections", description: "Les titres de la section. Les courses elles-mêmes se gèrent dans « Le site › Calendrier »." },
  hooks,
  fields: textFields(d.races, { title: "Titre", countdown: "Sous le compte à rebours" }),
};

export const AdventureTextsGlobal: GlobalConfig = {
  slug: "adventureTexts",
  access: adminOnlyGlobal,
  label: "L'aventure",
  admin: {
    ...at("aventure"),
    group: "Textes des sections",
    description: "Les titres, le pass et les avantages. Les événements et leurs photos se gèrent dans « Le site › Événements ».",
  },
  hooks,
  // Unnamed tabs: fields keep their place in the database.
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "En-tête",
          description: TEXTS_HINT,
          fields: rows(
            textFields(
              { kicker: d.adventure.kicker, title: d.adventure.title },
              { kicker: "Surtitre", title: "Titre de la section" },
              { title: "Une ligne par retour à la ligne ; la dernière est mise en couleur." },
            ),
            2,
          ),
        },
        {
          label: "Le pass",
          description: "Le badge illustré à côté de la liste des avantages. Pensez à changer la saison chaque année.",
          fields: [
            {
              name: "pass",
              type: "group",
              label: false,
              fields: rows(
                textFields(
                  { passSeason: d.adventure.passSeason, passRole: d.adventure.passRole, passName: d.adventure.passName, passFoot: d.adventure.passFoot },
                  { passSeason: "Saison", passRole: "Rôle", passName: "Nom", passFoot: "Bas du pass" },
                ),
                2,
              ),
            },
          ],
        },
        {
          label: "Avantages",
          description: "Chaque avantage s'affiche avec une photo d'événement et appose son tampon sur le pass.",
          fields: [
            {
              name: "perks",
              label: "Les avantages",
              type: "array",
              minRows: 1,
              maxRows: 6,
              labels: { singular: "Avantage", plural: "Avantages" },
              defaultValue: d.adventure.perks,
              admin: { initCollapsed: true, components: { RowLabel: "/components/admin/RowLabel#PerkRowLabel" } },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "word", label: "Verbe", type: "text", required: true, admin: { placeholder: "Vivre" } },
                    { name: "stamp", label: "Tampon sur le pass", type: "text", required: true, admin: { placeholder: "Paddock" } },
                  ],
                },
                { name: "text", label: "Texte", type: "textarea", required: true, admin: { rows: 2 } },
              ],
            },
          ],
        },
        {
          label: "Fin de section",
          description: TEXTS_HINT,
          fields: rows(
            textFields(
              { closing: d.adventure.closing, cta: d.adventure.cta, galleryLink: d.adventure.galleryLink, memberLink: d.adventure.memberLink },
              { closing: "Phrase de fin", cta: "Bouton", galleryLink: "Lien vers la galerie", memberLink: "Lien espace partenaires" },
            ),
            2,
          ),
        },
      ],
    },
  ],
};

export const GalleryTextsGlobal: GlobalConfig = {
  slug: "galleryTexts",
  access: adminOnlyGlobal,
  label: "Page Galerie",
  admin: {
    preview: () => "/galerie",
    group: "Textes des sections",
    description: "Les textes de la page /galerie. Les photos se gèrent dans chaque événement (« Le site › Événements »).",
  },
  hooks,
  fields: (() => {
    const [kicker, title, lead, empty, closing, cta, back] = textFields(
      d.gallery,
      { kicker: "Surtitre", title: "Titre", lead: "Introduction", empty: "Message tant qu'il n'y a pas de photo", closing: "Phrase de fin", cta: "Bouton", back: "Lien de retour" },
      { title: "Une ligne par retour à la ligne ; la dernière est mise en couleur.", closing: "La dernière ligne est mise en couleur." },
    );
    return [
      { type: "collapsible", label: "Haut de page", fields: [{ type: "row", fields: [kicker, back] }, title, lead, empty] },
      { type: "collapsible", label: "Bas de page", fields: [{ type: "row", fields: [closing, cta] }] },
    ];
  })(),
};

export const QuotesGlobal: GlobalConfig = {
  slug: "quotes",
  access: adminOnlyGlobal,
  label: "Citations",
  admin: { ...at("chiffres"), group: "Le site", description: "Les deux citations plein écran : la première avant « En chiffres », la seconde après." },
  hooks,
  fields: [
    {
      name: "items",
      label: "Citations",
      type: "array",
      maxRows: 2,
      labels: { singular: "Citation", plural: "Citations" },
      defaultValue: defaultQuotes,
      admin: { initCollapsed: true, components: { RowLabel: "/components/admin/RowLabel#QuoteRowLabel" } },
      fields: [
        { name: "text", label: "Citation", type: "textarea", required: true, admin: { rows: 4, description: "Une ligne par retour à la ligne ; la dernière est mise en couleur." } },
        {
          type: "row",
          fields: [
            { name: "author", label: "Auteur", type: "text", required: true },
            { name: "context", label: "Contexte", type: "text", admin: { placeholder: "Le fil rouge de Doudou en 2022" } },
            { name: "year", label: "Année (en fond)", type: "number", min: 2000, max: 2100 },
          ],
        },
      ],
    },
  ],
};

export const SettingsGlobal: GlobalConfig = {
  slug: "settings",
  access: adminOnlyGlobal,
  label: "Réglages du site",
  admin: { ...at("contact"), group: "Réglages" },
  hooks,
  // Unnamed tabs: fields keep their place in the database.
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contact",
          description: "La section Contact, en bas de page. Les messages du formulaire arrivent à l'adresse ci-dessous.",
          fields: [
            { name: "contactEmail", label: "E-mail de contact", type: "email", required: true },
            texts(rows(textFields(d.contact, { title: "Titre de la section", message: "Libellé du champ message", submit: "Bouton d'envoi", success: "Message après envoi" }), 2)),
          ],
        },
        {
          label: "Menu",
          description: "Le nom de chaque section dans le menu plein écran, et les deux boutons toujours visibles en haut.",
          fields: [
            {
              name: "menu",
              label: false,
              type: "group",
              fields: [
                {
                  type: "collapsible",
                  label: "Sections du menu",
                  fields: rows(
                    textFields(
                      { pilote: d.menu.pilote, parcours: d.menu.parcours, suite: d.menu.suite, chiffres: d.menu.chiffres, courses: d.menu.courses, aventure: d.menu.aventure, galerie: d.menu.galerie, partenaires: d.menu.partenaires, contact: d.menu.contact },
                      { pilote: "1. Le pilote", parcours: "2. Le parcours", suite: "3. La suite", chiffres: "4. En chiffres", courses: "5. Courses", aventure: "6. L'aventure", galerie: "7. Galerie", partenaires: "8. Partenaires", contact: "9. Contact" },
                    ),
                  ),
                },
                {
                  type: "collapsible",
                  label: "Boutons du haut",
                  fields: rows(textFields({ cta: d.menu.cta, member: d.menu.member }, { cta: "Bouton rouge", member: "Lien espace partenaires" }), 2),
                },
              ],
            },
          ],
        },
        {
          label: "Google et partage",
          description: "Ce qu'affichent Google et les messageries quand on partage le lien du site.",
          fields: [
            {
              name: "seo",
              label: false,
              type: "group",
              fields: textFields(
                d.seo,
                { title: "Titre du site", description: "Description" },
                { title: "Laissez vide pour « Prénom « Surnom » #numéro — Pilote de karting », tiré de la fiche Pilote." },
              ),
            },
          ],
        },
        {
          label: "Couleurs",
          description: "Couleurs du site public. Videz un champ pour revenir à la couleur d'origine.",
          fields: [
            {
              name: "theme",
              label: false,
              type: "group",
              fields: rows(
                themeColors.map(({ name, label, default: d }) => ({
                  name,
                  label,
                  type: "text" as const,
                  defaultValue: d,
                  admin: { components: { Field: "/components/admin/ColorField#ColorField" } },
                  validate: (v: string | null | undefined) => !v || HEX.test(v) || "Format attendu : #rrggbb",
                })),
              ),
            },
          ],
        },
      ],
    },
  ],
};
