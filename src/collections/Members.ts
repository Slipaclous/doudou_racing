import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from "payload";
import { isAdmin } from "@/access";
import { sendInvitation } from "@/members/invite";

const adminOrSelf: Access = ({ req }) =>
  req.user?.collection === "users" || (req.user?.collection === "members" && { id: { equals: req.user.id } });

// A new member gets an e-mail to choose their password: admins never pick or share one.
const inviteOnCreate: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === "create") await sendInvitation(req.payload, doc.email, { req });
};

// Their race registrations go with them.
const removeRegistrations: CollectionAfterDeleteHook = async ({ id, req }) => {
  await req.payload.delete({ collection: "race-registrations", where: { member: { equals: id } }, req });
};

/**
 * Sponsors' accounts for the partner area (/espace-partenaires). Separate from admins:
 * they can't open /admin and only see what the partner area pages show them.
 */
export const Members: CollectionConfig = {
  slug: "members",
  labels: { singular: "Membre partenaire", plural: "Membres partenaires" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "partner", "email"],
    group: "Espace partenaires",
    description: "À la création, le membre reçoit un e-mail pour choisir son propre mot de passe : saisissez un mot de passe provisoire quelconque, il n'est jamais communiqué.",
  },
  auth: {
    tokenExpiration: 30 * 24 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    admin: () => false,
    read: adminOrSelf,
    create: isAdmin,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: { afterChange: [inviteOnCreate], afterDelete: [removeRegistrations] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", label: "Nom complet", type: "text", required: true },
        { name: "jobTitle", label: "Fonction", type: "text", admin: { placeholder: "Directeur commercial" } },
      ],
    },
    {
      name: "partner",
      label: "Partenaire",
      type: "relationship",
      relationTo: "partners",
      required: true,
      // A member can't move themselves to another sponsor.
      access: { update: ({ req }) => req.user?.collection === "users" },
    },
    {
      name: "resendInvitation",
      type: "ui",
      admin: { position: "sidebar", components: { Field: "/components/admin/ResendInvitation#ResendInvitation" } },
    },
  ],
};
