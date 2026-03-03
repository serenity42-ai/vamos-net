# Vamos.net UX Research & Redesign Recommendations

> **Research Date:** March 3, 2026
> **Prepared for:** Vamos.net — The World of Padel
> **Current State:** Landing page with "launching soon" message. Live Scores, Rankings, News, Stats promised.

---

## 1. Executive Summary

After analyzing six leading sports media and live-scores platforms — TheDink Pickleball, ATP Tour, FlashScore, ESPN, SofaScore, and Premier Padel — clear patterns emerge for what makes sports platforms successful at scale:

**Key Findings:**
1. **Content-first homepage** beats feature-first. Every successful platform leads with fresh content (news/scores), not feature descriptions.
2. **Newsletter/email capture is front-and-center** on media sites (TheDink embeds it in the hero carousel). This is the #1 retention mechanism.
3. **Live scores are a daily-visit driver.** FlashScore and SofaScore prove that real-time data creates habitual usage. Padel currently has NO dominant live-scores destination — this is a massive gap.
4. **Rankings are a core traffic magnet.** ATP Tour's rankings page is one of their most-visited pages. Rankings drive weekly return visits.
5. **The padel ecosystem is underserved.** Premier Padel's website is heavily JS-rendered with poor content extraction, slow loading, and minimal editorial content. FlashScore and SofaScore don't even cover padel. This is a once-in-a-generation opportunity.
6. **Dual identity works:** TheDink proves you can be both media (news/opinion) AND data (scores/stats) for a niche sport. That's exactly what Vamos should be.
7. **Head-to-Head and player profiles drive deep engagement** — ATP Tour's H2H tool and player profiles are among the stickiest features on the site.

**Bottom Line:** Vamos.net should position itself as "The ESPN of Padel" — combining TheDink's media-first approach with ATP Tour's data depth and FlashScore's live-score UX. No one is doing this for padel today. The market is wide open.

---

## 2. Per-Platform Analysis

### 2.1 TheDink Pickleball (thedinkpickleball.com)

**What they are:** The #1 pickleball media site. Newsletter-first business model with 100k+ subscribers. Subsidiary of Upswing Sports.

#### Information Architecture
```
Homepage
├── News & Stories (main content hub)
│   ├── PPA Tour
│   ├── MLP (Major League Pickleball)
│   ├── News and Stories
│   └── The Dink Reviews (gear)
├── Newsletter (subscribe.thedinkpickleball.com — Substack)
├── Podcast (PicklePod on YouTube)
├── Events (Minor League Pickleball, Courted Series)
└── Gear Reviews
```

#### Navigation Structure
- **Primary Nav:** Minimal — Logo + tagline "Pickleball Lives Here" + hamburger menu
- **No traditional nav bar visible** — content-forward design where the homepage IS the navigation
- **Categories surfaced through article tags** (PPA Tour, MLP Draft, DUPR, Reviews)

#### Homepage Sections (Top to Bottom)
1. **Hero carousel** (3 slides) — Featured articles with large images, category tag, headline, author, date
2. **Promotional carousel** (3 slides) — Podcast CTA, Newsletter signup ("Get Smarter About Pickleball — Join 100k+ subscribers"), Sponsor banner
3. **Top Stories** — 4 articles in a grid (1 large + 3 medium), each with category tag
4. **Latest Articles** — Vertical list (6 articles), thumbnail + title + author + date
5. **Newsletter section** — Dedicated heading + signup area
6. **More content carousel** — Additional articles in horizontal scroll
7. **Footer** — Social links, legal

#### Key UX Patterns That Work
- ✅ **Newsletter embedded in hero carousel** — not a popup, not a footer afterthought; it's THE primary CTA
- ✅ **Category tags on every article** — clear content taxonomy (PPA Tour, MLP, DUPR, Reviews)
- ✅ **Author attribution prominent** — builds trust and personality
- ✅ **Clean, magazine-style layout** — large images, clear typography, generous whitespace
- ✅ **Social proof** ("100k+ subscribers") baked into newsletter CTA
- ✅ **Podcast integration** — audio content treated as first-class citizen

#### Things to Avoid
- ❌ **No live scores** — pure media play, missing the data opportunity
- ❌ **No player profiles/rankings** — no structured data
- ❌ **No search visible** — content discovery relies on browsing only
- ❌ **Hamburger-only nav** — hides content categories; hard to discover full site scope
- ❌ **No personalization** — same experience for every visitor

#### Relevance to Vamos
TheDink proves the media model works for a niche racquet sport. Their newsletter-first strategy is brilliant. BUT they're purely media — no data. Vamos should take their content approach and add the data layer that TheDink lacks.

---

### 2.2 ATP Tour (atptour.com)

**What they are:** The official website for men's professional tennis. The gold standard for a single-sport professional tour website.

