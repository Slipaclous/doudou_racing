import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Curtain } from "@/components/Curtain";
import { LivePreview } from "@/components/LivePreview";
import { getSeo, getThemeCss } from "@/content/getSite";
import "./globals.css";

const display = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
// Width axis on: the expanded cut sets the mid-level titles (h3), the normal one the text.
const body = Archivo({ variable: "--font-body", subsets: ["latin"], axes: ["wdth"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

// From "Réglages du site" > "Google et partage"; the default title is built from the pilot sheet.
export async function generateMetadata(): Promise<Metadata> {
  const { title, description, image } = await getSeo();
  return {
    // Share previews need absolute image URLs: the production domain on Vercel, localhost otherwise.
    metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
    title,
    description,
    openGraph: { title, description, images: [image], type: "website", locale: "fr_BE" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getThemeCss();
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {theme && <style>{theme}</style>}
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
        <Curtain />
        <LivePreview />
      </body>
    </html>
  );
}
