import type { CollectionConfig } from "payload";
import { revalidateHooks } from "@/hooks/revalidateSite";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Média", plural: "Médias" },
  admin: { group: "Médias" },
  // Files are shown on the public site, so anyone can read them.
  access: { read: () => true },
  hooks: revalidateHooks,
  upload: {
    // No SVG: an uploaded SVG served from our origin can carry scripts (XSS).
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"],
  },
  fields: [
    {
      name: "alt",
      label: "Description (accessibilité)",
      type: "text",
      admin: { description: "Ce que montre l'image, en une phrase. Laisser vide si purement décorative." },
    },
  ],
};
