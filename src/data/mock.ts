// Mock data for Vamos.net — placeholder until PadelAPI.org is connected
// Last updated: 2026-03-02 with accurate 2026 season data

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

// --- ARTICLES (accurate 2026 season data) ---

export const articles: Article[] = [
  {
    slug: "miami-p1-2026-preview",
    title: "All Eyes on Miami P1 as Premier Padel Returns to Florida",
    excerpt:
      "Bigger draw, bigger stakes, and unfinished business from Cancún. Here's everything you need to know about the Miami P1.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-25",
    imageUrl: "/images/news/miami-p1-2026-preview.jpg",
    body: `<p>The Premier Padel tour barely had time to leave Mexico before landing in Florida. The Miami P1, padel's biggest event on American soil, is underway at the Miami Beach Convention Center through March 29 — a step up from Cancún's P2 category, with a larger draw (40 men's pairs, 28 women's), nearly double the prize money (€479,068), and more ranking points on the line. After a week of upsets in the Caribbean heat, the question is whether the top pairs can reassert control or whether the chaos follows them north.</p>
<p>The men's draw has handed us the storyline everyone wanted: Arturo Coello and Agustín Tapia are in the same half as Juan Lebrón and Leo Augsburger. Just days after their three-set final in Cancún, the Golden Boys and El Lobo's new partnership could collide again before the final — this time in the semis. Their rivalry is fast becoming the defining thread of the 2026 season. Augsburger showed in Cancún that he can push Coello and Tapia to the limit, and the American crowd will get the rematch if both pairs survive the early rounds.</p>
<p>On the other side, Chingalán arrive with something to prove. Their quarterfinal exit in Cancún — at the hands of Sanyo Gutiérrez and Gonzalo Alfonso — was a genuine shock for a pair that had started the year 9-1. They're the defending Miami champions from 2025 and second seeds here. Fede Chingotto's pre-Cancún comments about the sport needing new faces took on an ironic edge after the loss, and both he and Galán will be determined to respond. Stupaczuk and Yanguas sit third in the seedings in Chingalán's half, setting up a potential semifinal between two pairs that both underperformed in Mexico.</p>
<p>One of the week's most interesting subplots is the return of Pablo Cardona, seeded 9th alongside Javi Leal. Cardona has been out for months with injury, and his comeback adds another variable to a draw that already feels wide open. Meanwhile, Aguirre and Arroyo — the revelation of Cancún who fought through to the semis from nowhere — are seeded 14th here. If their Mexico run was more than a flash, Miami is where they prove it.</p>
<p>The women's draw is more straightforward on paper but no less compelling. Gemma Triay and Delfina Brea come in as top seeds with two consecutive titles — Gijón and Cancún — and the Nerone-coached pair look more dominant now than at any point since mid-2024. Paula Josemaría and Bea González are second seeds in the opposite half, giving them a more open route to the final, but they'll need to find an answer for Triay after being taken apart 6-1 in the second set of the Cancún final. Ari Sánchez and Andrea Ustero could be the pair to watch for an upset — they share Perlamita's half and have the power game to cause problems on indoor courts.</p>
<p>Miami matters beyond the draw. This is padel's second year at the Convention Center, and the event is part of a deliberate push to build a US audience. Fernando Belasteguín, the sport's all-time greatest player, is behind the event, and the pressure to deliver a spectacle in front of an American crowd that's still learning the sport means every match carries extra weight. Last year's inaugural edition helped put padel on the map in South Florida. This year needs to take it further.</p>
<p>The finals are set for Sunday, March 29 — 4pm local time for the women, followed by the men. After what Cancún delivered, nobody's making predictions. That feels about right.</p>`,
  },
  {
    slug: "cancun-p2-2026-recap",
    title: "Cancún Crowns Its Kings and Queens — But Not Without a Fight",
    excerpt:
      "The Golden Boys survive a three-set final, Chingalán fall to underdogs, and Triay-Brea make it two in a row in the most unpredictable week of Premier Padel this season.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-24",
    imageUrl: "/images/news/cancun-p2-champions-2026.jpg",
    body: `<p>The Cancún P2 closed out on Sunday night after the most unpredictable week of Premier Padel this season. Weather delays, outdoor court chaos, and a bracket that tore up the script from round one — Mexico gave the tour everything it could handle, and two finals to match.</p>
<p>Arturo Coello and Agustín Tapia took the men's title, beating Juan Lebrón and Leo Augsburger 5-7, 6-3, 7-5 in just over two hours. The Golden Boys had to come from a set down to do it. El Lobo was vintage in the opener, threading chiquitas and millimetric lobs that had Coello scrambling all set. Augsburger — who won his first Premier Padel title alongside Di Nenno at the Madrid P1 last September — brought the firepower that got them the first set on a tiebreak, and for a moment it felt like the script had flipped. But Mozart found his range in the second set, shelving his usual flair for a defensive role that smothered everything Lebrón threw at him. The decider was a knife fight. When a second tiebreak looked inevitable, a Tapia drop volley that died on the line and a couple of costly net errors from the challengers settled it. Lebrón and Augsburger walked away without the trophy but having made one thing clear: this pair is here to stay.</p>
<p>The road to the final was where the real chaos lived. Chingalán — the second seeds who arrived in Mexico on a tear — were knocked out in the quarterfinals by Sanyo Gutiérrez and Gonzalo Alfonso, 7-5, 6-4. It was an upset that blew the draw wide open and denied the tour the Golden Boys–Chingalán final everyone had expected. Just days before the loss, Fede Chingotto had spoken at a press conference about the sport needing fresh faces. "When this circuit was created, the goal was to bring out new contenders," he said. "I think padel needs that." Mexico obliged, though perhaps not the way he had in mind.</p>
<p>Equally remarkable was the run of Tolito Aguirre and Alejandro Arroyo, a pair nobody had circled in the draw, who fought their way to the semifinals — coming back from a set down against Navarro and Guerrero in the round of 16, then taking out Stupaczuk and Yanguas in straight sets in the quarters, before eventually falling to the Golden Boys. Collado and Hernández caused an early stir too, eliminating Di Nenno and Momo González in a three-and-a-half-hour round of 32 marathon that went to two tiebreaks. Even Coello and Tapia had their own scare: Lijo and Arce took them to a third-set tiebreak in the round of 16 before the number ones scraped through.</p>
<p>On the women's side, Gemma Triay and Delfina Brea made it two consecutive titles following Gijón. They beat Paula Josemaría and Bea González 7-6(4), 6-1 in a final that was tight for a set and completely one-sided after that. Triay was the difference — hunting every short ball and utterly locked in during the tiebreak when it could have gone either way. Perlamita hung in through a strong first set but couldn't keep the intensity up, and the second was a procession. The Nerone effect is real: since Sebastián Nerone took over coaching duties, Triay and Brea look like the pair that dominated 2023–24, but with an extra gear.</p>
<p>The tour barely has time to breathe. The Miami P1 starts this week — a step up in category, deeper draw, bigger points. After Cancún proved that nobody is safe on any given week, Miami will tell us whether the upsets were a Mexican anomaly or the new normal.</p>`,
  },
  {
    slug: "coello-tapia-win-riyadh-p1-2026",
    title: "Coello and Tapia Open 2026 Season With Riyadh P1 Title",
    excerpt:
      "The world number one pair started their title defense in emphatic fashion, defeating Galan and Chingotto in the final of the season-opening Riyadh P1.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-02-15",
    imageUrl: "/images/news/padel-hero.jpg",
    body: `<p>Arturo Coello and Agustin Tapia began the 2026 Premier Padel season exactly where they left off in 2025 — on top. The world number one pair claimed the Riyadh Season P1 title with a commanding performance throughout the week.</p>
<p>In the final, they faced the newly formed pair of Alejandro Galan and Federico Chingotto, who had impressed in their first tournament together after both players split from their 2025 partners.</p>
<p>"Riyadh is always special for us," said Coello after the match. "Starting the season with a title gives us huge confidence for the rest of the year."</p>
<p>The 2026 season features a revamped calendar with the next stop being the Dubai P1, followed by the highly anticipated Miami P1 in late March.</p>`,
  },
  {
    slug: "galan-chingotto-new-partnership-2026",
    title: "Galan and Chingotto Form New Partnership for 2026",
    excerpt:
      "Two of padel's biggest names join forces after splitting from their respective partners, creating one of the most exciting new pairs of the season.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-02-10",
    imageUrl: "/images/news/padel-2.jpg",
    body: `<p>Alejandro Galan and Federico Chingotto have officially confirmed their partnership for the 2026 Premier Padel season, forming what many consider the most exciting new pairing in professional padel.</p>
<p>Galan, who previously partnered with Juan Lebron in one of padel's most iconic duos, brings his exceptional defensive skills and court coverage. Chingotto, known for his creativity and flair, adds an unpredictable attacking dimension.</p>
<p>Their Riyadh P1 final appearance in their very first tournament together suggests the chemistry is already building. "We complement each other well," said Galan. "Fede sees angles on the court that nobody else does."</p>
<p>Meanwhile, Lebron has teamed up with Argentine Leo Augsburger, while other notable new pairings include Paquito Navarro with Francisco Guerrero and Martin Di Nenno with Momo Gonzalez.</p>`,
  },
  {
    slug: "premier-padel-miami-p1-preview",
    title: "Premier Padel Miami P1: Everything You Need to Know",
    excerpt:
      "The tour heads to the United States for the Miami P1 from March 23-29, marking padel's biggest event yet on American soil.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-02",
    imageUrl: "/images/news/padel-3.jpg",
    body: `<p>Premier Padel is heading to Miami for what promises to be one of the landmark events of the 2026 season. Running from March 23-29, the Miami P1 represents padel's most significant push into the US market.</p>
<p>All eyes will be on whether Coello and Tapia can extend their dominant start to the season, but the American crowds are expected to be especially receptive to the explosive playing styles of pairs like Galan/Chingotto and Stupa/Yanguas.</p>
<p>On the women's side, Triay and Brea will look to continue their stranglehold on the top ranking, though the newly formed partnerships after Josemaria and Sanchez split could shake up the competition.</p>`,
  },
  {
    slug: "padel-2026-new-partnerships-guide",
    title: "2026 Season Shake-Up: Every Major New Partnership Explained",
    excerpt:
      "The off-season saw unprecedented player movement. Here's your complete guide to who's playing with whom in 2026.",
    category: "Rankings",
    author: "Vamos Editorial",
    date: "2026-02-08",
    imageUrl: "/images/news/padel-1.jpg",
    body: `<p>The 2026 Premier Padel season has seen more partnership changes than any year in recent memory. Here's the definitive guide to all the major new pairings:</p>
<p><strong>Men's Top 8 Pairs:</strong></p>
<ul>
<li>1. Coello / Tapia (unchanged - world #1)</li>
<li>2. Galan / Chingotto (NEW)</li>
<li>3. Stupa / Yanguas (reformed)</li>
<li>4. Lebron / Augsburger (NEW)</li>
<li>5. Coki Nieto / Jon Sanz (NEW)</li>
<li>6. Paquito / Guerrero (NEW)</li>
<li>7. Di Nenno / Momo Gonzalez (NEW)</li>
<li>8. Leal / Cardona</li>
</ul>
<p>The only unchanged pair at the very top is Coello and Tapia, who enter 2026 as the clear favorites after a dominant 2025 campaign. The biggest storyline is the Galan/Chingotto partnership, bringing together two of the sport's most talented players.</p>`,
  },
  {
    slug: "triay-brea-dominate-womens-tour",
    title: "Triay and Brea: The Pair to Beat in Women's Padel",
    excerpt:
      "After dominating the 2025 rankings, Gemma Triay and Delfi Brea enter 2026 as the undisputed world number one women's pair.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-02-05",
    imageUrl: "/images/news/padel-5.jpg",
    body: `<p>Gemma Triay and Delfi Brea enter the 2026 season as the dominant force in women's padel, and their early-season form suggests they have no intention of slowing down.</p>
<p>The Spanish-Argentine pair, who finished 2025 as the clear world number ones, have been virtually untouchable since forming their partnership. Triay's defensive mastery combined with Brea's aggressive net play creates a combination that no other pair has consistently solved.</p>
<p>The biggest shake-up in women's padel comes from the split of Paula Josemaria and Ariana Sanchez, a partnership that had been the main rival to Triay/Brea. Both players are now seeking new partners, creating opportunities for emerging talents to break into the top tier.</p>`,
  },
  {
    slug: "padel-fastest-growing-sport-2026",
    title: "Padel Confirmed as World's Fastest-Growing Sport for Third Year",
    excerpt:
      "New data shows padel participation grew 35% globally in 2025, with the US, UK, and Middle East leading the expansion.",
    category: "Business",
    author: "Vamos Editorial",
    date: "2026-01-30",
    imageUrl: "/images/news/padel-6.jpg",
    body: `<p>For the third consecutive year, padel has been confirmed as the world's fastest-growing sport, with global participation figures rising 35% in 2025 according to a new report from the International Padel Federation (FIP).</p>
<p>The sport now boasts over 30 million active players worldwide, with the most significant growth coming from the United States (+120% year-over-year), the United Kingdom (+85%), and the Middle East (+75%).</p>
<p>The FIP report highlights several key drivers: increased Premier Padel TV coverage via Red Bull and beIN Sports, the explosion of padel court construction globally, and the sport's inherent social accessibility.</p>`,
  },
];