#### Information Architecture
```
Homepage
├── Scores
│   ├── Live Scores (current tournaments)
│   ├── ATP Challenger Tour scores
│   └── Results archive
├── Rankings
│   ├── Singles
│   ├── Doubles
│   ├── Live Rankings (real-time during tournaments)
│   └── Race to Turin
├── Players
│   ├── Player profiles
│   │   ├── Overview (bio, stats summary)
│   │   ├── Rankings history
│   │   ├── Stats breakdown
│   │   └── Activity (match-by-match results)
│   ├── Head-to-Head tool
│   └── Stats leaderboards
├── Tournaments
│   ├── Calendar
│   ├── Tournament pages
│   │   ├── Overview
│   │   ├── Draws
│   │   ├── Schedule/Order of Play
│   │   ├── Results
│   │   └── Tournament info
│   └── ATP Finals / Next Gen Finals
├── News
│   ├── Articles
│   ├── Video
│   └── Photo galleries
└── ATP No.1 Club (special feature)
```

#### Navigation Structure
- **Top bar:** Sub-brand selector (ATP Tour, ATP Finals, Next Gen, Challenger Tour, One Vision, ATP Serves, No.1 Club)
- **Secondary bar:** Shop button + Sponsor (Emirates) + Search
- **Main nav:** Not visible as traditional horizontal nav — content sections are accessed through the homepage layout itself
- **Mega-nav available on scroll/interaction**

#### Homepage Sections (Top to Bottom)
1. **Sponsor banner** (Infosys — Digital Innovation Partner)
2. **Sub-brand selector** — horizontal tabs for ATP Tour, Finals, Challenger, etc.
3. **Live Scores link** — prominent "Live Scores" CTA
4. **Hero content area** — Split layout:
   - LEFT: Featured article with large image (e.g., "Alcaraz faces tricky test at Indian Wells")
   - RIGHT: Rolex clock widget + Featured H2H matchup + No.1 Club badge
5. **Secondary articles** — 2-3 additional news stories in a row
6. **More editorial content** — Additional features and stories
7. **Rankings widget** — Shows Top 10 with rank, photo, flag, name, points. Toggle Singles/Doubles
8. **H2H Feature** — Interactive Head-to-Head comparison (e.g., Cobolli vs Tiafoe) with photos, flags, win record
9. **Tournament calendar** — Upcoming events
10. **Sponsors footer**

#### Key UX Patterns That Work
- ✅ **Rankings widget on homepage** — Top 10 with player photos + country flags + points. Quick "View All" link. This is a HUGE traffic driver.
- ✅ **Head-to-Head tool prominently featured** — Interactive, visual, and shareable. Drives deep engagement.
- ✅ **Live Rankings** — Real-time rankings updates during tournaments, creating urgency to check back
- ✅ **Player profiles are comprehensive** — Bio, stats, rankings history, activity, videos all in one place
- ✅ **Tournament hierarchy** (Masters 1000, ATP 500, ATP 250) — clear visual distinction between tournament categories
- ✅ **Country flags everywhere** — instant national identification, drives emotional connection
- ✅ **Sponsor integration is premium** — Rolex clock, Lexus H2H, Infosys branding. Feels premium, not cluttered.
- ✅ **Calendar view** — Season-long tournament calendar is essential for sports planning

#### Things to Avoid
- ❌ **Heavy page loads** — Cloudflare protection blocked our initial fetch; JS-heavy
- ❌ **Complex sub-brand navigation** — Too many ATP sub-brands (Tour, Finals, Next Gen, Challenger, One Vision, Serves, No.1 Club)
- ❌ **Ad-heavy** — Double-click iframe ads dilute the experience
- ❌ **Desktop-first feel** — The multi-column layout is designed for large screens

#### Relevance to Vamos
ATP Tour's data architecture is the BLUEPRINT for Vamos. Rankings widget, player profiles with H2H, tournament pages with draws/schedule/results, and live scores are all must-haves. The key is to replicate this data depth for padel while keeping a cleaner, faster, more modern execution.

---

### 2.3 FlashScore (flashscore.com)

**What they are:** The world's #1 live sports score platform. Founded 2006 in Czech Republic. Covers 38+ sports, 6,000+ competitions, operates in ~200 countries. Global Rank #477.

#### Information Architecture
```
Homepage (score-centric)
├── Left Sidebar
│   ├── My Favorites (⭐ pinned at top)
│   ├── Sport selector icons
│   │   ├── ⚽ Football
│   │   ├── 🏀 Basketball
│   │   ├── 🎾 Tennis
│   │   ├── 🏒 Hockey
│   │   └── 30+ more sports
│   └── Per-sport tournament tree
│       ├── Country > League/Tournament
│       └── Collapsible hierarchy
├── Main Content (center)
│   ├── Date selector (previous/today/next)
│   ├── Live matches (grouped by tournament)
│   ├── Upcoming matches
│   ├── Finished matches
│   └── Match detail pages
│       ├── Score + timeline
│       ├── Statistics
│       ├── Lineups
│       ├── H2H
│       ├── Standings
│       └── Commentary
├── Right Sidebar
│   └── Contextual content / ads
└── News section (secondary)
```

