import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { fr } from "@payloadcms/translations/languages/fr";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Seasons } from "./collections/Seasons";
import { Races } from "./collections/Races";
import { Partners } from "./collections/Partners";
import { PilotGlobal, StatsGlobal, PitchGlobal, ZonesGlobal, SettingsGlobal } from "./globals";

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("PAYLOAD_SECRET is required in production");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — #105 Admin" },
    theme: "light",
    components: {
      graphics: {
        Logo: "/components/admin/Brand#Logo",
        Icon: "/components/admin/Brand#Icon",
      },
      actions: ["/components/admin/ViewSite#ViewSiteAction"],
      beforeNavLinks: ["/components/admin/ViewSite#ViewSiteNavLink"],
      views: {
        dashboard: { Component: "/components/admin/Dashboard#Dashboard" },
      },
    },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: "fr" },
  collections: [Seasons, Races, Partners, Media, Users],
  globals: [PilotGlobal, StatsGlobal, PitchGlobal, ZonesGlobal, SettingsGlobal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    // Schema changes only through versioned migrations (src/migrations), never auto-push:
    // dev and prod may share a database, and push can drop columns.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    // On Vercel, uploads go to Blob storage; locally without a token they stay on disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
