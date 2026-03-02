// Mock data for Vamos.net — placeholder until real APIs are connected

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: "Tour News" | "Rankings" | "Business" | "Academy";
  author: string;
  date: string;
  imageUrl: string;
  body: string;
}

export interface Match {
  id: string;
  tournament: string;
  round: string;
  team1: { player1: string; player2: string };
  team2: { player1: string; player2: string };
  score: string;
  status: "live" | "finished" | "upcoming";
  time?: string;
  court?: string;
}

export interface RankedPlayer {
  rank: number;
  name: string;
  country: string;
  countryCode: string;
  points: number;
  trend: "up" | "down" | "same";
  trendValue: number;
}

export const articles: Article[] = [
  {
    slug: "lebron-galán-clinch-dubai-masters",
    title: "Lebron and Galan Clinch Dubai Premier Padel Major Title",
    excerpt:
      "The Spanish pair delivered a masterclass in the final, defeating Coello and Tapia in straight sets to claim their third Major of the season.",
    category: "Tour News",
    author: "Maria Torres",
    date: "2026-03-01",
    imageUrl: "/placeholder-news-1.jpg",
    body: `<p>In a stunning display of padel at its finest, Alejandro Lebron and Juan Galan secured the Dubai Premier Padel Major title with a commanding 6-3, 7-5 victory over Arturo Coello and Agustin Tapia.</p>
<p>The match, played in front of a packed crowd at the Dubai Duty Free Tennis Stadium, showcased the very best of modern padel. Lebron and Galan controlled the tempo from the opening game, breaking Coello's serve in the fourth game to take an early lead.</p>
<p>"We came here with a clear game plan and executed it perfectly," said Lebron in the post-match press conference. "Dubai is a special tournament for us, and winning here means everything."</p>
<p>The second set was more competitive, with both pairs trading breaks before Galan produced a spectacular lob winner to break for 6-5, serving out the match with a pair of aces down the middle.</p>
<p>This victory marks the pair's third Major title of the 2026 season and solidifies their position at the top of the Premier Padel Race standings.</p>`,
  },
  {
    slug: "premier-padel-announces-2027-expansion",
    title: "Premier Padel Announces Landmark 2027 Calendar Expansion",
    excerpt:
      "The tour will expand to 30 events across five continents next year, including new stops in Tokyo, New York, and Cape Town.",
    category: "Business",
    author: "Carlos Mendez",
    date: "2026-02-28",
    imageUrl: "/placeholder-news-2.jpg",
    body: `<p>Premier Padel has officially announced its most ambitious calendar yet for the 2027 season, with 30 events spanning five continents and three new flagship venues.</p>
<p>The expansion includes highly anticipated debuts in Tokyo, New York, and Cape Town, marking padel's continued push into untapped markets. The calendar also features an increased prize money pool, with total season purses exceeding EUR 25 million.</p>
<p>"This is a defining moment for padel globally," said Luigi Carraro, President of the International Padel Federation. "We are seeing unprecedented demand from cities around the world to host Premier Padel events."</p>
<p>The 2027 season will kick off in January with the Kuwait Major before heading to South America for events in Buenos Aires and Santiago. The European swing begins in March with the Rome Open, followed by stops in Paris, Madrid, and Barcelona.</p>`,
  },
  {
    slug: "rising-star-martinez-breaks-top-10",
    title: "Rising Star Paula Martinez Breaks Into WPT Top 10",
    excerpt:
      "At just 19 years old, Martinez becomes the youngest player to crack the top 10 since the rankings system was reformed in 2024.",
    category: "Rankings",
    author: "Elena Ruiz",
    date: "2026-02-27",
    imageUrl: "/placeholder-news-3.jpg",
    body: `<p>Spanish teenager Paula Martinez has officially broken into the top 10 of the women's padel rankings, becoming the youngest player to achieve the feat since the ranking system was reformed in 2024.</p>
<p>Martinez, who turned 19 last month, has been on a meteoric rise since bursting onto the scene at the 2025 Madrid Open. Her aggressive playing style and powerful bandeja have drawn comparisons to some of the game's all-time greats.</p>
<p>"I still can't believe it," Martinez said after her latest quarterfinal run in Dubai. "I grew up watching these players on TV, and now I'm competing against them."</p>`,
  },
  {
    slug: "padel-coaching-revolution-ai-tools",
    title: "The Coaching Revolution: How AI Is Changing Padel Training",
    excerpt:
      "New AI-powered analysis tools are transforming how players and coaches approach training, with real-time shot tracking and tactical insights.",
    category: "Academy",
    author: "David Chen",
    date: "2026-02-25",
    imageUrl: "/placeholder-news-4.jpg",
    body: `<p>The world of padel coaching is undergoing a dramatic transformation thanks to new AI-powered analysis tools that provide real-time shot tracking, movement analysis, and tactical insights.</p>
<p>Companies like PadelVision and CourtAI are leading the charge, offering systems that can be installed in any padel court and provide instant feedback to players and coaches through mobile apps.</p>
<p>"We can now track every shot, every movement, and every decision a player makes on court," explains Dr. Ana Fernandez, head of sports science at PadelVision. "This gives coaches an unprecedented level of detail to work with."</p>`,
  },
  {
    slug: "coello-tapia-dominate-opening-rounds",
    title: "Coello and Tapia Dominate Opening Rounds at Milan Open",
    excerpt:
      "The top-seeded pair breeze through the first two rounds without dropping a set, sending a statement to the rest of the draw.",
    category: "Tour News",
    author: "Maria Torres",
    date: "2026-02-23",
    imageUrl: "/placeholder-news-5.jpg",
    body: `<p>Arturo Coello and Agustin Tapia made a strong statement at the Milan Open, cruising through the opening two rounds without dropping a set.</p>
<p>The world number one pair dispatched their first-round opponents 6-1, 6-2 before an equally convincing 6-3, 6-2 victory in the second round.</p>`,
  },
  {
    slug: "new-padel-center-opens-london",
    title: "Europe's Largest Padel Center Opens in London",
    excerpt:
      "The new 24-court facility in East London aims to make padel accessible to a wider UK audience, with programs for all skill levels.",
    category: "Business",
    author: "James Wright",
    date: "2026-02-20",
    imageUrl: "/placeholder-news-6.jpg",
    body: `<p>Europe's largest dedicated padel center has officially opened its doors in East London, featuring 24 courts, a pro shop, restaurant, and comprehensive coaching programs.</p>
<p>The facility, backed by a consortium of investors including several former professional tennis players, aims to accelerate padel's growth in the UK market.</p>`,
  },
];