#### Navigation Structure
- **No traditional nav bar** — The left sidebar IS the navigation
- **Sport icons** as primary navigation (visual, compact)
- **Breadcrumb-style**: Sport > Country > Tournament > Match
- **Persistent date selector** at top of scores area
- **"My Favorites"** tab always accessible

#### Key UX Patterns That Work
- ✅ **Favorites/Follow system** — Pin specific teams, players, or competitions. Your favorites appear in a dedicated tab at the top. Personalization without login friction (uses local storage initially).
- ✅ **Real-time updates without refresh** — Scores auto-update with subtle animations (flashing score, color changes). No manual refresh needed.
- ✅ **Tournament grouping** — Matches are grouped under tournament headers with country flags. Collapsible sections keep the page manageable.
- ✅ **Information density done right** — Compact rows with team names, scores, time/status. Dense but scannable. No wasted space.
- ✅ **Match detail depth** — Click any match for timeline, stats, lineups, H2H, standings, live commentary
- ✅ **Push notifications** — Get alerts for goals, red cards, match starts, match ends
- ✅ **Sport sidebar with visual icons** — Quick switching between 38+ sports without leaving the page
- ✅ **Date navigation** — Easy previous/today/next day navigation
- ✅ **Country > Tournament hierarchy** — Logical grouping that scales to thousands of competitions
- ✅ **Freemium model** — Free core with FlashScore Plus for ad-free + extra features

#### Things to Avoid
- ❌ **No editorial content** — Pure data, no stories or opinion
- ❌ **Ad-heavy free version** — Banner ads above, below, and in sidebars
- ❌ **Dense UI can overwhelm newcomers** — Optimized for power users
- ❌ **No padel coverage** — A huge gap! Reddit users frequently ask why FlashScore doesn't cover padel

#### Relevance to Vamos
FlashScore's live scores UX is the model for Vamos's scores section. Key takeaways: favorites system, real-time updates, tournament grouping, and match detail pages. The fact that FlashScore doesn't cover padel is Vamos's biggest competitive advantage.

---

### 2.4 ESPN (espn.com)

**What they are:** The world's largest sports media company. Multi-sport, multi-platform (TV, web, app, streaming).

#### Information Architecture
```
Homepage
├── Top bar
│   ├── Sport-specific sections (NFL, NBA, MLB, NHL, Soccer, MMA, etc.)
│   ├── ESPN+ / Watch
│   ├── Fantasy
│   └── More (dropdown)
├── Hero content area
│   ├── Trending/breaking story (full-width hero)
│   └── Quick links (live events, schedules, odds)
├── Scoreboards (sport-specific, horizontal scroll)
├── Content feed
│   ├── Top Headlines (editorial picks)
│   ├── Sport-specific modules (NFL Draft, NBA Scoreboard, etc.)
│   ├── Video embeds
│   └── Trending Now
├── Personalization
│   ├── "Customize ESPN" (select favorite teams)
│   └── "SportsCenter For You" (personalized highlights)
└── Footer (ESPN family of sites, social links)
```

#### Homepage Sections (Top to Bottom)
1. **Quick links bar** — Subscribe Now, Live Event, NCAA Hoops Schedule, Bracketology, Where to Watch, Today's Top Odds, ESPN Radio
2. **Customize ESPN section** — Fantasy sports links + ESPN Deportes, espnW, ESPNFC, X Games
3. **Top Headlines** — 9 headline links in a bulleted list (text-only, fast scan)
4. **Feature module** — NFL Draft section with featured article + supporting stories
5. **NBA Scoreboard** — Live/recent scores with links to standings and schedule
6. **Feature article** — Large image + editorial content (e.g., Shohei Ohtani story)
7. **Offseason Moves module** — NFL free agency tracker with tiered content
8. **Men's College Hoops Scoreboard** — Live scores for current games
9. **March Madness module** — Conference tournament predictions, bubble watch
10. **NHL Trade Deadline module** — Timely editorial content
11. **ICYMI section** — Video clips and catch-up content
12. **Trending Now** — 5 feature stories in horizontal card layout
13. **Fantasy promotion** — Sign up CTA

#### Key UX Patterns That Work
- ✅ **Scoreboard widgets embedded in editorial flow** — Scores aren't separate from news; they're woven together
- ✅ **Top Headlines as simple text list** — Quick scannable headlines, no images. Fast loading, high density.
- ✅ **Time-sensitive modules** — NFL Draft, Trade Deadline, March Madness. Content modules change based on what's happening NOW in sports.
- ✅ **Personalization** — "Customize ESPN" lets users pick teams; content adapts
- ✅ **Multi-format content** — Text, video, audio (ESPN Radio), podcasts all integrated
- ✅ **Odds integration** — Betting odds as first-class content
- ✅ **"Where to Watch"** — Dedicated section for broadcast info (critical for live sports)

