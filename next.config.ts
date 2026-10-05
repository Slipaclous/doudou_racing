import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    // Local uploads (dev) served by Payload, and static placeholders.
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/placeholders/**" }],
    remotePatterns: [
      // Uploads in production (Vercel Blob).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Placeholder source only; remove once real photos are uploaded.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  turbopack: { root: path.resolve(dirname) },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
