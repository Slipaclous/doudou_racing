import type { Access } from "payload";

/** Admins are the `users` collection; partner-area members must never write site content. */
export const isAdmin: Access = ({ req }) => req.user?.collection === "users";

export const adminOnly = { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin };
export const adminOnlyGlobal = { read: isAdmin, update: isAdmin };
