import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const display = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const body = Archivo({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edouard « Doudou » #105 — Pilote de karting",
  description: "Le parcours, les résultats et les prochaines courses d'Edouard, jeune pilote de karting belge.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
