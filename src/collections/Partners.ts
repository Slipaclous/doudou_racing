import type { CollectionConfig } from "payload";
import { revalidateHooks } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partenaire", plural: "Partenaires" },
  admin: { preview: previewAt("partenaires"), useAsTitle: "name", defaultColumns: ["name", "role", "sector", "order"], group: "Le site" },
  hooks: revalidateHooks,
  fields: [
    { name: "name", label: "Nom", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "role", label: "Titre affiché", type: "text", admin: { placeholder: "Partenaire titre", description: "En rouge au-dessus du nom." } },
        { name: "sector", label: "Activité", type: "text", admin: { placeholder: "Génie civil & construction" } },
      ],
    },
    { name: "description", label: "Phrase de présentation", type: "textarea", admin: { rows: 2 } },
    {
      name: "order",
      label: "Ordre d'affichage",
      type: "number",
      defaultValue: 10,
      admin: { position: "sidebar", description: "Plus petit = affiché en premier." },
    },
    {
      name: "tier",
      label: "Niveau",
      admin: { position: "sidebar", description: "« Principal » est mis en avant sur le site." },
      type: "select",
      required: true,
      defaultValue: "officiel",
      options: [
        { label: "Partenaire principal", value: "principal" },
        { label: "Partenaire officiel", value: "officiel" },
        { label: "Fournisseur", value: "fournisseur" },
      ],
    },
    { name: "logo", label: "Logo", type: "upload", relationTo: "media" },
    { name: "url", label: "Site web", type: "text", admin: { placeholder: "https://" } },
  ],
};