// --- MATCHES (realistic 2026 season matchups with current pairs) ---

export const matches: Match[] = [
  {
    id: "m1",
    tournament: "Dubai P1",
    round: "Semi-Final",
    team1: { player1: "A. Coello", player2: "A. Tapia" },
    team2: { player1: "F. Stupa", player2: "M. Yanguas" },
    score: "6-4, 3-2",
    status: "live",
    court: "Center Court",
  },
  {
    id: "m2",
    tournament: "Dubai P1",
    round: "Semi-Final",
    team1: { player1: "A. Galan", player2: "F. Chingotto" },
    team2: { player1: "M. Di Nenno", player2: "M. Gonzalez" },
    score: "7-5, 6-3",
    status: "finished",
  },
  {
    id: "m3",
    tournament: "Dubai P1",
    round: "Quarter-Final",
    team1: { player1: "J. Lebron", player2: "L. Augsburger" },
    team2: { player1: "C. Nieto", player2: "J. Sanz" },
    score: "6-4, 3-6, 7-5",
    status: "finished",
  },
  {
    id: "m4",
    tournament: "Dubai P1",
    round: "Final",
    team1: { player1: "A. Coello", player2: "A. Tapia" },
    team2: { player1: "A. Galan", player2: "F. Chingotto" },
    score: "",
    status: "upcoming",
    time: "20:00",
    court: "Center Court",
  },
  {
    id: "m5",
    tournament: "Dubai P1 (Women)",
    round: "Final",
    team1: { player1: "G. Triay", player2: "D. Brea" },
    team2: { player1: "C. Fernandez", player2: "B. Gonzalez" },
    score: "",
    status: "upcoming",
    time: "17:30",
    court: "Center Court",
  },
  {
    id: "m6",
    tournament: "Dubai P1 (Women)",
    round: "Semi-Final",
    team1: { player1: "G. Triay", player2: "D. Brea" },
    team2: { player1: "T. Icardo", player2: "C. Jensen" },
    score: "6-2, 6-4",
    status: "finished",
  },
];

