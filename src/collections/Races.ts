import { adminOnly } from "@/access";
import type { CollectionConfig } from "payload";
import { revalidateHooks } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";

export const Races: CollectionConfig = {
  slug: "races",
  access: adminOnly,
  labels: { singular: "Course", plural: "Calendrier" },
  defaultSort: "date",
  admin: { preview: previewAt("courses"), useAsTitle: "name", defaultColumns: ["date", "name", "circuit", "country"], group: "Le site" },
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
  ],
};
