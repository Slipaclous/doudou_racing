import type { CollectionConfig } from "payload";
import { adminOnly } from "@/access";
import { revalidateHooks } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";

/** What partners live around Doudou: rally, partner days, paddock meetings, client invitations. */
export const Events: CollectionConfig = {
  slug: "events",
  access: adminOnly,
  labels: { singular: "Événement", plural: "L'aventure · événements" },
  defaultSort: "-date",
  admin: {
    preview: previewAt("aventure"),
    useAsTitle: "title",
    defaultColumns: ["date", "title", "type", "place"],
    group: false,
    description:
      "Les moments vécus avec les partenaires. Sur l'accueil, les photos principales des 4 plus récents illustrent les avantages du pass ; la page Galerie montre tous les événements qui ont au moins une photo.",
  },
  hooks: revalidateHooks,
  fields: [
    {
      type: "row",
      fields: [
        { name: "title", label: "Titre", type: "text", required: true, admin: { placeholder: "Rallye #105" } },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          defaultValue: "partenaires",
          options: [
            { label: "Rallye annuel", value: "rallye" },
            { label: "Activité partenaires", value: "partenaires" },
            { label: "Rencontre au paddock", value: "paddock" },
            { label: "Invitation clients", value: "clients" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "date", label: "Date", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" } } },
        { name: "place", label: "Lieu", type: "text", admin: { placeholder: "Karting des Fagnes, Mariembourg" } },
        { name: "guests", label: "Participants", type: "number", min: 0, admin: { description: "Affiché « 40 invités »." } },
      ],
    },
    { name: "text", label: "Texte", type: "textarea", required: true, admin: { rows: 3, description: "Deux ou trois phrases : ce qu'on y a vécu." } },
    { name: "image", label: "Photo principale", type: "upload", relationTo: "media" },
    {
      name: "gallery",
      label: "Galerie",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: { description: "Toutes les photos de l'événement, affichées sur la page Galerie (la photo principale y est déjà)." },
    },
  ],
};
