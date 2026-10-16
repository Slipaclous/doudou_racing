import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getThemeCss } from "@/content/getSite";
import "./globals.css";

const display = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const body = Archivo({ variable: "--font-body", subsets: ["latin"] });
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
      </body>
    </html>
  );
}
