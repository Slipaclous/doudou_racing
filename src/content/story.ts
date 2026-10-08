// Story content from the client's current site (doudouracing.be). Not in the CMS yet: test before adding fields.

export const quotes = [
  {
    id: "mandela",
    lines: ["Je ne perds jamais.", "Soit je gagne,", "soit j'apprends."],
    accent: 2,
    author: "Nelson Mandela",
    context: "Le fil rouge de Doudou en 2022",
    year: 2022,
  },
  {
    id: "schumacher",
    lines: ["Les sensations fortes", "ne sont pas", "dans la victoire,", "mais dans le combat."],
    accent: 3,
    author: "Michael Schumacher",
    context: "Le fil rouge de Doudou en 2024",
    year: 2024,
  },
] as const;

export type Quote = (typeof quotes)[number];

/** Facts from the client's profile sheet (January 2024). */
export const pilotSheet = {
  birth: "5 janvier 2012",
  birthplace: "Charleroi",
  firstKart: "4 ans",
  height: "1m53",
  weight: "39 kg",
  mentor: "Jonathan Dhaese",
};
