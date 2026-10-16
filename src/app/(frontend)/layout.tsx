import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Curtain } from "@/components/Curtain";
import { getThemeCss } from "@/content/getSite";
import "./globals.css";

const display = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
// Width axis on: the expanded cut sets the mid-level titles (h3), the normal one the text.
const body = Archivo({ variable: "--font-body", subsets: ["latin"], axes: ["wdth"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edouard « Doudou » #105 — Pilote de karting",
  description: "Le parcours, les résultats et les prochaines courses d'Edouard, jeune pilote de karting belge.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getThemeCss();
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {theme && <style>{theme}</style>}
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
        <Curtain />
      </body>
    </html>
  );
}