#### Things to Avoid
- ❌ **Overwhelming for niche users** — Too many sports, too much content. Works for ESPN's scale, not for a focused padel site.
- ❌ **Homepage is LONG** — Endless scrolling feed requires commitment
- ❌ **Heavy JS/ads** — Slow initial load
- ❌ **Mega menu can be disorienting** — Dozens of sub-items per sport

#### Relevance to Vamos
ESPN's key lesson: **scores and editorial content should live together**, not in separate silos. Their time-sensitive module approach (content changes based on what's happening in the sport calendar) is brilliant. Also: "Where to Watch" for padel tournaments is a killer feature that no one does well.

---

### 2.5 SofaScore (sofascore.com)

**What they are:** Modern live-scores platform from Croatia. Known for clean design, advanced analytics (player ratings 3-10 scale), and data visualization. Covers football, tennis, basketball, and more.

#### Information Architecture
```
Homepage
├── Sport tabs (horizontal bar)
│   ├── Football (default)
│   ├── Basketball
│   ├── Tennis
│   ├── Hockey
│   ├── Cricket
│   ├── Motorsport
│   └── More sports
├── Left panel
│   ├── League/Tournament selector
│   └── Favorites
├── Main content
│   ├── Today's matches (grouped by league)
│   ├── Live matches highlighted
│   └── Match cards → Match detail
│       ├── Live score + timeline
│       ├── Statistics (with visual bars)
│       ├── Lineups + player ratings
│       ├── Momentum graph
│       ├── Shot map / Heat map
│       ├── H2H
│       └── Standings
├── Player pages
│   ├── Overall rating
│   ├── Performance graph
│   ├── Match-by-match ratings
│   ├── Attribute radar chart
│   └── Comparison tool
└── Tournament pages
    ├── Bracket/Draw visualization
    ├── Standings
    ├── Top players
    └── Fixtures/Results
```

#### Key UX Patterns That Work
- ✅ **Player rating system (3-10 scale)** — Unique differentiator. Algorithm-driven player scores create debate and engagement.
- ✅ **Visual data representations** — Momentum graphs, shot maps, heat maps, radar charts. Data becomes visual storytelling.
- ✅ **Player comparison tool** — Side-by-side player comparison with radar charts. Hugely shareable on social media.
- ✅ **Tournament bracket visualization** — Clean, interactive bracket/draw display
- ✅ **Clean, modern UI** — Minimal chrome, focus on data. Dark/light mode. Professional design.
- ✅ **Match momentum graph** — Shows which team had pressure at each moment. Unique and addictive.
- ✅ **Auto-updating scores** — No refresh needed, smooth animations
- ✅ **Feed feature** — Tournament and event announcements in a social-media-style feed

#### Things to Avoid
- ❌ **No editorial content** — Pure data play, no stories or opinion
- ❌ **No padel coverage** — Same gap as FlashScore
- ❌ **Can feel cold/impersonal** — All data, no narrative or community

#### Relevance to Vamos
SofaScore's data visualization is aspirational. If Vamos can build a padel-specific player rating system, momentum graphs for matches, and visual stat comparisons, it would be revolutionary for the sport. The comparison tool and radar charts are particularly powerful for social sharing.

---

### 2.6 Premier Padel / World Padel Tour (premierpadel.com / worldpadeltour.com)

**What they are:** The official professional padel tours. Premier Padel is the current main tour (since 2022, backed by QSI/FIP). World Padel Tour was acquired and merged into it.

#### Information Architecture (premierpadel.com)
```
Homepage
├── News (articles + video)
├── Rankings (men's + women's)
├── Tournaments (calendar + individual event pages)
├── Players (profiles)
├── Live scores (during events)
├── Highlights (video)
└── Newsletter signup ("Sign up to our mailing list")
```

#### What They Do Well
- ✅ Have the official data (rankings, results, draws)
- ✅ Live streaming partnership with Red Bull TV
- ✅ Official tournament information
- ✅ Player database exists

#### What They Do Poorly
- ❌ **Heavily JS-rendered** — Pages return almost no content to crawlers/fetchers. Terrible for SEO.
- ❌ **Slow loading** — Multiple seconds to render useful content
- ❌ **Minimal editorial content** — News section is sparse. No opinion, no analysis, no instructional content.
- ❌ **Poor content extraction** — Rankings and tournament pages return empty/minimal markup. Data is locked in client-side rendering.
- ❌ **No live scores integration with third-party platforms** — FlashScore, SofaScore, etc. don't have padel data
- ❌ **No player stats depth** — Basic profiles without advanced statistics
- ❌ **No H2H tool** — Can't compare players
- ❌ **No community features** — No forums, no comments, no social engagement
- ❌ **Meeting minutes posted as news** (FIP steering committee minutes were the only content we could extract) — institutional, not fan-facing
- ❌ **"Sign up to our mailing list"** is the ONLY consistent content on multiple pages — lazy newsletter integration