export const matches: Match[] = [
  {
    id: "m1",
    tournament: "Milan Open",
    round: "Quarter-Final",
    team1: { player1: "A. Coello", player2: "A. Tapia" },
    team2: { player1: "F. Belasteguin", player2: "A. Ruiz" },
    score: "6-4, 3-2",
    status: "live",
    court: "Center Court",
  },
  {
    id: "m2",
    tournament: "Milan Open",
    round: "Quarter-Final",
    team1: { player1: "A. Lebron", player2: "J. Galan" },
    team2: { player1: "M. Di Nenno", player2: "F. Navarro" },
    score: "7-5, 6-3",
    status: "finished",
  },
  {
    id: "m3",
    tournament: "Milan Open",
    round: "Quarter-Final",
    team1: { player1: "P. Chingotto", player2: "F. Stupa" },
    team2: { player1: "J. Tello", player2: "F. Ruiz" },
    score: "",
    status: "upcoming",
    time: "18:00",
    court: "Court 2",
  },
  {
    id: "m4",
    tournament: "Milan Open",
    round: "Quarter-Final",
    team1: { player1: "A. Galan", player2: "M. Yanguas" },
    team2: { player1: "L. Campagnolo", player2: "J. Garrido" },
    score: "",
    status: "upcoming",
    time: "20:00",
    court: "Center Court",
  },
  {
    id: "m5",
    tournament: "WPT Valencia Open",
    round: "Semi-Final",
    team1: { player1: "G. Triay", player2: "A. Salazar" },
    team2: { player1: "A. Sanchez", player2: "P. Josemaria" },
    score: "6-3, 4-6, 7-5",
    status: "finished",
  },
  {
    id: "m6",
    tournament: "WPT Valencia Open",
    round: "Semi-Final",
    team1: { player1: "D. Brea", player2: "B. Gonzalez" },
    team2: { player1: "M. Ortega", player2: "L. Sainz" },
    score: "2-1",
    status: "live",
    court: "Pista Central",
  },
];

