import type { GlobalConfig } from "payload";
import { revalidateSite } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";
import { HEX, themeColors } from "@/content/theme";

const hooks = { afterChange: [revalidateSite] };
const at = (anchor: string) => ({ preview: previewAt(anchor) });

export const PilotGlobal: GlobalConfig = {
  slug: "pilot",
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
      ],
    },
  ],
};

export const StatsGlobal: GlobalConfig = {
  slug: "stats",
  label: "Chiffres",
  admin: { ...at("chiffres"), group: "Le site" },
  hooks,
  fields: [
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
};

export const PitchGlobal: GlobalConfig = {
  slug: "pitch",
  label: "Pourquoi le soutenir",
  admin: { ...at("pourquoi"), group: "Sponsors" },
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
  label: "Emplacements sponsor",
  admin: { ...at("partenaires"), group: "Sponsors", description: "Les quatre zones mises en avant sur le schéma du kart." },
  hooks,
  fields: [
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
};

export const SettingsGlobal: GlobalConfig = {
  slug: "settings",
  label: "Réglages du site",
  admin: { ...at("contact"), group: "Réglages" },
  hooks,
  fields: [
    { name: "contactEmail", label: "E-mail de contact", type: "email", required: true },
    {
      name: "theme",
      label: "Couleurs",
      type: "group",
      admin: { description: "Couleurs du site public. Videz un champ pour revenir à la couleur d'origine." },
      fields: [
        {
          type: "row",
          fields: themeColors.map(({ name, label, default: d }) => ({
            name,
            label,
            type: "text" as const,
            defaultValue: d,
            admin: { components: { Field: "/components/admin/ColorField#ColorField" } },
            validate: (v: string | null | undefined) => !v || HEX.test(v) || "Format attendu : #rrggbb",
          })),
        },
      ],
    },
  ],
};
