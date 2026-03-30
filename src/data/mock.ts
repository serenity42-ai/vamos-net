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
    slug: "miami-p1-finals-2026",
    title: "Chingalan and Josemaria-Gonzalez Crowned in Miami as the Number Ones Fall",
    excerpt:
      "Galan and Chingotto beat Coello and Tapia in three sets while Josemaria and Gonzalez end Triay and Brea's unbeaten 2026 run at the Miami Premier Padel P1.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-30",
    imageUrl: "/images/news/miami-p1-champions-2026.jpg",
    body: `<p>The Miami Beach Convention Center delivered a Sunday evening for the ages as both world number one pairs went down in three-set finals. Alejandro Galan and Federico Chingotto claimed the men's title 7-5 3-6 6-3 over Arturo Coello and Agustin Tapia, while Paula Josemaria and Bea Gonzalez ended Gemma Triay and Delfina Brea's unbeaten 2026 streak with a 6-3 4-6 7-5 victory that left Josemaria in tears on court.</p>
<p>The results tighten the rankings race at the top of both draws and confirm what the early 2026 season has been suggesting: the gap between the top two pairs is narrowing fast.</p>
<h2>Men's final</h2>
<p>The first set was a tight contest throughout, with Chingalan edging it 7-5 after both pairs struggled to find their rhythm early on. The Golden Boys responded in the second, with Coello stepping up his aggression to drag the match back on their terms at 6-3 and force a decider.</p>
<p>The third set swung back toward Chingalan. Galan and Chingotto jumped out to a 3-0 lead before Tapia and Coello fought their way back into it, but the number twos had enough left to close it out 6-3 and claim their second title of 2026.</p>
<p>For the Golden Boys, it is a rare back-to-back finals loss. They remain the circuit's most consistent pair with a 15-2 record in 2026, but Chingalan have now taken the head-to-head this season 2-1.</p>
<h2>Women's final</h2>
<p>The women's final was arguably the match of the tournament. Nearly three hours of padel that swung on the finest margins and ended with one of the most emotional celebrations of the season.</p>
<p>Josemaria and Gonzalez controlled the opening set 6-3, but the world number ones, unbeaten under coach Seba Nerone entering this final, fought back to take the second 6-4 and level the match.</p>
<p>The decider went down to the wire. At 5-5, with Triay and Brea seemingly finding a second wind, Perlamita produced two clutch games to close it 7-5 after nearly three hours on court. Josemaria collapsed in tears the moment it was over — a first title of 2026 for a partnership that started the season with questions to answer.</p>
<p>It was the first defeat of 2026 for Triay and Brea, who had taken titles at Gijon and Cancun without dropping a match. The loss does nothing to change the rankings — they remain firmly at number one — but it proves the women's tour has a genuine rivalry at the top rather than a procession.</p>
<h2>What's next</h2>
<p>The circuit heads to Egypt for the Newgiza P2 from April 13 to 18. The rankings tell one story — Coello/Tapia and Triay/Brea still lead — but Miami told another. Both number two pairs arrived in Florida as challengers and left as champions. The season is very much alive.</p>`,
  },
  {
    slug: "miami-p1-2026-semifinal-preview",
    title: "Miami P1 Semifinal Day: Lebrón Wants Revenge, the Golden Boys Look Beatable",
    excerpt:
      "The quarterfinals delivered a 6-0 6-0 destruction, three set points saved, and a rivalry rematch nobody expected to be this close.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-28",
    imageUrl: "/images/news/miami-p1-2026-semis.jpg",
    body: `<p>The Miami P1 quarterfinals answered some questions and raised bigger ones. Chingalán look unstoppable, the Golden Boys look vulnerable, and Juan Lebrón is playing the best padel of his 2026 season at exactly the right moment.</p>
<p>Arturo Coello and Agustín Tapia survived against Paquito Navarro and Fran Guerrero, but "survived" is the right word. The Pacos had three set points at 5-4 in the opener and couldn't convert any of them. Coello and Tapia ran away from there — 7-5 — and then needed a tiebreak in the second to close it out 7-6. The number ones have that ability to flip a switch in the moments that matter, and they did it again in Miami, but they're making more unforced errors than usual and the body language between points hasn't been as relaxed as we're used to seeing. Something is a fraction off. Whether that fraction matters against Lebrón today is the question.</p>
<p>Because El Lobo looks sharp. Lebrón and Augsburger took apart Jon Sanz and Coki Nieto 6-3, 7-5 — a pair that had beaten them in Gijón earlier this season. Lebrón controlled the tempo from the back of the court, dictating rallies with a patience he doesn't always show, while Augsburger was rock-solid in defence and increasingly dangerous when stepping into the net. The best Juan Lebrón is back. After Cancún's three-set final loss, they know they can push the Golden Boys to the edge. The difference is that in Cancún, Coello and Tapia found a way. In Miami, with both pairs in the same half, the rematch comes one round earlier — in the semis, not the final.</p>
<p>The other half of the draw barely required discussion. Ale Galán and Fede Chingotto dismantled Javi Barahona and Javi García 6-1, 6-0. The defending Miami champions from 2025 needed just over 40 minutes. After their quarterfinal exit in Cancún — the upset that blew the Mexican bracket apart — Chingalán have responded with something close to fury. Not a single break point conceded against a pair that simply couldn't find a way into the rallies. They face Stupaczuk and Yanguas in the semis, a pair that had to work hard against Di Nenno and Momo González in the quarters. If the draw holds, the final everyone expected in Cancún but never got — Golden Boys versus Chingalán — could finally happen on Sunday.</p>
<p>On the women's side, the top four seeds all came through, restoring order after Cancún's upsets. Gemma Triay and Delfina Brea were brutal: 6-0, 6-3 against Icardo and Jensen, barely breaking a sweat on their way to a potential third consecutive title. They face Fernández and Araújo, who beat Ortega and Calvo 6-2, 6-1 in the day's other convincing performance. In the bottom half, Josemaría and González held off a competitive Guinart and Virseda 6-3, 7-5 and meet Sánchez and Ustero, who won 6-3, 6-3 against Caldera and Goenaga.</p>
<p>Today's semifinal schedule: women first, men after. The match everyone's watching is Coello/Tapia versus Lebrón/Augsburger — a rematch of the Cancún P2 final that went to 5-7, 6-3, 7-5. This time it's not for a title, but it might be for something more: proof of which pair controls the 2026 narrative. Lebrón and Augsburger arrive with momentum and nothing to lose. The Golden Boys arrive with the ranking and a growing list of tight escapes. Something has to give. Semifinals live on Red Bull TV from 5pm CET.</p>`,
  },
  {
    slug: "opinion-ppl-15-million-padel",
    title: "Vamos Opinion: What PPL's $15 Million Actually Means for Padel",
    excerpt:
      "An NBA governor just bet eight figures on a sport most Americans can't explain. Here's what that tells us — and what it doesn't.",
    category: "Business",
    author: "Vamos Editorial",
    date: "2026-03-25",
    imageUrl: "/images/news/vamos-opinion-ppl.jpg",
    body: `<p>The Pro Padel League raised $15 million this week in a Series A led by Charlotte Hornets co-chairman Rick Schnall. That sounds impressive until you remember what $15 million actually buys in American sports — roughly one season of a backup quarterback's salary. The number matters less than the name behind it. Schnall didn't get to co-own an NBA franchise by chasing hype. When someone at that level puts money into padel, it means the due diligence came back positive.</p>
<p>And PPL isn't an isolated bet. In the past three months alone, Rolex signed Arturo Coello — making him the first padel player in the watchmaker's history — and On, the Swiss brand built on Federer and marathon runners, brought Coello on to co-develop padel footwear. Qatar Airways holds title sponsorship of the Premier Padel tour. Red Bull broadcasts to 130 countries. The money isn't trickling in. It's arriving from directions that suggest serious people have done serious math.</p>
<p>Still, let's not get carried away. Padel in the US is where MLS was in the mid-90s — exciting on paper, unproven on the ground. The European numbers are staggering (35 million players, 22% annual club growth, a market that's tripled to €6 billion in four years), but transplanting that to a country with almost no courts, zero padel culture, and a population that still confuses the sport with pickleball is a different problem entirely. PPL projecting breakeven in 2026 is optimistic. Playtomic's own report pushes "real acceleration" in the US to 2027, which feels more honest.</p>
<p>The Rolex signal is what we keep coming back to. Rolex has never been early to anything — they're late and right. If their analysts decided the padel audience was worth the crown, that says more than any funding round.</p>
<p>The real test isn't whether padel can attract investment. It clearly can. The test is whether it can build a media product that holds casual American attention beyond the highlights. Tennis took decades and generational talents like Federer, Nadal, and Djokovic to crack the US mainstream. Padel has Coello, who's 21 and carrying Rolex before most people outside Spain know his name. That's either a sign the sport is ahead of schedule, or that the money is ahead of the audience.</p>
<p>We think it's a bit of both. And that's not a bad place to start.</p>`,
  },
  {
    slug: "uk-padel-growth-2026",
    title: "From 68 Courts to 1,000. How Padel Took Over Britain in Six Years.",
    excerpt:
      "400,000 players, £6 million in LTA investment, and a court count that grew 17x since 2019. The numbers behind Britain's padel explosion.",
    category: "Business",
    author: "Vamos Editorial",
    date: "2026-03-25",
    imageUrl: "/images/news/padel-big-money-2026.jpg",
    body: `<p>In 2019, Great Britain had 68 padel courts. By July 2025, that number hit 1,000. A sport that most Brits hadn't heard of six years ago now has 400,000 annual players, £6 million in governing body investment, and a court-building pipeline that shows no sign of slowing down.</p>
<iframe src="/images/news/uk-padel-dashboard.html" style="width:100%;height:520px;border:none;border-radius:12px;margin:1.5rem 0;" loading="lazy"></iframe>
<p>The acceleration is visible at every level. The LTA, which took governance of padel in 2019, has invested £4.5 million directly into 80 courts across 42 venues — roughly 10% of all courts nationwide. Adult awareness of the sport nearly doubled from 23% in 2023 to 43% now, according to Sport England's Active Lives Survey. And the participation numbers are moving even faster: 51,000 adults in England play padel at least twice a month, more than double the figure from the previous year.</p>
<p>David Lloyd Clubs, the UK's largest padel operator, tells the growth story in a single stat. Monthly padel participation across its venues jumped from 3,300 players in April 2023 to 18,100 by April 2025 — a five-fold increase in two years. Game4Padel, the country's biggest pay-and-play operator, ended 2025 with 26 UK venues and plans to build 50 new courts in 2026. The Padel Club sits third in the market and expanding rapidly. Between them, these three operators are reshaping Britain's racket sports landscape.</p>
<p>What's driving it isn't hard to understand. Padel is easier to pick up than tennis, more social than squash, and fits the group fitness culture that dominates British leisure spending. A typical session costs £8–10 per person (£30/hour for a court, split four ways), making it cheaper than most gym classes and more fun than most treadmills. London courts average £48/hour at peak times, but in cities like Bristol and Edinburgh, off-peak rates start at £15–16/hour — accessible enough to attract casual players who would never book a tennis court.</p>
<p>The shift toward indoor facilities is accelerating the build-out. Leisure DB research from late 2025 found that indoor courts are becoming the UK's default padel format — critical in a country where outdoor sports are weather-dependent for eight months of the year. This removes the single biggest barrier to year-round play and makes the business case for new venues significantly stronger.</p>
<p>Industry analysts project the UK could support 7,000 to 8,000 courts within the next decade, which would put Britain roughly where Spain was five years ago. The LTA targets 400,000 active players by 2026 — a number they've essentially hit a year early. The question now isn't whether padel will grow in Britain, but how fast the infrastructure can keep up with demand.</p>
<p>For anyone watching from a business perspective, the trajectory looks familiar. Padel in the UK is following the same adoption curve that the sport drew in Spain in the 2010s and in Sweden and Italy in the early 2020s. The difference is that Britain's curve is steeper — backed by institutional investment from the LTA, private capital from operators like Game4Padel and David Lloyd, and a Premier Padel tour that's actively targeting English-speaking markets. When the London Major eventually arrives — and it will — the audience will already be there.</p>`,
  },
  {
    slug: "padel-big-money-2026",
    title: "Rolex, NBA Owners, and $15 Million Rounds. Padel Isn't Small Anymore.",
    excerpt:
      "The Pro Padel League just raised $15M from an NBA governor. Rolex and On signed padel's world number one. The sport's commercial boom is accelerating — here's the full picture.",
    category: "Business",
    author: "Vamos Editorial",
    date: "2026-03-25",
    imageUrl: "/images/news/padel-big-money-2026.jpg",
    body: `<p>The Pro Padel League announced a $15 million Series A round yesterday, led by Charlotte Hornets co-chairman Rick Schnall, valuing the North American league at roughly ten times its $10 million seed from a year ago. An NBA governor betting eight figures on a sport most Americans still can't explain to their friends — and the kind of headline that would have been absurd in 2022.</p>
<p>PPL's fundraise is just the latest in a string of moves that paint a picture of a sport crossing from niche to mainstream faster than anyone predicted. Three years ago, the world's best padel players were earning less than a mid-table tennis pro. In January 2026, Arturo Coello — the 21-year-old world number one — signed with On, the Swiss sportswear brand built on running shoes and Roger Federer. A week later, Rolex added him to its athlete roster, making Coello the first padel player in the watchmaker's history to carry the crown. Two deals in eight days, both from brands that hadn't touched padel twelve months earlier.</p>
<img src="/images/news/coello-on-2026.jpg" alt="Arturo Coello wearing On apparel" />
<p>On isn't just putting its logo on Coello's shirt — the company is co-developing padel-specific footwear with him, working from its Swiss labs with input from the sport's top player. And Rolex, a brand that chooses its athletes with surgical precision — Federer, Tiger Woods, Carlos Alcaraz — doesn't attach its name to a sport unless the audience and commercial opportunity have crossed a threshold. That both brands moved within the same week says something about the pace.</p>
<p>The tour-level picture tells the same story. Qatar Airways holds title sponsorship of Premier Padel. Red Bull TV broadcasts to 130 countries. Wilson, Bullpadel, Playtomic, Betsson, and NTT Data have all signed on — a mix of endemic padel brands and multinational corporates that would have been unthinkable three years ago, backing a season that now spans 26 tournaments across 18 countries.</p>
<p>Coello and Tapia each earned €492,375 in prize money alone in 2024, winning 14 titles across 21 tournaments, with career earnings now exceeding €1.17 million each. Prize money has more than doubled since 2022, and when you add sponsorship income, appearance fees, and exhibitions, the top tier of men's padel is approaching the earning power of tennis players ranked outside the top 30. On the women's side, Gemma Triay and Delfina Brea dominate both the rankings and the commercial opportunities, though the gap between the top women's pairs and the rest of the field remains wider than in the men's game.</p>
<p>The market data underneath all of this supports the optimism. According to the Global Padel Report, the sport's total market value has tripled from €2 billion in 2022 to an estimated €6 billion in 2026, driven by over 35 million players worldwide. Padel clubs grew 22 percent globally in 2024, with the sharpest expansion in Southern Europe, while the US market — still in its infancy — is projected by Playtomic for "real acceleration" in 2027. Events like the Miami P1 and PPL's North American expansion are laying that groundwork now.</p>
<p>Even the equipment segment, worth €550 million in 2022, is being reshaped as traditional tennis brands (Wilson, Head, Babolat) compete with padel-native manufacturers (Bullpadel, Nox) for market share. Connected rackets and performance analytics are the next frontier — R&D investments that would have seemed absurd for a sport most Americans hadn't heard of five years ago.</p>
<p>Not everything is frictionless. Prize money still lags far behind tennis, and the earnings gap between the top four pairs and everyone else is stark. Player associations have pushed for better revenue sharing, and the rapid pace of pair changes — driven partly by the financial incentive to partner with higher-ranked players for better seedings — has raised questions about competitive stability. But when Swiss watchmakers, NBA governors, and global airlines are all moving in the same direction, they aren't chasing a trend. They're pricing in what comes next.</p>`,
  },
  {
    slug: "augsburger-galan-feud-explained",
    title: "The Augsburger–Galán Feud, Explained",
    excerpt:
      "A dismissed rival, a messy breakup, and an ex-partner caught in the middle. How a press conference quote became the biggest off-court story of the 2026 season.",
    category: "Tour News",
    author: "Vamos Editorial",
    date: "2026-03-25",
    imageUrl: "/images/news/augsburger-galan-feud-2026.jpg",
    body: `<p>It started with a question from a journalist and ended up as the most talked-about moment off the court this season.</p>
<p>During the Gijón P2 two weeks ago, reporter Joaquín Serna asked Leo Augsburger about Alejandro Galán. The young Argentine didn't soften it. "I'm not a fan of Galán, I don't watch him much and he's not a big deal," he said. Then, for contrast, he praised Agustín Tapia — his close friend and the man he faces across the net in almost every final — calling him someone born with talent to be at the top, a great person, very family-oriented. The implication was clear enough.</p>
<p>The comments spread through padel social media within hours. By the time Galán reached the Gijón semifinal, he knew exactly what had been said. His response, at the post-match press conference, was measured but pointed. "He's a great guy, but I feel he's had a very bad environment for a long time," Galán said — a comment widely understood as a dig at Lebrón's influence on his young partner. Coming from the man who spent four years alongside El Lobo and knows exactly how that dynamic works, the words carried weight.</p>
<p>He went further: "Leo is an ambitious and competitive player who likes confrontation. I think it's a tactic of his to motivate himself. That's all there is to it."</p>
<p>To understand why this matters, you need the backstory.</p>
<p>Galán spent four years alongside Juan Lebrón in what became the most successful partnership in modern padel — 33 titles, including the Rome Major and the 2024 Riyadh P1, where they beat Coello and Tapia in what many consider the greatest match ever played. But behind the trophies, the relationship deteriorated. Galán later admitted in interviews that he should have ended the partnership earlier, staying only because the results kept coming. When the split finally happened in early 2024, Galán said it was a relief. Lebrón has said the timing wasn't his choice.</p>
<p>Now Lebrón plays with Augsburger. The kid from Posadas who just publicly dismissed his ex-partner's biggest rival. The same ex-partner who shared a court with Galán for years and knows every weakness.</p>
<p>That's the subtext every time these pairs meet. When the Golden Boys faced Lebrón and Augsburger in the Cancún final last week, Galán and Chingotto had already been knocked out in the quarters. But Miami has put Coello/Tapia and Lebrón/Augsburger in the same half again, meaning a potential semifinal collision — while Chingalán sit in the other half as defending champions. If the draw plays out to seedings, the final could be Galán against his ex-partner's new teammate, the one who called him "nothing special" on camera.</p>
<p>Augsburger, to his credit, isn't apologising. At 22, he's already shown he can back up the talk — his Cancún final performance against the world number ones went to three sets and could easily have gone his way. He plays with the kind of fearless aggression that makes good television and uncomfortable press conferences. Whether the Galán comments are genuine disrespect or calculated psychological warfare, they've done what they were always going to do: make every future meeting between these players unmissable.</p>
<p>Galán closed the Gijón episode with a line that was either gracious or devastating, depending on how you read it. "I'm not holding it against him. We've known each other for a long time, and I wish him all the best. He's going to be a great player — who knows, maybe years from now I'll have to call him for help." The smile said one thing. The emphasis on "years from now" said another.</p>
<p>Padel has never had a rivalry quite like this — personal, generational, and tangled up in the sport's most famous breakup. Miami won't settle it. But it might make it louder.</p>`,
  },
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