// --- RANKINGS (based on actual 2026 Premier Padel standings after Riyadh P1) ---

export const menRankings: RankedPlayer[] = [
  { rank: 1, name: "Agustin Tapia", country: "Argentina", countryCode: "AR", points: 1000, trend: "same", trendValue: 0 },
  { rank: 1, name: "Arturo Coello", country: "Spain", countryCode: "ES", points: 1000, trend: "same", trendValue: 0 },
  { rank: 3, name: "Alejandro Galan", country: "Spain", countryCode: "ES", points: 600, trend: "same", trendValue: 0 },
  { rank: 3, name: "Federico Chingotto", country: "Argentina", countryCode: "AR", points: 600, trend: "same", trendValue: 0 },
  { rank: 5, name: "Juan Lebron", country: "Spain", countryCode: "ES", points: 360, trend: "same", trendValue: 0 },
  { rank: 5, name: "Francisco Navarro", country: "Spain", countryCode: "ES", points: 360, trend: "up", trendValue: 4 },
  { rank: 5, name: "Leo Augsburger", country: "Argentina", countryCode: "AR", points: 360, trend: "up", trendValue: 5 },
  { rank: 5, name: "Francisco Guerrero", country: "Spain", countryCode: "ES", points: 360, trend: "up", trendValue: 10 },
  { rank: 9, name: "Franco Stupaczuk", country: "Argentina", countryCode: "AR", points: 180, trend: "up", trendValue: 3 },
  { rank: 9, name: "Miguel Yanguas", country: "Spain", countryCode: "ES", points: 180, trend: "up", trendValue: 2 },
  { rank: 9, name: "Lucas Bergamini", country: "Brazil", countryCode: "BR", points: 180, trend: "up", trendValue: 4 },
  { rank: 9, name: "Juan Tello", country: "Argentina", countryCode: "AR", points: 180, trend: "down", trendValue: 8 },
  { rank: 9, name: "Edu Alonso", country: "Spain", countryCode: "ES", points: 180, trend: "up", trendValue: 9 },
  { rank: 9, name: "Javier Garrido", country: "Spain", countryCode: "ES", points: 180, trend: "up", trendValue: 11 },
  { rank: 9, name: "Ramiro Valenzuela", country: "Argentina", countryCode: "AR", points: 180, trend: "up", trendValue: 49 },
  { rank: 9, name: "Javier Martinez", country: "Spain", countryCode: "ES", points: 180, trend: "up", trendValue: 52 },
  { rank: 17, name: "Martin Di Nenno", country: "Argentina", countryCode: "AR", points: 90, trend: "down", trendValue: 5 },
  { rank: 17, name: "Momo Gonzalez", country: "Spain", countryCode: "ES", points: 90, trend: "down", trendValue: 3 },
  { rank: 17, name: "Coki Nieto", country: "Spain", countryCode: "ES", points: 90, trend: "down", trendValue: 2 },
  { rank: 17, name: "Jon Sanz", country: "Spain", countryCode: "ES", points: 90, trend: "down", trendValue: 4 },
];

