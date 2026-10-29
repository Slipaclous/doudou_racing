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
import { Members } from "./collections/Members";
import { RaceRegistrations } from "./collections/RaceRegistrations";
import {
  PilotGlobal,
  StatsGlobal,
  PitchGlobal,
  ZonesGlobal,
  FutureGlobal,
  SettingsGlobal,
  CareerTextsGlobal,
  RacesTextsGlobal,
  AdventureTextsGlobal,
  GalleryTextsGlobal,
  QuotesGlobal,
} from "./globals";
import { Events } from "./collections/Events";
import { previewPaths } from "./admin/sections";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Any real database (prod, preview, shared dev) needs a real secret: the fallback is public.
if (!process.env.PAYLOAD_SECRET && (process.env.NODE_ENV === "production" || process.env.DATABASE_URL)) {
  throw new Error("PAYLOAD_SECRET is required when DATABASE_URL is set or in production");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — #105 Admin" },
    // Site beside the form, opened at the section being edited; it reloads its content on each save.
    livePreview: {
      url: ({ collectionConfig, globalConfig }) => previewPaths[collectionConfig?.slug ?? globalConfig?.slug ?? ""] ?? "/",
      collections: ["seasons", "races", "events", "partners"],
      globals: ["pilot", "careerTexts", "future", "quotes", "stats", "upcomingTexts", "adventureTexts", "galleryTexts", "zones", "settings"],
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablette", name: "tablet", width: 820, height: 1180 },
        { label: "Ordinateur", name: "desktop", width: 1440, height: 900 },
      ],
    },
    theme: "light",
    components: {
      graphics: {
        Logo: "/components/admin/Brand#Logo",
        Icon: "/components/admin/Brand#Icon",
      },
      actions: ["/components/admin/ViewSite#ViewSiteAction"],
      beforeNavLinks: ["/components/admin/ViewSite#ViewSiteNavLink", "/components/admin/SiteNav#SiteNav"],
      views: {
        dashboard: { Component: "/components/admin/Dashboard#Dashboard" },
      },
    },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: "fr" },
  collections: [Seasons, Races, Events, Partners, Members, RaceRegistrations, Media, Users],
  globals: [
    PilotGlobal,
    CareerTextsGlobal,
    FutureGlobal,
    QuotesGlobal,
    StatsGlobal,
    RacesTextsGlobal,
    AdventureTextsGlobal,
    GalleryTextsGlobal,
    PitchGlobal,
    ZonesGlobal,
    SettingsGlobal,
  ],
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
      // Direct Blob CDN URLs instead of /api/media/file/…: otherwise each image goes through a serverless
      // function (cold start + Payload) before next/image can optimize it. Safe: media is public (Media.access.read).
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