export const menRankings: RankedPlayer[] = [
  { rank: 1, name: "Arturo Coello", country: "Spain", countryCode: "ES", points: 14250, trend: "same", trendValue: 0 },
  { rank: 2, name: "Agustin Tapia", country: "Argentina", countryCode: "AR", points: 14250, trend: "same", trendValue: 0 },
  { rank: 3, name: "Alejandro Lebron", country: "Spain", countryCode: "ES", points: 12800, trend: "up", trendValue: 1 },
  { rank: 4, name: "Juan Galan", country: "Spain", countryCode: "ES", points: 12800, trend: "up", trendValue: 1 },
  { rank: 5, name: "Franco Stupaczuk", country: "Argentina", countryCode: "AR", points: 10900, trend: "down", trendValue: 2 },
  { rank: 6, name: "Martin Di Nenno", country: "Argentina", countryCode: "AR", points: 10450, trend: "down", trendValue: 1 },
  { rank: 7, name: "Federico Chingotto", country: "Argentina", countryCode: "AR", points: 9800, trend: "up", trendValue: 2 },
  { rank: 8, name: "Paquito Navarro", country: "Spain", countryCode: "ES", points: 9200, trend: "same", trendValue: 0 },
  { rank: 9, name: "Juan Tello", country: "Argentina", countryCode: "AR", points: 8750, trend: "up", trendValue: 3 },
  { rank: 10, name: "Fernando Belasteguin", country: "Argentina", countryCode: "AR", points: 8100, trend: "down", trendValue: 1 },
  { rank: 11, name: "Miguel Yanguas", country: "Spain", countryCode: "ES", points: 7600, trend: "up", trendValue: 1 },
  { rank: 12, name: "Ale Ruiz", country: "Argentina", countryCode: "AR", points: 7200, trend: "down", trendValue: 2 },
  { rank: 13, name: "Lucas Campagnolo", country: "Brazil", countryCode: "BR", points: 6800, trend: "up", trendValue: 4 },
  { rank: 14, name: "Javier Garrido", country: "Spain", countryCode: "ES", points: 6500, trend: "same", trendValue: 0 },
  { rank: 15, name: "Pablo Lima", country: "Brazil", countryCode: "BR", points: 6100, trend: "down", trendValue: 3 },
  { rank: 16, name: "Mike Yanguas", country: "Spain", countryCode: "ES", points: 5800, trend: "up", trendValue: 2 },
  { rank: 17, name: "Fede Ruiz", country: "Spain", countryCode: "ES", points: 5500, trend: "same", trendValue: 0 },
  { rank: 18, name: "Gonzalo Rubio", country: "Spain", countryCode: "ES", points: 5200, trend: "up", trendValue: 1 },
  { rank: 19, name: "Alex Chozas", country: "Argentina", countryCode: "AR", points: 4900, trend: "down", trendValue: 2 },
  { rank: 20, name: "Coki Nieto", country: "Spain", countryCode: "ES", points: 4600, trend: "up", trendValue: 3 },
];

export const womenRankings: RankedPlayer[] = [
  { rank: 1, name: "Gemma Triay", country: "Spain", countryCode: "ES", points: 13800, trend: "same", trendValue: 0 },
  { rank: 2, name: "Alejandra Salazar", country: "Spain", countryCode: "ES", points: 13100, trend: "same", trendValue: 0 },
  { rank: 3, name: "Ariana Sanchez", country: "Spain", countryCode: "ES", points: 12400, trend: "up", trendValue: 1 },
  { rank: 4, name: "Paula Josemaria", country: "Spain", countryCode: "ES", points: 12000, trend: "down", trendValue: 1 },
  { rank: 5, name: "Delfi Brea", country: "Argentina", countryCode: "AR", points: 11200, trend: "up", trendValue: 2 },
  { rank: 6, name: "Bea Gonzalez", country: "Spain", countryCode: "ES", points: 10800, trend: "up", trendValue: 1 },
  { rank: 7, name: "Marta Ortega", country: "Spain", countryCode: "ES", points: 9600, trend: "down", trendValue: 2 },
  { rank: 8, name: "Lucia Sainz", country: "Spain", countryCode: "ES", points: 9200, trend: "same", trendValue: 0 },
  { rank: 9, name: "Paula Martinez", country: "Spain", countryCode: "ES", points: 8700, trend: "up", trendValue: 5 },
  { rank: 10, name: "Tamara Icardo", country: "Spain", countryCode: "ES", points: 8100, trend: "down", trendValue: 1 },
  { rank: 11, name: "Claudia Fernandez", country: "Spain", countryCode: "ES", points: 7500, trend: "up", trendValue: 2 },
  { rank: 12, name: "Sofia Araujo", country: "Spain", countryCode: "ES", points: 7100, trend: "same", trendValue: 0 },
  { rank: 13, name: "Victoria Iglesias", country: "Spain", countryCode: "ES", points: 6700, trend: "down", trendValue: 1 },
  { rank: 14, name: "Patty Llaguno", country: "Spain", countryCode: "ES", points: 6300, trend: "down", trendValue: 3 },
  { rank: 15, name: "Marta Marrero", country: "Spain", countryCode: "ES", points: 5900, trend: "up", trendValue: 1 },
  { rank: 16, name: "Virginia Riera", country: "Argentina", countryCode: "AR", points: 5500, trend: "up", trendValue: 2 },
  { rank: 17, name: "Araceli Martinez", country: "Spain", countryCode: "ES", points: 5200, trend: "same", trendValue: 0 },
  { rank: 18, name: "Carla Mesa", country: "Spain", countryCode: "ES", points: 4800, trend: "up", trendValue: 3 },
  { rank: 19, name: "Jessica Castello", country: "Spain", countryCode: "ES", points: 4500, trend: "down", trendValue: 2 },
  { rank: 20, name: "Majo Sanchez Alayeto", country: "Spain", countryCode: "ES", points: 4200, trend: "up", trendValue: 1 },
];

export const tournaments = ["Milan Open", "WPT Valencia Open", "Dubai Major", "All Tournaments"];

export const newsCategories = ["All", "Tour News", "Rankings", "Business", "Academy"] as const;
