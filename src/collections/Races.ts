import { adminOnly } from "@/access";
import type { CollectionConfig } from "payload";
import { revalidateHooks } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";

export const Races: CollectionConfig = {
  slug: "races",
  access: adminOnly,
  labels: { singular: "Course", plural: "Courses · calendrier" },
  defaultSort: "date",
  admin: { preview: previewAt("courses"), useAsTitle: "name", defaultColumns: ["date", "name", "circuit", "country"], group: false },
  hooks: revalidateHooks,
  fields: [
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayOnly", displayFormat: "dd/MM/yyyy" }, description: "Les courses passées disparaissent automatiquement du site." },
    },
    { name: "name", label: "Nom de l'épreuve", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "circuit", label: "Circuit", type: "text", required: true },
        { name: "country", label: "Pays (code)", type: "text", required: true, maxLength: 3, admin: { placeholder: "BE" } },
        { name: "category", label: "Catégorie", type: "text", required: true },
      ],
    },
    {
      type: "collapsible",
      label: "Accueil des partenaires",
      admin: { description: "Visible uniquement dans l'espace partenaires." },
      fields: [
        { name: "partnersWelcome", label: "Ouverte aux partenaires (inscriptions possibles)", type: "checkbox", defaultValue: false },
        {
          name: "welcomeInfo",
          label: "Infos pratiques",
          type: "textarea",
          admin: { rows: 3, placeholder: "Rendez-vous au paddock à 9h, tente #105. Repas offert le midi.", condition: (d) => Boolean(d?.partnersWelcome) },
        },
        {
          name: "capacity",
          label: "Places (membres + invités)",
          type: "number",
          min: 1,
          admin: { description: "Laissez vide pour ne pas limiter.", condition: (d) => Boolean(d?.partnersWelcome) },
        },
        {
          name: "registrations",
          label: "Inscrits",
          type: "join",
          collection: "race-registrations",
          on: "race",
          admin: { defaultColumns: ["member", "guests", "note"], allowCreate: false, condition: (d) => Boolean(d?.partnersWelcome) },
        },
      ],
    },
  ],
};
