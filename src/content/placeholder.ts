import type { Site } from "./schema";

// Placeholder content: used when no database is configured, and as seed data.
export const placeholderSite: Site = {
  pilot: {
    firstName: "Edouard",
    nickname: "Doudou",
    lastName: "Godfroid",
    number: 105,
    nationality: "Belgique",
    // Born 5 January 2012 in Charleroi.
    age: 14,
    category: "X30 Junior",
    team: "Team Eurokarting Mariembourg",
    tagline: "Champion de Belgique 2023. Et le plus dur reste à faire.",
    heroPoster: "https://images.unsplash.com/photo-1541447270888-83e8494f9c06?w=2000&q=80",
    bio: [
      "Né le 5 janvier 2012 à Charleroi, Edouard reçoit son premier kart à 4 ans. Son premier circuit : le parking du Delhaize de Montigny-le-Tilleul, avec son papa Michaël, ancien pilote amateur.",
      "À 5 ans, il débute sur un vrai circuit au Karting des Fagnes, à Mariembourg, avec son premier mentor, l'ancien pilote Jonathan Dhaese. Depuis septembre 2019, il roule pour le Team Eurokarting de Mariembourg.",
      "Vice-champion de Belgique en 2021, champion de Belgique Mini en 2023, il roule depuis 2024 en catégorie Junior. Son fil rouge : « Les sensations fortes ne sont pas dans la victoire mais dans le combat. »",
    ],
  },
  seasons: [
    { year: 2017, category: "Baby kart", headline: "Débuts sur circuit", text: "À 5 ans, premiers tours au Karting des Fagnes à Mariembourg, avec Jonathan Dhaese comme mentor.", result: "Premier circuit", image: "/placeholders/season-2019.svg" },
    { year: 2019, category: "Mini", headline: "Entrée en team", text: "Premières courses, puis arrivée au Team Eurokarting de Mariembourg en septembre.", result: "Victoire endurance BSK", image: "/placeholders/season-2019.svg" },
    { year: 2020, category: "Mini", headline: "Premier championnat", text: "IAME Series Benelux, saison réduite à trois meetings par le Covid-19.", result: "16e sur 38", image: "/placeholders/season-2021.svg" },
    { year: 2021, category: "Mini Rookie", headline: "Sur le podium national", text: "IAME Series Benelux, IAME Euro Series et Eurocup du Mans. Jusqu'à deux entraînements par semaine.", result: "Vice-champion de Belgique", image: "/placeholders/season-2021.svg" },
    { year: 2022, category: "Mini Warriors", headline: "Benelux et Euroseries", text: "Championnat Benelux et championnat européen. Objectif : apprendre et remonter sur les podiums.", result: "Benelux & Euroseries", image: "/placeholders/season-2023.svg" },
    { year: 2023, category: "Mini", headline: "Champion", text: "« Je ne perds jamais, soit je gagne, soit j'apprends. » Le titre national au bout de la saison.", result: "Champion de Belgique", image: "/placeholders/season-2023.svg" },
    { year: 2024, category: "Junior", headline: "Le saut en Junior", text: "Année de transition dans une catégorie plus rapide, face à des pilotes plus âgés.", result: "Transition", image: "/placeholders/season-2025.svg" },
  ],
  // Source: client profile sheet (January 2024). Update in /admin with current figures.
  stats: [
    { value: 6, label: "Victoires", details: ["Course d'endurance BSK, juin 2019"] },
    { value: 19, label: "Podiums", details: [] },
    { value: 1, label: "Titre national", details: ["Champion de Belgique Mini 2023"] },
    { value: 10, label: "Années au volant", details: ["Premier kart à 4 ans, en 2016"] },
  ],
  // Sample content: replace in /admin ("L'aventure" and "La suite").
  events: [
    { title: "Le rallye #105", type: "rallye", date: "2026-06-14", place: "Ardennes belges", guests: 60, text: "Une journée sur les routes des Ardennes avec les partenaires et leurs invités, arrivée au circuit et repas au paddock.", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80" },
    { title: "Journée partenaires", type: "partenaires", date: "2026-05-02", place: "Karting des Fagnes, Mariembourg", guests: 35, text: "Les partenaires prennent le volant : séances chronométrées, briefing avec Doudou et remise des prix.", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80" },
    { title: "Dans les coulisses du paddock", type: "paddock", date: "2026-04-11", place: "Genk", guests: 12, text: "Accueil sous la tente #105, visite du stand, du camion et de la grille avant le départ.", image: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1600&q=80" },
    { title: "Soirée clients", type: "clients", date: "2026-03-20", place: "Charleroi", guests: 80, text: "Les partenaires invitent leurs clients à une soirée autour du kart et de la saison à venir.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80" },
  ],
  future: [
    { year: 2027, category: "X30 Junior", title: "Le podium européen", text: "Une saison complète en IAME Euro Series, avec l'objectif de monter sur le podium final." },
    { year: 2028, category: "OK Senior", title: "Le grand saut", text: "Passage en catégorie reine du karting, face aux meilleurs pilotes européens." },
    { year: 2029, category: "Monoplace", title: "Les premiers tours en F4", text: "Les premiers essais en monoplace, la marche suivante vers le sport automobile." },
  ],
  // The client calendar is empty: add the 2027 races in /admin.
  races: [],
  pitch: [
    { title: "Visibilité", text: "Votre logo sur le kart, la combinaison et le casque, sur des circuits suivis dans toute l'Europe." },
    { title: "Réseau", text: "Un accès direct à l'écosystème du sport automobile : équipes, partenaires, familles d'entrepreneurs." },
    { title: "Événements", text: "Invitations sur les circuits, journées clients, contenus exclusifs pour vos équipes." },
    { title: "Histoire", text: "Associer votre marque à un jeune talent belge, dès le début de son ascension." },
  ],
  // Logos from the client's current site (doudouracing.be/partenaires). Tiers are a guess: confirm with the client.
  partners: [
    { name: "Laurenty", tier: "principal", logo: "/placeholders/partners/Laurenty.jpg" },
    { name: "Carlife", tier: "principal", logo: "/placeholders/partners/carlife-1.jpg" },
    { name: "AFT", tier: "officiel", logo: "/placeholders/partners/AFT.jpg" },
    { name: "Alumatic", tier: "officiel", logo: "/placeholders/partners/Alumatic.jpg" },
    { name: "Idealarme SRL", tier: "officiel", logo: "/placeholders/partners/Idealarme-SRL.jpg" },
    { name: "Entreprise Derey", tier: "officiel", logo: "/placeholders/partners/Derey-Entreprise-1-705x705.jpg" },
    { name: "Krzewinski", tier: "officiel", logo: "/placeholders/partners/Krzewinski.jpg" },
    { name: "La Fiduciaire", tier: "officiel", logo: "/placeholders/partners/FIDUCIAIRE.jpg" },
    { name: "Contraste", tier: "officiel", logo: "/placeholders/partners/Contraste-Logo.jpg" },
    { name: "Cuisines Immo", tier: "officiel", logo: "/placeholders/partners/cuisines-immo.jpg" },
    { name: "Dupuis", tier: "officiel", logo: "/placeholders/partners/Dupuis.jpg" },
    { name: "Enovis", tier: "officiel", logo: "/placeholders/partners/enovis.jpg" },
    { name: "GTO", tier: "officiel", logo: "/placeholders/partners/Doudou-LOGO-Partenaires-GTO-72dpi.jpg" },
    { name: "Louyet", tier: "officiel", logo: "/placeholders/partners/louyet.jpg" },
    { name: "McDonald's", tier: "officiel", logo: "/placeholders/partners/McDo.png" },
    { name: "NYCS", tier: "officiel", logo: "/placeholders/partners/NYCS.jpg" },
    { name: "Ortho Supply", tier: "officiel", logo: "/placeholders/partners/Ortho-Supply.jpg" },
    { name: "Paulus", tier: "officiel", logo: "/placeholders/partners/Doudou-LOGO-Partenaires-72dpi-PAULUS.jpg" },
    { name: "Wooh", tier: "officiel", logo: "/placeholders/partners/wooh.jpg" },
    { name: "Choco", tier: "fournisseur", logo: "/placeholders/partners/choco-702x705.jpg" },
    { name: "MonGrip", tier: "fournisseur", logo: "/placeholders/partners/logo-mongrip-sfondo-nero-705x705.png" },
  ],
  zones: [
    { id: "nose", label: "Carénage avant", text: "Le premier élément visible en photo, de face comme de trois quarts." },
    { id: "pods", label: "Pontons latéraux", text: "La plus grande surface du kart, présente sur chaque prise de vue latérale." },
    { id: "plate", label: "Plaque numéro", text: "Associée au #105 sur toutes les images de course." },
    { id: "rear", label: "Pare-chocs arrière", text: "Ce que voient les concurrents, tour après tour." },
  ],
  contactEmail: "partners@doudouracing.be",
};