export const womenRankings: RankedPlayer[] = [
  { rank: 1, name: "Gemma Triay", country: "Spain", countryCode: "ES", points: 1000, trend: "same", trendValue: 0 },
  { rank: 1, name: "Delfi Brea", country: "Argentina", countryCode: "AR", points: 1000, trend: "same", trendValue: 0 },
  { rank: 3, name: "Claudia Fernandez", country: "Spain", countryCode: "ES", points: 600, trend: "up", trendValue: 3 },
  { rank: 3, name: "Bea Gonzalez", country: "Spain", countryCode: "ES", points: 600, trend: "up", trendValue: 2 },
  { rank: 5, name: "Tamara Icardo", country: "Spain", countryCode: "ES", points: 360, trend: "up", trendValue: 1 },
  { rank: 5, name: "Paula Josemaria", country: "Spain", countryCode: "ES", points: 360, trend: "down", trendValue: 3 },
  { rank: 5, name: "Ariana Sanchez", country: "Spain", countryCode: "ES", points: 360, trend: "down", trendValue: 2 },
  { rank: 8, name: "Marta Ortega", country: "Spain", countryCode: "ES", points: 180, trend: "down", trendValue: 1 },
  { rank: 8, name: "Lucia Sainz", country: "Spain", countryCode: "ES", points: 180, trend: "same", trendValue: 0 },
  { rank: 10, name: "Victoria Iglesias", country: "Spain", countryCode: "ES", points: 90, trend: "down", trendValue: 2 },
];

export const tournaments = ["Dubai P1", "Dubai P1 (Women)", "All Tournaments"];

export const newsCategories = ["All", "Tour News", "Rankings", "Business", "Academy"] as const;