#### Gaps Vamos Can Fill
1. **Fast, SSR-rendered padel data** — Rankings, scores, results that load instantly and are SEO-friendly
2. **Rich editorial layer** — News, analysis, opinion, instructional content
3. **Advanced player statistics** — Win rates, surface stats, tournament performance
4. **H2H comparison tool** — Doesn't exist anywhere for padel
5. **Historical data** — Match archives, rankings history
6. **"Where to Watch" guide** — Which streaming service has which tournament
7. **Tournament previews/reviews** — Editorial wrapping around data
8. **Community engagement** — Comments, predictions, fantasy
9. **Newsletter with real content** — Not just "sign up to our mailing list"
10. **Mobile-first design** — Premier Padel's site is not optimized

---

## 3. Common Patterns Across Successful Platforms

### Must-Have Patterns (present on 4+ platforms)

| Pattern | TheDink | ATP | FlashScore | ESPN | SofaScore |
|---------|---------|-----|------------|------|-----------|
| Fresh content daily | ✅ | ✅ | ✅ | ✅ | ✅ |
| Real-time/live scores | ❌ | ✅ | ✅ | ✅ | ✅ |
| Rankings display | ❌ | ✅ | ✅ | ✅ | ✅ |
| Player profiles | ❌ | ✅ | ✅ | ✅ | ✅ |
| Tournament/event pages | ❌ | ✅ | ✅ | ✅ | ✅ |
| Mobile-optimized | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Favorites/personalization | ❌ | ❌ | ✅ | ✅ | ✅ |
| Country flags/national ID | ❌ | ✅ | ✅ | ✅ | ✅ |
| Newsletter/email capture | ✅ | ✅ | ❌ | ✅ | ❌ |
| Social sharing | ✅ | ✅ | ⚠️ | ✅ | ✅ |

### Design Patterns

1. **Three-column layout** (FlashScore, SofaScore): Sidebar nav | Main content | Contextual
2. **Magazine layout** (TheDink, ESPN): Hero + grid + list
3. **Data widgets in editorial** (ESPN, ATP): Scoreboards woven into news flow
4. **Category tagging** (TheDink, ESPN): Every piece of content has a category tag
5. **Date-based navigation** (FlashScore, SofaScore): Previous/Today/Next for scores
6. **Tournament grouping** (FlashScore, SofaScore, ATP): Matches organized under tournament headers
7. **Visual hierarchy with images** (all): Large hero images, player headshots, tournament imagery

### Engagement Patterns

1. **Newsletter as primary CTA** (TheDink): 100k+ subscribers through aggressive but not annoying placement
2. **H2H tool** (ATP, SofaScore): Drives repeat visits and social sharing
3. **Player rating system** (SofaScore): Creates debate and discussion
4. **Live data** (FlashScore, SofaScore): Habitual daily visits
5. **Push notifications** (FlashScore, SofaScore, ESPN): Re-engagement without requiring app open
6. **"Where to Watch"** (ESPN): Solves the #1 fan question during tournaments

---

## 4. Specific Recommendations for Vamos.net

### 4.1 Strategic Positioning

**Be the intersection of TheDink (media) + ATP Tour (official data) + FlashScore (live scores) — but ONLY for padel.**

No one is doing this. Premier Padel is the closest, but their execution is poor. Third-party score platforms don't cover padel. Media sites for padel are fragmented and small.

### 4.2 Content Recommendations

#### ADD:
1. **Daily news articles** — Minimum 2-3 per day. Tournament previews, match recaps, transfer rumors, equipment reviews.
2. **Newsletter** — Make it the #1 CTA. "The Padel Brief" or similar. Aim for daily or 3x/week.
3. **Player profiles** — Comprehensive pages: bio, stats, rankings history, recent results, social links, equipment, playing style.
4. **H2H tool** — Player comparison tool. Doesn't exist for padel. Huge differentiator.
5. **"Where to Watch" guide** — Map of streaming services per tournament per region.
6. **Tournament preview/review articles** — Editorial wrapping around tournament data.
7. **Instructional content** — Tips, tactics, drills (TheDink's bread and butter). Drives amateur traffic.
8. **Podcast** — Audio/video podcast covering padel weekly.
9. **Gear reviews** — Padel racket reviews, shoe reviews, etc.
10. **Fantasy Padel** — Gamification layer for engagement.

#### REMOVE/AVOID:
1. ❌ Don't launch with just a landing page. Ship a content-rich MVP.
2. ❌ Don't bury newsletter signup in footer. Make it prominent.
3. ❌ Don't separate "data" and "media" into different apps/sites. Combine them.
4. ❌ Don't use heavy client-side rendering only (Premier Padel's mistake). Use SSR/SSG for SEO.
5. ❌ Don't try to cover all sports. Stay padel-only. Depth > breadth.

