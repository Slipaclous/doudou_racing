import type { Site } from "./schema";

// Placeholder content: used when no database is configured, and as seed data.
export const placeholderSite: Site = {
  pilot: {
    firstName: "Edouard",
    nickname: "Doudou",
    lastName: "",
    number: 105,
    nationality: "Belgique",
    age: 13,
    category: "OK-Junior",
    team: "Team à confirmer",
    tagline: "Treize ans. Un volant. Aucune envie de freiner.",
    heroPoster: "https://images.unsplash.com/photo-1541447270888-83e8494f9c06?w=2000&q=80",
    bio: [
      "Edouard a pris le volant d'un kart à six ans, sur la piste de Mariembourg.",
      "Aujourd'hui, il roule en OK-Junior et affronte les meilleurs pilotes européens de sa génération.",
    ],
  },
  seasons: [
    { year: 2019, category: "Mini", headline: "Premier tour", text: "Découverte du kart et premières courses régionales.", result: "Rookie de l'année", image: "/placeholders/season-2019.svg" },
    { year: 2021, category: "Mini 60", headline: "Premier podium", text: "Une saison complète en championnat de Belgique.", result: "P3 Championnat BE", image: "/placeholders/season-2021.svg" },
    { year: 2023, category: "OK-N Junior", headline: "Champion", text: "Six victoires et le titre national.", result: "Champion de Belgique", image: "/placeholders/season-2023.svg" },
    { year: 2025, category: "OK-Junior", headline: "L'Europe", text: "Premières manches du championnat d'Europe FIA.", result: "Top 15 WSK", image: "/placeholders/season-2025.svg" },
  ],
  stats: [
    { value: 14, label: "Victoires", details: ["Mariembourg 2021", "Genk 2022", "Spa 2022", "Genk 2023", "Mariembourg 2023", "Mariembourg 2023", "Spa 2023", "Genk 2023", "Mülsen 2024", "Genk 2024", "Mariembourg 2024", "Genk 2025"] },
    { value: 31, label: "Podiums", details: ["Saison 2021 : 5", "Saison 2022 : 7", "Saison 2023 : 11", "Saison 2024 : 6", "Saison 2025 : 2"] },
    { value: 9, label: "Pole positions", details: ["Genk 2022", "Mariembourg 2023", "Genk 2023", "Spa 2023", "Genk 2024", "Lonato 2025"] },
    { value: 2, label: "Titres nationaux", details: ["Champion de Belgique Mini 2022", "Champion de Belgique OK-N Junior 2023"] },
  ],
  races: [
    { date: "2026-10-18", name: "BNL Karting Series — Finale", circuit: "Genk", country: "BE", category: "OK-Junior" },
    { date: "2026-11-08", name: "WSK Final Cup", circuit: "Lonato", country: "IT", category: "OK-Junior" },
    { date: "2027-02-14", name: "WSK Super Master R1", circuit: "La Conca", country: "IT", category: "OK-Junior" },
    { date: "2027-03-21", name: "Champions of the Future", circuit: "Valencia", country: "ES", category: "OK-Junior" },
  ],
  pitch: [
    { title: "Visibilité", text: "Votre logo sur le kart, la combinaison et le casque, sur des circuits suivis dans toute l'Europe." },
    { title: "Réseau", text: "Un accès direct à l'écosystème du sport automobile : équipes, partenaires, familles d'entrepreneurs." },
    { title: "Événements", text: "Invitations sur les circuits, journées clients, contenus exclusifs pour vos équipes." },
    { title: "Histoire", text: "Associer votre marque à un jeune talent belge, dès le début de son ascension." },
  ],
  partners: [
    { name: "Laurenty Services", tier: "principal", role: "Partenaire titre", sector: "Groupe multi-services & propreté", description: "Accompagnement du projet sportif Benelux & Europe", url: "https://laurenty.com/" },
    { name: "Carlife Carrosserie", tier: "principal", role: "Partenaire majeur", sector: "Soutien technique & préparation", description: "Partenaire fidèle de la première heure de Doudou" },
    { name: "AFT & Alumatic", tier: "officiel", role: "Partenaire industriel", sector: "Châssis & équipements de pointe", description: "Soutien aux compétitions internationales IAME", url: "https://www.alumatic.be/" },
    { name: "Idealarme SRL", tier: "officiel", role: "Partenaire sécurité", sector: "Protection & télémétrie", description: "Partenaire officiel de la saison Doudou Racing", url: "https://idealarme.be/" },
    { name: "Entreprise Derey", tier: "officiel", role: "Partenaire entreprise", sector: "Génie civil & construction", description: "Engagement pour la jeunesse et le sport automobile", url: "https://derey.be/" },
    { name: "Fiduciaire Krzewinski", tier: "officiel", role: "Partenaire conseil", sector: "Gestion & fiscalité sportive", description: "Structure et accompagnement de carrière" },
  ],
  zones: [
    { id: "nose", label: "Carénage avant", text: "Le premier élément visible en photo, de face comme de trois quarts." },
    { id: "pods", label: "Pontons latéraux", text: "La plus grande surface du kart, présente sur chaque prise de vue latérale." },
    { id: "plate", label: "Plaque numéro", text: "Associée au #105 sur toutes les images de course." },
    { id: "rear", label: "Pare-chocs arrière", text: "Ce que voient les concurrents, tour après tour." },
  ],
  contactEmail: "contact@doudou105.be",
};


