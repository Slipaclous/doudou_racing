/**
 * Site colors editable from the back-office (Réglages du site → Couleurs).
 * Each key maps to a CSS variable declared in globals.css, whose value is the default here.
 */
export const themeColors = [
  { name: "background", cssVar: "--black", label: "Fond", default: "#0a0a0a" },
  { name: "surface", cssVar: "--black-2", label: "Fond secondaire", default: "#141414" },
  { name: "accent", cssVar: "--red", label: "Couleur d'accent", default: "#e10600" },
  { name: "accentDeep", cssVar: "--red-deep", label: "Accent foncé", default: "#9e0400" },
  { name: "touch", cssVar: "--touch", label: "Touches de couleur", default: "#e10600" },
  { name: "onAccent", cssVar: "--on-red", label: "Texte sur accent", default: "#f5f3ef" },
  { name: "text", cssVar: "--white", label: "Texte", default: "#f5f3ef" },
  { name: "muted", cssVar: "--grey", label: "Texte secondaire", default: "#a8a29e" },
] as const;

export type ThemeKey = (typeof themeColors)[number]["name"];
export type Theme = Record<ThemeKey, string>;

export const HEX = /^#[0-9a-f]{6}$/i;

export const defaultTheme = Object.fromEntries(themeColors.map((c) => [c.name, c.default])) as Theme;

/** CSS overriding the :root variables. Values are hex-checked, so they can't break out of the rule. */
export function themeCss(theme: Partial<Record<ThemeKey, string | null | undefined>>): string {
  const decls = themeColors
    .map(({ name, cssVar }) => {
      const v = theme[name];
      return v && HEX.test(v) ? `${cssVar}:${v};` : "";
    })
    .join("");
  return decls ? `:root{${decls}}` : "";
}
