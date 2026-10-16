import { z } from "zod";

export const pilotSchema = z.object({
  firstName: z.string(),
  nickname: z.string(),
  lastName: z.string(),
  number: z.number().int().positive(),
  nationality: z.string(),
  age: z.number().int().positive(),
  category: z.string(),
  team: z.string(),
  tagline: z.string(),
  heroVideo: z.string().optional(),
  heroPoster: z.string(),
  bio: z.array(z.string()).min(1),
});

export const seasonSchema = z.object({
  year: z.number().int(),
  category: z.string(),
  headline: z.string(),
  text: z.string(),
  result: z.string(),
  image: z.string(),
});

export const statSchema = z.object({
  value: z.number().int().nonnegative(),
  label: z.string(),
  details: z.array(z.string()).default([]),
});

export const raceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string(),
  circuit: z.string(),
  country: z.string(),
  category: z.string(),
});

export const pitchSchema = z.object({
  title: z.string(),
  text: z.string(),
  image: z.string().optional(),
});

export const partnerSchema = z.object({
  name: z.string(),
  tier: z.enum(["principal", "officiel", "fournisseur"]),
  role: z.string().optional(),
  sector: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  url: z.string().url().optional(),
  kartZone: z.enum(["nose", "pods", "plate", "rear"]).optional(),
});

export const zoneSchema = z.object({
  id: z.enum(["nose", "pods", "plate", "rear"]),
  label: z.string(),
  text: z.string(),
});

export const siteSchema = z.object({
  pilot: pilotSchema,
  seasons: z.array(seasonSchema),
  stats: z.array(statSchema),
  races: z.array(raceSchema),
  pitch: z.array(pitchSchema),
  partners: z.array(partnerSchema),
  zones: z.array(zoneSchema),
  contactEmail: z.string().email(),
});

export type Site = z.infer<typeof siteSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type Race = z.infer<typeof raceSchema>;
export type Zone = z.infer<typeof zoneSchema>;
