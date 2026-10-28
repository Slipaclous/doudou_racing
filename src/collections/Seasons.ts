import { adminOnly } from "@/access";
import type { CollectionConfig } from "payload";
import { revalidateHooks } from "@/hooks/revalidateSite";
import { previewAt } from "@/admin/sections";

export const Seasons: CollectionConfig = {
  slug: "seasons",
  access: adminOnly,
  labels: { singular: "Saison", plural: "Le parcours · saisons" },
  defaultSort: "year",
  admin: { preview: previewAt("parcours"), useAsTitle: "headline", defaultColumns: ["year", "headline", "category", "result"], group: false },
  hooks: revalidateHooks,
  fields: [
    {
      type: "row",
      fields: [
        { name: "year", label: "Année", type: "number", required: true, min: 2000, max: 2100 },
        { name: "category", label: "Catégorie", type: "text", required: true },
      ],
    },
    { name: "headline", label: "Titre", type: "text", required: true, admin: { description: "Deux ou trois mots, affichés en très grand." } },
    { name: "text", label: "Texte", type: "textarea", required: true },
    { name: "result", label: "Résultat marquant", type: "text", required: true },
    { name: "image", label: "Photo", type: "upload", relationTo: "media" },
  ],
};
