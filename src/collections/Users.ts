import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Administrateur", plural: "Administrateurs" },
  admin: { useAsTitle: "email", group: "Réglages" },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  fields: [],
};
