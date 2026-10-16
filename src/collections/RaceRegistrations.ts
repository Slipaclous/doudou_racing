import type { CollectionConfig } from "payload";
import { adminOnly } from "@/access";

/** A partner-area member coming to a race (with their guests). Written by the partner area, read by admins. */
export const RaceRegistrations: CollectionConfig = {
  slug: "race-registrations",
  access: adminOnly,
  labels: { singular: "Inscription", plural: "Inscriptions aux courses" },
  admin: {
    group: "Espace partenaires",
    defaultColumns: ["race", "member", "guests", "note"],
    description: "Les partenaires s'inscrivent eux-mêmes depuis l'espace partenaires. Retrouvez aussi la liste sur chaque course.",
  },
  indexes: [{ fields: ["race", "member"], unique: true }],
  fields: [
    {
      type: "row",
      fields: [
        { name: "race", label: "Course", type: "relationship", relationTo: "races", required: true, index: true },
        { name: "member", label: "Membre", type: "relationship", relationTo: "members", required: true },
      ],
    },
    { name: "guests", label: "Invités (en plus du membre)", type: "number", min: 0, max: 10, defaultValue: 0, required: true },
    { name: "note", label: "Message pour l'équipe", type: "textarea", admin: { rows: 2 } },
  ],
};