#### RESTRUCTURE:
1. Homepage should combine live scores + news + rankings (not be separate pages)
2. Player pages should be the center of the information architecture (link everything to players)
3. Tournament pages should be date-anchored (what's happening NOW, not just a static list)

### 4.3 Technical Recommendations

1. **Server-side rendering (SSR) or static generation (SSG)** — Critical for SEO. Premier Padel loses massive organic traffic because their pages render empty.
2. **WebSocket or SSE for live scores** — Real-time updates without page refresh.
3. **Progressive Web App (PWA)** — App-like experience without app store friction.
4. **Structured data (schema.org)** — SportsEvent, Person, SportsTeam markup for Google rich results.
5. **Fast page loads** — Target < 2 seconds. FlashScore and SofaScore set the bar.
6. **Dark mode** — SofaScore offers this; modern expectation for data-heavy sites.
7. **API-first architecture** — Build the data layer first; feed the website, future app, and potential partners from the same API.

---

## 5. Proposed Sitemap & Navigation Structure

### Primary Navigation Bar

```
[VAMOS Logo]  Live Scores  Rankings  Tournaments  Players  News  [Search] [🔔] [👤]
```

| Nav Item | Description |
|----------|-------------|
| **Live Scores** | Real-time match scores, grouped by tournament. Date selector. |
| **Rankings** | FIP Rankings (Men/Women), Race rankings, Live rankings during events |
| **Tournaments** | Calendar view + individual tournament pages |
| **Players** | Searchable directory + individual player profiles |
| **News** | Articles, analysis, reviews, instructional content |
| **Search** | Global search (players, tournaments, articles) |
| **🔔** | Notification preferences |
| **👤** | Account/Favorites |

### Secondary Navigation (contextual, appears under primary)

**On Rankings page:** `Singles | Doubles | Race | Live Rankings`
**On Tournament page:** `Overview | Draws | Schedule | Results | Stats | Info`
**On Player page:** `Overview | Stats | Results | Rankings History | H2H | News`
**On News page:** `All | Match Reports | Features | Analysis | Gear | How to Play`

### Footer Navigation

```
├── Scores          ├── About             ├── Follow Us
│   Live Scores     │   About Vamos       │   Twitter/X
│   Results         │   Contact            │   Instagram
│   Calendar        │   Careers            │   YouTube
├── Data            │   Press              │   TikTok
│   Rankings        │   Advertise          │   Newsletter
│   Players         ├── Legal              
│   H2H Tool        │   Privacy Policy     
│   Stats           │   Terms of Service   
│   Tournament Info │   Cookie Policy      
```

### Full Sitemap

```
vamos.net/
├── / (homepage)
├── /live-scores
│   └── /live-scores?tournament=xxx
├── /rankings
│   ├── /rankings/men
│   ├── /rankings/women
│   ├── /rankings/race
│   └── /rankings/live
├── /tournaments
│   ├── /tournaments/calendar
│   └── /tournaments/[tournament-slug]
│       ├── /overview
│       ├── /draws
│       ├── /schedule
│       ├── /results
│       └── /stats
├── /players
│   ├── /players (directory/search)
│   └── /players/[player-slug]
│       ├── /overview
│       ├── /stats
│       ├── /results
│       ├── /rankings-history
│       └── /h2h
├── /h2h (standalone H2H tool)
│   └── /h2h/[player1]-vs-[player2]
├── /news
│   ├── /news (all articles)
│   ├── /news/[category] (match-reports, features, analysis, gear, how-to-play)
│   └── /news/[article-slug]
├── /where-to-watch
├── /newsletter
├── /about
├── /contact
└── /privacy | /terms
```

---

## 6. Homepage Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  [VAMOS]  Live Scores  Rankings  Tournaments  Players  News │
│                                              [🔍] [🔔] [👤] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── LIVE SCORES TICKER ─────────────────────────────────┐ │
│  │ 🔴 Galan/Lebron 6-4 3-2 vs Bela/Coello  │ Tapia/...   │ │
│  │    << scroll >>                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │                          │  │  📬 THE PADEL BRIEF       │ │
│  │   🏆 FEATURED STORY      │  │                          │ │
│  │   [Large Hero Image]     │  │  Get the top padel news  │ │
│  │                          │  │  delivered daily.        │ │
│  │   Category Tag           │  │                          │ │
│  │   Big Headline Here      │  │  [email@example.com   ]  │ │
│  │   Author • 2h ago        │  │  [  Subscribe Free  ☑ ]  │ │
│  │                          │  │                          │ │
│  │                          │  │  Join 10,000+ fans ✨     │ │
│  │                          │  ├──────────────────────────┤ │
│  │                          │  │  📊 RANKINGS              │ │
│  │                          │  │  1. 🇦🇷 Galan    8,540   │ │
│  │                          │  │  2. 🇪🇸 Lebron   8,210   │ │
│  │                          │  │  3. 🇪🇸 Coello   7,890   │ │
│  │                          │  │  4. 🇦🇷 Tapia    7,540   │ │
│  │                          │  │  5. 🇪🇸 Bela     7,120   │ │
│  └──────────────────────────┘  │  [View Full Rankings →]   │ │
│                                └──────────────────────────┘ │
│                                                             │
│  ┌────── LATEST NEWS ───────────────────────────────────────┐│
│  │                                                         ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      ││
│  │  │ [image] │ │ [image] │ │ [image] │ │ [image] │      ││
│  │  │ Tag     │ │ Tag     │ │ Tag     │ │ Tag     │      ││
│  │  │ Title   │ │ Title   │ │ Title   │ │ Title   │      ││
│  │  │ Author  │ │ Author  │ │ Author  │ │ Author  │      ││
│  │  │ 3h ago  │ │ 5h ago  │ │ 1d ago  │ │ 1d ago  │      ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      ││
│  │                                        [More News →]    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌────── UPCOMING TOURNAMENT ──────────────────────────────┐│
│  │                                                         ││
│  │  🏟️ [Tournament Image/Banner]                           ││
│  │  Premier Padel Major — Doha 2026                        ││
│  │  March 10-16 • Khalifa International Complex            ││
│  │                                                         ││
│  │  [View Draws] [Schedule] [Where to Watch] [Set Alert]   ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │  ⚔️ HEAD TO HEAD          │  │  📺 WHERE TO WATCH       │ │
│  │                          │  │                          │ │
│  │  [Player A] vs [Player B]│  │  🔴 LIVE NOW              │ │
│  │  🇦🇷 Photo    Photo 🇪🇸  │  │  Premier Padel P2 Gijon  │ │
│  │       5  -  3            │  │  → Red Bull TV            │ │
│  │                          │  │  → Vamos.net/live         │ │
│  │  [Compare Any Players →] │  │                          │ │
│  │                          │  │  COMING UP                │ │
│  └──────────────────────────┘  │  Major Doha — Mar 10      │ │
│                                │  → Red Bull TV            │ │
│                                └──────────────────────────┘ │
│                                                             │
│  ┌────── RECENT RESULTS ───────────────────────────────────┐│
│  │  Premier Padel P2 Gijon — Final                         ││
│  │  🇦🇷 Galan / Lebron  6-4 6-3  🇪🇸 Bela / Coello  ✓    ││
│  │  ─────────────────────────────────────────              ││
│  │  Premier Padel P2 Gijon — Semifinal                     ││
│  │  🇦🇷 Tapia / Di Nenno  4-6 7-5 6-2  🇪🇸 Stupa / ...  ││
│  │                              [All Results →]            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌────── FROM THE BLOG ────────────────────────────────────┐│
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                   ││
│  │  │ [image] │ │ [image] │ │ [image] │                   ││
│  │  │ How-To  │ │ Gear    │ │ Feature │                   ││
│  │  │ Title   │ │ Title   │ │ Title   │                   ││
│  │  └─────────┘ └─────────┘ └─────────┘                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌────── NEWSLETTER CTA (BOTTOM) ──────────────────────────┐│
│  │  🎾 Never miss a match. The Padel Brief — free daily.   ││
│  │  [email@example.com           ] [Subscribe]              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌────── FOOTER ───────────────────────────────────────────┐│
│  │  Scores • Rankings • Tournaments • Players • News       ││
│  │  About • Contact • Privacy • Terms                      ││
│  │  Twitter • Instagram • YouTube • TikTok                 ││
│  │  © 2026 Arbi Smart Solutions LLC                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Section-by-Section Rationale

| # | Section | Why | Inspiration |
|---|---------|-----|-------------|
| 1 | Live Scores Ticker | Creates urgency, daily visit habit | FlashScore, ESPN |
| 2 | Featured Story + Newsletter + Rankings | The "power trio" — fresh content, email capture, data | TheDink + ATP Tour |
| 3 | Latest News (4 cards) | Proves the site is alive and active | TheDink, ESPN |
| 4 | Upcoming Tournament | What's next in padel — timely, actionable | ATP Tour |
| 5 | H2H Tool + Where to Watch | Two unique features no padel competitor offers | ATP Tour, ESPN |
| 6 | Recent Results | Serves the "what happened?" audience | FlashScore |
| 7 | Blog/How-To | Drives SEO traffic from amateur players | TheDink |
| 8 | Newsletter CTA (bottom) | Second chance capture for scrollers | TheDink |
| 9 | Footer | Standard nav + social proof | All |

---

## 7. Priority Ranking — What to Build First

### Phase 1: Launch MVP (Weeks 1-4) 🚀
**Goal: Be the best padel data destination. Get indexed by Google.**

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | **Rankings page** (Men + Women) | Medium | 🔥🔥🔥🔥🔥 |
| P0 | **Player profiles** (basic: bio, rank, country, photo) | Medium | 🔥🔥🔥🔥🔥 |
| P0 | **Tournament calendar** | Low | 🔥🔥🔥🔥 |
| P0 | **Newsletter signup** (prominent, homepage + every page) | Low | 🔥🔥🔥🔥🔥 |
| P1 | **News articles** (at least 3-5 seed articles) | Medium | 🔥🔥🔥🔥 |
| P1 | **SSR/SSG for all pages** (SEO) | Medium | 🔥🔥🔥🔥🔥 |
| P1 | **Homepage** with rankings widget + news + tournament info | High | 🔥🔥🔥🔥🔥 |

**Why Rankings First:** Rankings pages are searched constantly ("padel rankings 2026", "FIP rankings", "best padel players"). They're SEO gold, update weekly, and drive habitual visits. ATP Tour's rankings page is one of their highest-traffic pages.

### Phase 2: Data Depth (Weeks 5-8) 📊
**Goal: Become indispensable for padel data.**

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P1 | **Tournament pages** (draws, schedule, results) | High | 🔥🔥🔥🔥🔥 |
| P1 | **Match results** (historical) | High | 🔥🔥🔥🔥 |
| P1 | **Player stats** (win rate, titles, H2H record) | High | 🔥🔥🔥🔥🔥 |
| P2 | **H2H comparison tool** | Medium | 🔥🔥🔥🔥🔥 |
| P2 | **"Where to Watch" page** | Low | 🔥🔥🔥🔥 |
| P2 | **Search functionality** | Medium | 🔥🔥🔥 |

### Phase 3: Live Experience (Weeks 9-16) 🔴
**Goal: Become the real-time destination during tournaments.**

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P1 | **Live scores** (WebSocket/SSE, auto-updating) | Very High | 🔥🔥🔥🔥🔥 |
| P2 | **Live scores ticker** on homepage | Medium | 🔥🔥🔥🔥 |
| P2 | **Push notifications** (match start, set results) | High | 🔥🔥🔥🔥 |
| P2 | **Live rankings** (during tournament weeks) | Medium | 🔥🔥🔥 |
| P3 | **Match detail pages** (timeline, set-by-set) | High | 🔥🔥🔥🔥 |

### Phase 4: Media & Community (Weeks 17-24) 📰
**Goal: Build the editorial voice and community.**

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P2 | **Regular news content** (daily articles) | Ongoing | 🔥🔥🔥🔥 |
| P2 | **Podcast/video content** | Ongoing | 🔥🔥🔥 |
| P3 | **Gear reviews** | Low/article | 🔥🔥🔥 |
| P3 | **How-to-play content** | Low/article | 🔥🔥🔥 |
| P3 | **User favorites/follows** | High | 🔥🔥🔥🔥 |
| P3 | **Dark mode** | Low | 🔥🔥 |
| P4 | **Fantasy Padel** | Very High | 🔥🔥🔥🔥🔥 |
| P4 | **Mobile app** (or PWA) | Very High | 🔥🔥🔥🔥 |

### Phase 5: Differentiation (Months 6+) ⭐
**Goal: Features no one else has.**

| Feature | Notes |
|---------|-------|
| **Player rating algorithm** (SofaScore-style) | Assign match ratings to padel players |
| **Match momentum visualization** | Like SofaScore's momentum graph |
| **Padel court finder** | Where to play near you |
| **Tournament bracket predictions** | Gamified predictions |
| **API for partners** | License padel data to other platforms |
| **Multi-language** (ES, EN, FR, PT, IT, AR) | Padel's key markets |

---

## Appendix: Key Metrics to Track

| Metric | Target | Why |
|--------|--------|-----|
| Newsletter subscribers | 1,000 in month 1, 10,000 in month 6 | Core retention mechanism |
| Pages indexed by Google | 500+ within 3 months | SEO foundation |
| Rankings page visits | #1 organic traffic source | Validates data-first strategy |
| Time on player profiles | > 2 min average | Shows engagement depth |
| Return visit rate | > 40% weekly | Proves habitual usage |
| Live scores session duration | > 5 min during tournaments | Proves real-time value |
| Newsletter open rate | > 45% | Healthy niche newsletter |
| Social shares (H2H tool) | Track viral coefficient | Proves differentiation |

---

*This research document should be treated as a living document. Update it as Vamos.net launches features and gathers real user data.*
