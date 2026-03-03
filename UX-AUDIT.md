# VAMOS.NET — UX Audit & Recommendations

**Date:** March 3, 2026  
**Scope:** Full competitive analysis + actionable redesign recommendations  
**Current URL:** https://vamos-net.vercel.app

---

## Table of Contents

1. [Competitive Analysis](#1-competitive-analysis)
2. [Vamos.net Current State Audit](#2-vamosnet-current-state-audit)
3. [Gap Analysis](#3-gap-analysis)
4. [Proposed Sitemap / Information Architecture](#4-proposed-sitemap--information-architecture)
5. [Homepage Layout Recommendations](#5-homepage-layout-recommendations)
6. [Navigation Structure Recommendations](#6-navigation-structure-recommendations)
7. [Scores Page UX Improvements](#7-scores-page-ux-improvements)
8. [Rankings Page UX Improvements](#8-rankings-page-ux-improvements)
9. [News/Content Strategy Layout](#9-newscontent-strategy-layout)
10. [Mobile-Specific Recommendations](#10-mobile-specific-recommendations)
11. [Quick Wins vs Bigger Redesigns](#11-quick-wins-vs-bigger-redesigns)

---

## 1. Competitive Analysis

### 1.1 The Dink Pickleball (thedinkpickleball.com) — PRIMARY REFERENCE

**Why it matters:** The closest analog to Vamos — a niche racquet-sport media company building authority in a fast-growing sport.

**Navigation Structure:**
- Top bar: Logo + tagline ("Pickleball Lives Here") + hamburger menu
- Footer reveals full nav: News & Stories, The Pros, Pickleball 101, Pickleball Tips, Videos, Podcast, Shop, Newsletter, Careers
- No mega menus — flat, simple architecture
- Newsletter and Shop get prominent placement alongside content categories

**Homepage Composition (top to bottom):**
1. **Hero carousel** (3 slides) — large featured stories with category tags (e.g., "PPA Tour"), author, date
2. **Secondary carousel** — 3 panels: Podcast promo, Newsletter CTA ("Get Smarter About Pickleball — Join 100k+"), Sponsor banner
3. **"Top Stories" section** — 2×2 grid of article cards with thumbnails, category badges, and bylines
4. **"Latest Articles" section** — 2-column list with thumbnails, titles, bylines
5. **Newsletter embed** — Embedded newsletter feed carousel showing recent issues with preview text
6. **Horizontal article carousel** with dot navigation (swipeable)
7. **"Life of a Pro" section** — 3-card carousel of player-focused stories
8. **"Latest Articles" (repeat)** — 2×3 grid with larger thumbnails
9. **Podcast/Ad banners**
10. **Footer** — Newsletter signup, social links, Shop/Newsletter/Partner sections, full nav

**Key UX Patterns:**
- **Content categories as badges** on every article card (PPA Tour, MLP Draft, Up Your Game, The Dink Reviews, The Pros)
- **Newsletter is treated as a core product**, not an afterthought — embedded feed, multiple CTAs, subscriber count shown
- **No live scores or rankings** — purely media/content play
- **Popup newsletter CTA** on page load
- Heavy use of **article carousels** with dot pagination
- **Author attribution** on every piece
- Multiple entry points for same content (redundancy is intentional for engagement)

**What to steal for Vamos:**
- Category badge system for content
- Newsletter as a first-class product with embedded feed
- "Life of a Pro" style player-focused content section
- The density — The Dink packs 30+ article touchpoints on the homepage

---

### 1.2 ATP Tour (atptour.com) — THE GOLD STANDARD

**Why it matters:** The benchmark for official racquet sport platforms. What every serious sports site aspires to.

**Navigation Structure:**
- **Persistent top nav:** Rankings, Scores, Schedule, Players, Stats, News, Video, Photos
- **Rankings dropdown:** Singles, Doubles, Race to Turin, Pepperstone ATP Rankings breakdown
- **Scores:** Live scores with tournament context, completed results
- **Players:** Search, A-Z, profile pages with bio, stats, activity, H2H
- **Stats:** Season leaders in various categories (aces, win %, etc.)
- Two-level nav: primary categories → dropdowns with subcategories

**Homepage Composition:**
1. Hero: Featured news story or live tournament banner
2. Live scores ticker/widget (always visible when matches are on)
3. Latest news grid
4. Rankings snapshot
5. Upcoming tournaments
6. Video highlights
7. Photos/galleries

**Live Scores UX:**
- **Tournament-centric view:** Scores grouped by tournament, then by round
- **Match cards** show: player names + flags, seed numbers, set scores in a grid, match status (Live/Completed/Upcoming)
- **Court assignment** shown for live matches
- **Auto-refresh** without page reload
- Click into match → detailed stats, point-by-point, H2H

**Rankings Page:**
- **Tabbed:** Singles / Doubles / Race
- Table: Rank, Move indicator (▲▼), Player name + flag + photo, Age, Points, Tournaments played, Points dropping, Next best
- **Search/filter** functionality
- **Date selector** for historical rankings
- Click player → full profile

**Key UX Patterns:**
- **Flag/country indicators** everywhere (compact, informative)
- **Rank movement arrows** (▲▼ with position change number)
- **Tournament tier badges** (Grand Slam, Masters 1000, ATP 500, ATP 250)
- **Player profile pages** are comprehensive: bio, stats, activity, H2H, videos
- **Head-to-Head tool** as a standalone feature
- **Tournament pages** with draws, results, players, facts

**What to steal for Vamos:**
- Tournament-tier badge system (Major, P1, P2 already exist — make them more prominent)
- Rank movement indicators
- Player profile pages with stats, H2H, activity
- Tournament detail pages with full draws
- Date selector for historical rankings
- Court assignment for live matches

---

### 1.3 FlashScore (flashscore.com) — LIVE SCORES KING

**Why it matters:** The benchmark for real-time score tracking UX. 100M+ monthly visits.

**Navigation Structure:**
- **Left sidebar:** Sport selector (30+ sports as icons + text). Padel is included.
- **Top bar:** Search, Favorites (star), My Leagues, Settings
- **Date navigation:** Horizontal date picker (Yesterday / Today / Tomorrow + calendar) right above scores

**Homepage / Scores Layout:**
- **The entire homepage IS the scores page** — no blog, no fluff
- Scores grouped by **league/tournament**, with collapsible sections
- Each match row: Time | Home team | Score | Away team | Status indicators
- **Live matches** highlighted with pulsing green dot and bold scores
- **Finished matches** show final score with set details on hover/click
- **Upcoming matches** show scheduled time
- Match click → expands to: Summary, Statistics, Lineups, H2H, Standings, Video
- **Favorites system:** Star any match, team, or league → appears in dedicated tab
- **Pin system:** Pin important matches to top

**Key UX Patterns:**
- **Information density is extreme** — 30+ matches visible without scrolling
- **Score animations** — scores flash/highlight when updated
- **Minimal chrome** — almost no padding, every pixel used for data
- **Color coding:** Green = live, Gray = finished, White = upcoming
- **Sound notifications** for goals/score changes (optional)
- **Dark mode** support
- **Responsive auto-refresh** — data updates every few seconds without page reload
- **No images** in the main scores view — pure data efficiency

**What to steal for Vamos:**
- Date picker for navigating scores by day
- Group matches by tournament AND round
- Live match highlighting (green dot, bold scores)
- Match detail expansion (click row → stats, H2H)
- Favorites/follow system
- Score change animations
- Information density philosophy — show more matches per screen

---

### 1.4 SofaScore (sofascore.com) — STATS + VISUAL DATA

**Why it matters:** The gold standard for turning sports data into visual, shareable content.

**Navigation Structure:**
- **Top bar:** Sport tabs (Football, Basketball, Tennis, etc. — padel included)
- **Left sidebar:** Leagues/tournaments for selected sport
- **Date navigation:** Horizontal date scroller
- Scores as the default homepage view

**Homepage Composition:**
- Nearly identical structure to FlashScore — scores ARE the homepage
- Matches grouped by tournament
- Each match: Teams, Score, Time, Status, Sofascore Rating badges

**Live Scores UX:**
- Match cards with **Sofascore player ratings** (unique 0-10 scale)
- Click into match → **tabbed detail view:**
  - Summary (key events timeline)
  - Statistics (visual bar charts for every stat)
  - Lineups with individual ratings
  - **Attack Momentum graph** (real-time visualization of pressure)
  - **Heatmaps** for players
  - **Shotmaps** (position of shots on field/court)
  - H2H
  - Standings
- **Player comparison tool** — side-by-side stat comparison

**Rankings Page:**
- Tournament standings with form indicators (W/L streak)
- Season statistics leaderboards

**Key UX Patterns:**
- **Proprietary ratings** create unique value and shareability
- **Visual data (heatmaps, shotmaps, momentum graphs)** turn stats into stories
- **Player of the match** designation with rating badge
- **Form indicators** (last 5 results as W/L/D icons)
- **Attribute overview** radar charts for player strengths
- Modern, clean aesthetic with **card-based design**
- Excellent use of **micro-animations** for data updates

**What to steal for Vamos:**
- Form indicators for players/pairs
- Visual stat representations (bar charts at minimum)
- Player ratings concept (even simplified for padel)
- Match momentum/timeline visualization
- Player comparison tool
- Clean card-based match detail design

---

### 1.5 ESPN (espn.com) — GENERAL SPORTS MEDIA

**Why it matters:** The template for how to organize multi-faceted sports content.

**Navigation Structure:**
- **Top bar:** Sport dropdowns (NFL, NBA, MLB, NHL, Soccer, MMA, Tennis, etc.)
- Each sport has **sub-nav:** Scores, Schedule, Standings, Stats, Teams, Players, Injuries, Transactions
- **Secondary nav:** ESPN+, Watch, Fantasy, Listen
- **Quick links bar** below main nav with contextual links
- **Mega menus** on hover with deep categorization

**Homepage Composition:**
1. **Hero story** with massive image and headline
2. **Top Headlines** sidebar (text-only list, 8-10 items)
3. **Sport sections** cycling through: NBA Scoreboard, NFL Draft, Men's College Hoops, NHL, etc.
4. Each sport section: 2-3 featured stories + bullet-point links
5. **"ICYMI" section** — video clips
6. **"Trending Now"** — 5 trending stories with images
7. **"Sign up to play" CTAs** for fantasy sports

**Key UX Patterns:**
- **Scoreboard widgets** embedded directly in content sections
- **Contextual navigation** changes based on what's happening in sports right now (e.g., "OFFSEASON MOVES" section appears during NFL free agency)
- **Emoji usage** in headlines (📋, ⬆⬇, 📅) for visual scanning
- **Story + bullet links pattern:** 2 feature stories followed by 3-5 bullet-point links
- **"Subscribe Now" CTA** always in top nav
- Massive use of **video content**
- **Personalization:** "Customize ESPN" to follow favorite teams/sports

**What to steal for Vamos:**
- Embedded score widgets within content sections
- Contextual sections that change based on what's live/current
- The "Feature story + bullet links" pattern for news sections
- Video highlight integration
- Personalization/follow system

---

### 1.6 The Athletic (nytimes.com/athletic) — PREMIUM CONTENT

**Why it matters:** Shows how to do premium sports journalism with clean UX.

**Navigation Structure:**
- **Top bar:** NFL, NBA, NHL, MLB, Soccer, NCAAF, NCAAB, Fantasy + More
- Clean, editorial-focused nav — no scores in the primary nav

**Homepage Composition:**
1. **5 featured stories** at top — large cards with images, headlines, bylines, comment counts
2. **"Headlines" section** — text-only list of breaking news
3. **Sport sections:** Each sport gets a section with 6 story cards
4. **"Discover More"** — mixed-sport feature stories
5. **"Most Popular"** — numbered list of trending articles with comment counts
6. **Interactive features** — "Connections: Sports Edition" puzzle

**Key UX Patterns:**
- **Comment counts** on articles (social proof, engagement driver)
- **Author bylines** prominently displayed
- **Clean, minimal design** — lots of white space, editorial feel
- **"Most Popular" section** with numbered rankings
- **Subscriber-exclusive content** badges
- Article cards show **reading time indicators**
- **Section-based organization** is crystal clear

**What to steal for Vamos:**
- "Most Popular" / "Trending" section
- Comment counts as engagement indicators
- Clean editorial design language
- Reading time estimates
- Strong author/byline presence

---

### 1.7 PadelFIP (padelfip.com) — OFFICIAL FEDERATION

**Why it matters:** The official body for padel. Their structure reflects the sport's actual taxonomy.

**Navigation Structure (Mega Menu):**
- **Tournaments:** Qatar Airways Premier Padel Tour (by year), Cupra FIP Tour (by year), Hexagon World Series, FIP Championships, FIP Promises, FIP Beyond, All, Historical Circuit Statistics
- **Rankings:** Ranking Male, Ranking Female, Race (Top 100 Male/Female), Promises' Rankings (by continent: Africa, America, Asia, Europe), National Teams Rankings, Ranking History, System & Points Breakdown
- **News & Media:** News (FIP / Premier Padel [Major/P1/P2/Finals] / Cupra FIP Tour [Platinum/Gold/Silver/Bronze] / Archive / Hexagon / FIP Championships), Photo Galleries
- **About Us:** Who We Are, History, Organization, Strategic Plan, World Padel Report, Clean Sport, Roll of Honour, Contacts, Federations, Documents, Academy

**Homepage Composition:**
1. News slider (latest results/stories)
2. **Live Score section** with link
3. **Upcoming events** carousel with dates, locations, tier badges
4. **FIP Ranking mini-table** (top 10 with country flags, points)
5. More news articles
6. Federation member countries map/list (by continent)

**Key UX Patterns:**
- **Deep taxonomy** for tournament tiers (Major > P1 > P2 > Platinum > Gold > Silver > Bronze)
- **Separate rankings for Promises (juniors)** by continent
- **National team rankings** as a separate category
- **Race rankings** (season-based) distinct from overall rankings
- **Points breakdown documentation** publicly accessible
- **Federation/country pages** for each member nation
- **Players' Area** in header (for registered players)

**What to steal for Vamos:**
- The full ranking taxonomy: Overall, Race, Promises, National Teams
- Tournament tier system clearly explained
- Points breakdown page
- Historical ranking data/lookup
- Country/federation pages as content hubs
- Tournament categorization depth

---

### 1.8 Additional Padel Competitors

**premierpadel.com** (official tour site):
- Live scores, results, rankings, tournament info, players, highlights, news
- Clean, modern design with video focus
- The "official" source but often delayed/limited

**padelalto.com** (padel media):
- News/blog format, similar to The Dink model
- Coverage of Premier Padel and WPT history
- Limited data/scores features

**analistaspadel.com** (padel analytics):
- News + exclusives
- Spanish-first with English version
- Analytics/statistical focus

**padelinfo.com**: Domain is for sale ($3,000 min) — not an active competitor.

---

## 2. Vamos.net Current State Audit

### 2.1 Navigation

**Current:** Logo ("VAMOS") + hamburger menu (☰)  
**Contents:** Live Scores, Rankings, Calendar, News, Business, About

**Issues:**
- ❌ **All navigation hidden behind hamburger** — even on desktop. FlashScore, ESPN, ATP Tour all show primary nav items directly in the header.
- ❌ **No visual hierarchy** between sections — "Live Scores" and "About" are given equal weight.
- ❌ **No indication of live content** — no badge/dot showing live matches are happening.
- ❌ **"Business" in main nav** is unusual for a sports site — should be secondary/footer.
- ❌ **No search** anywhere on the site.
- ❌ **No "Players" section** — ATP, SofaScore, and PadelFIP all have dedicated player sections.

### 2.2 Homepage (/)

**Current structure (top to bottom):**
1. Live tournament banner ("LIVE NOW P2 — Gijón P2 2026") with "View Scores" CTA
2. "Recent Results" — 4 match cards (2 finals + 2 semis) in 2-column layout
3. "Rankings" — Men's Top 5 + Women's Top 5 tables
4. "Upcoming Tournaments" — 3 tournament cards
5. "Stay in the Game" — Newsletter signup
6. Footer

**Issues:**
- ❌ **Extremely sparse** — only ~5 sections, most below-the-fold content is 50% whitespace
- ❌ **No hero content** — just a small banner. Compare to The Dink's full-width hero carousel or ESPN's massive hero story.
- ❌ **No news on the homepage** — the most visited page has zero editorial content. The Dink packs 30+ article touchpoints on their homepage.
- ❌ **Recent Results shows only 4 matches** — FlashScore shows 30+ in the same space.
- ❌ **No images anywhere** — no player photos, no tournament photos, no action shots. Every competitor uses imagery heavily.
- ❌ **Rankings is a static table** — no interactivity, no links to full rankings from each row.
- ❌ **Newsletter is the only CTA** — no social links, no app download, no "follow player" prompts.
- ❌ **Upcoming Tournaments section shows only 3** — calendar has 28.
- ❌ **No video content** anywhere.
- ❌ **No social proof** — subscriber counts, follower counts, "trusted by X fans."

### 2.3 Scores Page (/scores)

**Current:** Three tab filters (Upcoming | Riyadh Season P1 | Gijón P2 2026). Long flat list of matches.

**Issues:**
- ❌ **Massive undifferentiated list** — 60+ matches in a single scroll with minimal visual grouping. FlashScore groups by tournament AND round.
- ❌ **No date picker** — can't navigate to specific days. FlashScore's date picker is its #1 UX pattern.
- ❌ **No round grouping** — Round of 32, Round of 16, QF, SF, Final all run together. The round info is in small text but not used as a visual separator.
- ❌ **Upcoming and Finished are mixed** in the same tab — should be clearly separated.
- ❌ **No live match highlighting** — when a match is live, it should pulse/highlight like FlashScore's green dot.
- ❌ **Score display is cramped** — tiebreak scores are hard to read (e.g., "76(4)6" is confusing vs "7-6(4) 6-4").
- ❌ **No match detail expansion** — clicking a match should show stats, duration, H2H.
- ❌ **No favorites/follow system** — can't track specific players or matches.
- ❌ **"TBD" entries** are confusing — draws not yet made should be handled differently.
- ❌ **Gender tags** ("men"/"women") are plain text at the end of each row — should be a filter, not a label.
- ❌ **No auto-refresh** for live scores.

### 2.4 Rankings Page (/rankings)

**Current:** Men/Women tabs. Table with Rank, Player photo, Name, Country flag, Points.

**Issues:**
- ❌ **No rank movement indicators** — ATP shows ▲▼ arrows with position change.
- ❌ **No search or filter** — can't search for a specific player.
- ❌ **No pagination or "load more"** — shows exactly 34 players, then stops.
- ❌ **No "Race" ranking** — PadelFIP separates overall ranking from season race.
- ❌ **No pairs ranking** — padel is a doubles sport! Players are ranked individually but play in pairs. Where's the pairs ranking?
- ❌ **No points breakdown** — ATP shows tournaments played, points dropping, next best.
- ❌ **No historical data** — can't see past rankings.
- ❌ **Clicking a player does nothing** — no player profile pages.
- ❌ **Country filter missing** — can't filter by nationality.
- ❌ **No date context** — when was this ranking last updated?

### 2.5 Calendar Page (/calendar)

**Current:** Monthly sections with tournament cards. Each card shows tier badge, name, location, dates, status.

**Issues:**
- ✅ **Actually pretty good** — clean, scannable, tournament tiers are visible.
- ❌ **No map view** — tournaments span 20+ countries, a map would be valuable.
- ❌ **No filter by tier** (Major / P1 / P2) — would help users find the big events.
- ❌ **No "add to calendar" functionality** — Google Cal / Apple Cal / ICS export.
- ❌ **No tournament detail pages** — clicking should show draws, players, results, venue info.
- ❌ **No past results** — can't see what happened at completed tournaments.

### 2.6 News Page (/news)

**Current:** Simple list of 6 articles with category tags, dates, titles, descriptions.

**Issues:**
- ❌ **Only 6 articles** — this feels like a placeholder, not a content hub.
- ❌ **No hero/featured article** — all articles are the same visual weight.
- ❌ **No images** — every competitor uses thumbnails on news pages.
- ❌ **No category filtering** — articles are tagged (Tour News, Rankings, Business) but no filter UI.
- ❌ **No author attribution** — who wrote these? The Dink and The Athletic both prominently show bylines.
- ❌ **No reading time** — The Athletic shows this.
- ❌ **No "Most Popular" or "Trending"** — ESPN and The Athletic both have these.
- ❌ **No pagination / infinite scroll** — just 6 articles, period.
- ❌ **No video content** integration.

### 2.7 Business Page (/business)

**Current:** Six category cards with titles and descriptions (Market Growth, Court Economics, Sponsorships, Player Earnings, Investment, Industry News).

**Issues:**
- ❌ **Pure placeholder** — no actual content behind any category.
- ❌ **Unique value proposition** — this is actually a great differentiator vs other padel sites. Business of padel is underserved content. But it needs actual articles, data, reports.
- Recommend: Keep this concept but fill it with content. Could be the premium/exclusive section.

### 2.8 About Page (/about)

**Current:** Brief about text, what we cover list, contact email, newsletter signup.

**Issues:**
- ✅ Adequate for launch.
- ❌ **No team page** — who is behind Vamos?
- ❌ **No social links** — footer has social icons but no actual linked accounts.
- ❌ **No press kit / media assets**.

---

## 3. Gap Analysis

### Critical Gaps (Must Fix)

| Feature | FlashScore | ATP | The Dink | SofaScore | Vamos |
|---------|-----------|-----|----------|-----------|-------|
| Visible top navigation | ✅ | ✅ | ✅ | ✅ | ❌ |
| Date picker for scores | ✅ | ✅ | N/A | ✅ | ❌ |
| Score grouping by round | ✅ | ✅ | N/A | ✅ | ❌ |
| Live match indicators | ✅ | ✅ | N/A | ✅ | ❌ |
| Player profile pages | ✅ | ✅ | N/A | ✅ | ❌ |
| Rank movement arrows | ✅ | ✅ | N/A | ✅ | ❌ |
| Search functionality | ✅ | ✅ | ✅ | ✅ | ❌ |
| News with images | ✅ | ✅ | ✅ | ✅ | ❌ |
| Homepage news content | N/A | ✅ | ✅ | N/A | ❌ |
| Gender/category filters | ✅ | ✅ | N/A | ✅ | ❌ |

### Important Gaps (Should Fix)

| Feature | Best Example | Vamos |
|---------|-------------|-------|
| Match detail expansion | FlashScore, SofaScore | ❌ |
| Favorites / follow system | FlashScore, SofaScore | ❌ |
| Tournament detail pages | ATP, PadelFIP | ❌ |
| Pairs/team rankings | PadelFIP | ❌ |
| Auto-refresh scores | FlashScore, SofaScore | ❌ |
| Video content | ESPN, ATP | ❌ |
| Newsletter as product | The Dink | Partial |
| Historical rankings | ATP, PadelFIP | ❌ |
| Head-to-head tool | ATP, SofaScore | ❌ |

### Differentiator Opportunities (Vamos Unique)

| Feature | Status | Potential |
|---------|--------|-----------|
| Business of Padel section | Placeholder | 🔥 High — no competitor covers this |
| English-first padel coverage | Partial | 🔥 High — most padel media is Spanish-first |
| Calendar with all tiers | Exists | Good foundation — add filters, maps, details |
| Clean, modern design | Exists | Build on this — don't lose the aesthetic |

---

## 4. Proposed Sitemap / Information Architecture

```
VAMOS.NET
├── / (Homepage)
│   ├── Live Tournament Banner
│   ├── Hero News Story
│   ├── Live Scores Widget
│   ├── Latest News Grid
│   ├── Rankings Snapshot
│   ├── Upcoming Tournaments
│   ├── Newsletter CTA
│   └── Trending / Popular
│
├── /scores (Live Scores & Results)
│   ├── Date Picker (nav by day)
│   ├── Live Matches (auto-grouped, auto-refresh)
│   ├── Upcoming Today
│   ├── Completed (grouped by round)
│   ├── Filters: Men / Women / All
│   ├── Tournament selector
│   └── Match Detail (expandable)
│       ├── Score Summary
│       ├── Statistics
│       └── H2H
│
├── /rankings
│   ├── /rankings/men (default)
│   ├── /rankings/women
│   ├── /rankings/pairs (NEW)
│   ├── /rankings/race (NEW — season race)
│   ├── Search + Country Filter
│   ├── Date selector (historical)
│   └── Each row links to Player Profile
│
├── /players (NEW)
│   ├── Player directory (A-Z, search, filter by country)
│   └── /players/:slug (Player Profile)
│       ├── Bio + Photo + Stats
│       ├── Current Partner
│       ├── Ranking History (chart)
│       ├── Recent Results
│       ├── Tournament History
│       └── H2H vs other players
│
├── /calendar (Tournament Calendar)
│   ├── Calendar view (current — enhanced)
│   ├── Filters: Major / P1 / P2 / All
│   ├── Map view toggle (NEW)
│   └── /calendar/:tournament (Tournament Detail — NEW)
│       ├── Overview + Venue
│       ├── Draws (Men + Women)
│       ├── Results
│       ├── Players
│       └── Past editions
│
├── /news
│   ├── Featured / Hero story
│   ├── Category filters: Tour / Rankings / Business / Coaching / Opinion
│   ├── /news/:slug (Article page)
│   ├── "Most Popular" sidebar
│   └── Pagination / Infinite scroll
│
├── /business (Business of Padel — UNIQUE)
│   ├── Market Data + Reports
│   ├── Investment News
│   ├── Sponsorship Tracker
│   ├── Player Earnings
│   └── Court Economics
│
├── /about
│   ├── Mission
│   ├── Team
│   ├── Contact
│   └── Press / Media Kit
│
└── Footer
    ├── Sections: Scores, Rankings, Calendar, News, Players
    ├── Company: About, Contact, Privacy, Terms
    ├── Follow: Social links
    └── Newsletter signup
```

---

## 5. Homepage Layout Recommendations

### Section-by-Section, Top to Bottom

#### 5.1 Sticky Header
- Logo (left), inline nav links (Scores, Rankings, Calendar, News, Players), search icon, live indicator dot (right)
- **Reference:** ATP Tour's persistent top nav. Never hide primary navigation behind a hamburger on desktop.

#### 5.2 Live Tournament Banner (Keep, Enhance)
- Full-width, colored by tournament tier
- Add: **current round**, **live match count**, **countdown to next match**
- If no live tournament: Show **next upcoming** tournament with countdown timer
- **Reference:** ATP's live tournament context bar

#### 5.3 Hero Content Section (NEW)
- **Large featured story** (60% width) + **2 smaller story cards** (40% width, stacked)
- All with **images**, category badges, bylines, dates
- This replaces the current empty space and gives the homepage editorial authority
- **Reference:** The Dink's hero carousel + ESPN's hero layout

#### 5.4 Live Scores Widget (NEW)
- Horizontally scrollable row of **current/recent match cards**
- Each card: Player names, score, status (Live ● / Final / 3:30 PM)
- Click any card → goes to /scores with that match expanded
- Auto-refreshes
- **Reference:** ESPN's embedded scoreboard widgets within content sections

#### 5.5 Latest News Grid (NEW / Moved Up)
- 2×3 grid of article cards with thumbnails, category badges, titles, dates
- "View All News →" link
- **Reference:** The Dink's "Top Stories" 2×2 grid

#### 5.6 Rankings Snapshot (Keep, Enhance)
- Side-by-side Men's Top 5 / Women's Top 5
- Add: **rank movement arrows** (▲▼), **player photos** (already there — good), **"Full Rankings →"** link
- Each player row is clickable → player profile
- **Reference:** ATP's rankings widget, PadelFIP's ranking mini-table

#### 5.7 Upcoming Tournaments (Keep, Enhance)
- Horizontal scroll of next 5 tournament cards
- Each card: Tier badge, city, country flag, dates, countdown ("Starts in 12 days")
- "Full Calendar →" link
- **Reference:** PadelFIP's event carousel

#### 5.8 "Business of Padel" Teaser (NEW)
- Feature 1-2 business articles/data points
- "The sport grew 35% in 2025" stat + link to full Business section
- This differentiates Vamos from every other padel site
- **Reference:** ESPN's contextual sections

#### 5.9 Newsletter CTA (Keep, Enhance)
- Full-width section
- Add: **subscriber count** ("Join 12,000+ padel fans"), **preview of latest newsletter**, **social proof**
- **Reference:** The Dink's "Join 100k+ subscribers" messaging

#### 5.10 Footer
- Organized in columns: Sections (Scores, Rankings, Calendar, News, Players), Company (About, Contact, Business), Follow Us (social icons with links), Newsletter signup
- **Reference:** The Dink's footer with Shop/Newsletter/Partner sections

---

## 6. Navigation Structure Recommendations

### Desktop Nav

```
[VAMOS Logo]  Scores  Rankings  Calendar  News  Players  [🔍]  [● LIVE]
```

- **Always visible** — never hide behind hamburger on desktop
- **"LIVE" indicator** appears as a pulsing dot when matches are happening, links to /scores
- **Search icon** opens search overlay (search players, tournaments, articles)
- Rankings and Players can have **hover dropdowns:**
  - Rankings → Men / Women / Pairs / Race
  - Players → Directory / Top 10 / Search

### Mobile Nav

```
Header: [☰ Menu]  [VAMOS Logo]  [🔍]  [● LIVE]
Bottom Tab Bar: [Scores] [Rankings] [Calendar] [News] [More]
```

- **Sticky bottom tab bar** with 5 icons (like FlashScore's mobile app)
- "More" opens: Players, Business, About
- Hamburger in header for full menu access
- **Reference:** FlashScore mobile uses bottom tab bar with Scores, Favorites, News, More

### Navigation Priority Order
1. **Scores** (highest engagement potential — real-time, repeat visits)
2. **Rankings** (2nd most visited on all sports sites)
3. **Calendar** (planning/engagement)
4. **News** (content/SEO/authority)
5. **Players** (discovery/profiles)
6. **Business** (secondary — footer or "More" menu)
7. **About** (footer only)

---

## 7. Scores Page UX Improvements

### 7.1 Date Navigation (CRITICAL)
- **Horizontal date picker** at top of page: ◀ Yesterday | Today | Tomorrow ▶ + Calendar icon
- Default view: Today
- **Reference:** FlashScore's date picker is its signature UX pattern. It's above the fold on every page.

### 7.2 Filter Bar
- Below date picker: **[All] [Men] [Women]** toggle buttons
- Tournament selector dropdown (when multiple tournaments run simultaneously)
- **Reference:** FlashScore's sport tabs + SofaScore's tournament filter

### 7.3 Match Grouping
- Group matches by: **Tournament → Round**
- Example:
  ```
  GIJÓN P2 2026 — Round of 16                    [P2 badge]
  ───────────────────────────────────────
  ● LIVE  Tapia / Coello    6  3         Court 1
          TBD               4  2*
  
  15:30   Lebron / Augsburger  vs  TBD
  15:30   Galan / Chingotto    vs  Yanguas / Stupaczuk
  
  GIJÓN P2 2026 — Round of 32 (Completed)
  ───────────────────────────────────────
  ✓ FIN   Lijo / Arce       3  2
          Lamperti / Trabanco 6  6         1h 15m
  ```
- **Reference:** ATP groups by tournament and round. FlashScore groups by league.

### 7.4 Match Row Design
- Live: **Green pulsing dot** + bold team currently serving + set-by-set score grid
- Upcoming: **Time** in local timezone + "vs" between teams
- Completed: **Checkmark** + final score + match duration
- **Score format:** Use proper spacing: `6-4  7-6(4)  6-3` not `647(4)63`
- Add: **Court number** for live matches (if available from data source)
- **Reference:** FlashScore's score formatting, ATP's court assignments

### 7.5 Match Detail (Click to Expand)
- On click, match row expands to show:
  - **Score summary** with set-by-set breakdown
  - **Match duration**
  - **H2H record** between these pairs
  - Link to **player profiles**
  - Link to **tournament page**
- Future enhancement: Add statistics if data is available
- **Reference:** FlashScore's expandable match details, SofaScore's match tabs

### 7.6 Auto-Refresh
- Live scores should auto-update every 30 seconds
- Score changes should **flash/animate** briefly
- **Reference:** FlashScore updates every few seconds with score flash animations

### 7.7 Empty States
- When no matches today: Show "No matches scheduled today. Next match: [date] at [tournament]"
- Don't show empty tabs — only show relevant content

---

## 8. Rankings Page UX Improvements

### 8.1 Tab Structure
```
[Men]  [Women]  [Pairs ★NEW]  [Race ★NEW]
```
- **Pairs ranking** is essential — padel is a doubles sport. Show pair name, combined ranking, recent results.
- **Race ranking** (season points only) — PadelFIP has this, Vamos should too.
- **Reference:** PadelFIP's ranking categories, ATP's Race to Turin

### 8.2 Table Enhancements

Current columns: Rank, Player Photo, Name, Country, Points  
**Proposed columns:** Rank, Movement, Player Photo, Name, Country, Partner, Points, Tournaments, Trend

| # | ▲▼ | 📷 | Player | 🏳️ | Partner | Points | Tourn. | Trend |
|---|----|----|--------|-----|---------|--------|--------|-------|
| 1 | — | 📷 | Arturo Coello | 🇪🇸 | A. Tapia | 19,800 | 8 | ━━━━ |
| 2 | ▲2 | 📷 | Agustin Tapia | 🇦🇷 | A. Coello | 19,800 | 8 | ━━━━ |
| 3 | ▼1 | 📷 | Federico Chingotto | 🇦🇷 | A. Galan | 17,740 | 8 | ╲━━ |

- **Movement indicator:** ▲ green (up), ▼ red (down), — gray (no change), with number of positions
- **Partner column:** Shows current playing partner (unique to padel — no other sport does this)
- **Tournaments played:** Context for the points total
- **Trend sparkline:** Mini chart showing last 3 months ranking trajectory
- **Reference:** ATP's movement arrows + tournaments played column

### 8.3 Search & Filter
- **Search bar** at top: "Search players..."
- **Country filter** dropdown
- **Ranking range** filter (Top 10 / Top 50 / Top 100 / All)
- **Reference:** ATP's ranking search + filter

### 8.4 Interactivity
- **Click any row** → opens player profile page
- **Sort by column** (click column headers)
- **"Updated: March 2, 2026"** timestamp at the top
- **"How rankings work"** explainer link → points breakdown page
- **Reference:** ATP's clickable ranking rows, PadelFIP's "System & Points Breakdown" link

### 8.5 Historical Rankings
- **Date selector** to view past rankings
- "Compare to: 1 month ago / 3 months ago / 1 year ago"
- **Reference:** ATP's historical ranking lookup, PadelFIP's Ranking History

---

## 9. News/Content Strategy Layout

### 9.1 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  HERO STORY (full-width image, title, byline, tag)  │
├──────────────────────┬──────────────────────────────┤
│                      │  TRENDING / MOST READ        │
│  NEWS GRID           │  1. Article title...         │
│  [Card] [Card]       │  2. Article title...         │
│  [Card] [Card]       │  3. Article title...         │
│  [Card] [Card]       │  4. Article title...         │
│                      │  5. Article title...         │
├──────────────────────┴──────────────────────────────┤
│  CATEGORY FILTERS: [All] [Tour] [Rankings]          │
│  [Business] [Coaching] [Opinion]                     │
├─────────────────────────────────────────────────────┤
│  ARTICLE LIST (with thumbnails, infinite scroll)     │
└─────────────────────────────────────────────────────┘
```

### 9.2 Article Card Design
Each card should show:
- **Thumbnail image** (required — no text-only cards)
- **Category badge** (Tour News, Rankings, Business, Coaching, Opinion)
- **Title** (bold, 2-3 lines max)
- **Byline** (author name + photo)
- **Date** (relative: "2 hours ago" for recent, "Feb 15" for older)
- **Reading time** ("3 min read")
- **Reference:** The Dink's article cards with category badges + The Athletic's author-forward design

### 9.3 Content Categories
1. **Tour News** — Match results, tournament coverage, tour announcements
2. **Player Profiles** — In-depth player features, interviews
3. **Rankings Analysis** — Weekly ranking movers, pair analysis
4. **Business of Padel** — Market data, investments, sponsorships (UNIQUE to Vamos)
5. **Coaching / Tips** — Playing advice (drives recreational player traffic)
6. **Opinion** — Hot takes, predictions, columns

### 9.4 Content Frequency Recommendations
- **Daily:** Tour news/results during tournament weeks
- **2-3x/week:** Rankings analysis, player features
- **Weekly:** Business of Padel roundup, coaching tips
- **Reference:** The Dink publishes 3-5 articles per day

### 9.5 Newsletter Integration
- **Embed latest newsletter** on homepage (like The Dink)
- Show newsletter archives on /news
- Newsletter should be its own product with distinct branding
- **Reference:** The Dink's newsletter feed carousel on homepage

---

## 10. Mobile-Specific Recommendations

### 10.1 Bottom Tab Bar (CRITICAL)
```
[🏆 Scores]  [📊 Rankings]  [📅 Calendar]  [📰 News]  [⋯ More]
```
- **Sticky bottom navigation** — the industry standard for sports apps
- Active tab highlighted with accent color
- Badge on Scores tab when live matches are happening
- **Reference:** FlashScore app, SofaScore app, ESPN app — ALL use bottom tab bars

### 10.2 Sticky Header
- Compact header: Logo + search + live indicator
- Header **collapses on scroll down**, **reappears on scroll up**
- **Reference:** The Athletic's collapsing header

### 10.3 Scores Page (Mobile)
- **Full-width match cards** — one match per row
- **Swipe between dates** (left = yesterday, right = tomorrow)
- **Pull to refresh** for live score updates
- **Reference:** FlashScore's mobile score swipe UX

### 10.4 Rankings Page (Mobile)
- **Sticky tabs** (Men/Women) that stay at top when scrolling
- **Simplified table:** Show only Rank, Flag, Name, Points (Partner on expansion)
- **Tap row to expand** → shows partner, movement, recent results
- **Reference:** SofaScore's mobile player list with expandable rows

### 10.5 Content Pages (Mobile)
- **Card-based layout** — full-width cards with image, title, category, date
- **Infinite scroll** instead of pagination
- **Swipe gestures** for navigating between categories
- **Reference:** The Athletic's mobile content cards

### 10.6 Touch Targets
- Minimum touch target size: **44×44px** (Apple HIG)
- Generous spacing between interactive elements
- All tab bars and filter buttons should be easy to tap

---

## 11. Quick Wins vs Bigger Redesigns

### 🟢 Quick Wins (1-2 weeks each)

| # | Change | Impact | Effort | Reference |
|---|--------|--------|--------|-----------|
| 1 | **Show top nav on desktop** (Scores, Rankings, Calendar, News) | 🔥🔥🔥 | Low | Every competitor |
| 2 | **Add rank movement arrows** (▲▼) to rankings table | 🔥🔥 | Low | ATP Tour |
| 3 | **Add date picker** to scores page | 🔥🔥🔥 | Low | FlashScore |
| 4 | **Group scores by round** with visual separators | 🔥🔥🔥 | Low | FlashScore, ATP |
| 5 | **Add images to news cards** | 🔥🔥 | Low | The Dink |
| 6 | **Live match indicator** — green dot in nav + on match rows | 🔥🔥 | Low | FlashScore |
| 7 | **Add gender filter** (Men/Women/All) to scores page | 🔥🔥 | Low | All competitors |
| 8 | **Better score formatting** — "6-4 7-6(4)" not "647(4)" | 🔥🔥 | Low | ATP |
| 9 | **Add "Partner" column** to rankings | 🔥🔥 | Low | Unique to padel |
| 10 | **Rankings update timestamp** | 🔥 | Very Low | ATP |
| 11 | **Add tournament tier filters** to calendar page | 🔥 | Low | PadelFIP |
| 12 | **News hero story** — make the first article larger | 🔥 | Low | The Dink, ESPN |
| 13 | **Add subscriber count** to newsletter CTA | 🔥 | Very Low | The Dink |
| 14 | **Move Business/About to footer**, make Players a primary nav item | 🔥🔥 | Very Low | All competitors |

### 🟡 Medium Efforts (2-6 weeks each)

| # | Change | Impact | Effort | Reference |
|---|--------|--------|--------|-----------|
| 15 | **Player profile pages** with bio, stats, partner, results | 🔥🔥🔥 | Medium | ATP, SofaScore |
| 16 | **Match detail expansion** on click | 🔥🔥🔥 | Medium | FlashScore, SofaScore |
| 17 | **Auto-refresh** for live scores | 🔥🔥🔥 | Medium | FlashScore |
| 18 | **Search functionality** (players, tournaments, articles) | 🔥🔥🔥 | Medium | All competitors |
| 19 | **Mobile bottom tab bar** | 🔥🔥🔥 | Medium | FlashScore, SofaScore |
| 20 | **Tournament detail pages** with draws, results, info | 🔥🔥 | Medium | ATP, PadelFIP |
| 21 | **Pairs ranking** page | 🔥🔥 | Medium | PadelFIP |
| 22 | **News category filters** with active category highlighting | 🔥🔥 | Medium | The Dink |
| 23 | **Homepage redesign** with hero + news + live widget | 🔥🔥🔥 | Medium | ESPN, The Dink |
| 24 | **Add news to homepage** (at least top 4-6 articles) | 🔥🔥🔥 | Low-Medium | The Dink |

### 🔴 Bigger Redesigns (1-3 months each)

| # | Change | Impact | Effort | Reference |
|---|--------|--------|--------|-----------|
| 25 | **Favorites/follow system** (follow players, pairs, tournaments) | 🔥🔥🔥 | High | FlashScore, SofaScore |
| 26 | **H2H comparison tool** | 🔥🔥 | High | ATP, SofaScore |
| 27 | **Push notifications** for live scores | 🔥🔥🔥 | High | FlashScore |
| 28 | **Historical ranking data** with date selector | 🔥🔥 | High | ATP |
| 29 | **Video content integration** | 🔥🔥 | High | ESPN, ATP |
| 30 | **Business of Padel** as a full content vertical | 🔥🔥 | High | Unique to Vamos |
| 31 | **Calendar map view** | 🔥 | Medium-High | Unique opportunity |
| 32 | **Player rating system** (Vamos Ratings, like SofaScore's) | 🔥🔥🔥 | Very High | SofaScore |
| 33 | **Fantasy padel** integration | 🔥🔥 | Very High | ESPN Fantasy |
| 34 | **Newsletter as product** (embedded feed, archives, distinct brand) | 🔥🔥 | Medium-High | The Dink |

---

## Recommended Implementation Order

### Phase 1: Foundation (Weeks 1-4)
Items: **1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 24**
> Get the basics right. Show the nav. Fix scores UX. Add news to homepage. These are table-stakes improvements that every competitor already has.

### Phase 2: Core Features (Weeks 5-10)
Items: **15, 16, 17, 18, 19, 23**
> Build the features that create stickiness. Player profiles give people a reason to explore. Auto-refresh and match details create repeat visits. Search makes the site usable. Mobile bottom nav is essential for the 70%+ mobile audience.

### Phase 3: Differentiation (Weeks 11-18)
Items: **20, 21, 22, 25, 30, 34**
> Build what makes Vamos unique. Tournament detail pages, pairs rankings, and Business of Padel content are things no competitor does well. The favorites system creates personal investment.

### Phase 4: Advanced (Months 5+)
Items: **26, 27, 28, 29, 31, 32, 33**
> The aspirational features. H2H tools, push notifications, video, proprietary ratings. These transform Vamos from a good site into the definitive padel platform.

---

## Key Design Principles

1. **Data density > White space** on data pages (Scores, Rankings). FlashScore proves users want MORE information per screen, not less. Save the breathing room for editorial pages.

2. **The homepage is a dashboard, not a landing page.** It should answer: "What's happening in padel right now?" — not just say "Welcome to Vamos."

3. **Every data point should be interactive.** Player names link to profiles. Tournament names link to tournament pages. Scores expand to match details. Nothing should be a dead end.

4. **Live content is king.** When matches are happening, the entire site should communicate that. Pulsing dots, live badges, auto-refresh, prominent scores.

5. **Padel is a pairs sport — design for pairs.** Rankings should show partners. Match displays should treat the pair as a unit. H2H should be pair vs pair. This is the biggest structural difference from tennis that most padel sites ignore.

6. **Business of Padel is your moat.** No other padel media site covers the business side comprehensively. Invest in this content vertical — it attracts a different (and more valuable) audience than pure sports fans.

7. **Newsletter-first content strategy.** The Dink built a 100k+ subscriber newsletter that IS the brand. Vamos should follow this playbook. The newsletter drives daily engagement; the website is the permanent home.

---

*Report compiled from direct analysis of thedinkpickleball.com, atptour.com, flashscore.com, sofascore.com, espn.com, theathletic.com (nytimes.com/athletic), padelfip.com, premierpadel.com, padelalto.com, and vamos-net.vercel.app. Screenshots captured March 3, 2026.*
