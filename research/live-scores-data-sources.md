# Padel Live Scores & Rankings — Data Sources Research

**Date:** 2026-03-02  
**Status:** Research complete

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Official Sources](#official-sources)
3. [Third-Party APIs](#third-party-apis)
4. [Sports Data Providers](#sports-data-providers)
5. [Aggregator Apps & Sites](#aggregator-apps--sites)
6. [Rankings Data](#rankings-data)
7. [League-by-League Breakdown](#league-by-league-breakdown)
8. [Recommended Architecture](#recommended-architecture)

---

## Executive Summary

Padel live score data is **significantly less mature** than tennis or football. Key findings:

- **No Flashscore/Sofascore coverage** — as of early 2026, neither covers padel at all
- **The official FIP ecosystem is the canonical source** — padelfip.com uses an embedded widget from **matchscorerlive.com** (Live-R) for live scoring
- **One dedicated commercial API exists**: **PadelAPI.org** (by Fantasy Padel Tour) — covers Premier Padel + FIP Tour with REST + WebSocket
- **Sportradar covers padel** with full live data (XML/push feed), but it's enterprise-grade B2B pricing
- **BetsAPI has some padel** under their Tennis category (World Padel Tour, World Padel Championship)
- **A1 Padel cancelled its 2025 calendar** (May 2025) and is effectively defunct
- **Reserve Cup** is a luxury exhibition series — no public data feed

---

## Official Sources

### 1. PadelFIP.com (International Padel Federation)

**URL:** https://www.padelfip.com  
**Coverage:** ALL Premier Padel + ALL Cupra FIP Tour events  
**Live Scores:** Yes — embedded via **matchscorerlive.com** widget (iframe)

- **Live score widget URL pattern:**  
  `https://widget.matchscorerlive.com/screen/resultsbyday/{EVENT-CODE}/{DAY}?t=tol`  
  Example: `https://widget.matchscorerlive.com/screen/resultsbyday/FIP-2025-2111/7?t=tol`
- **Integrated at:** `https://www.padelfip.com/events/{event-slug}/?tab=Results` (livescore tab)
- **Data format:** Widget renders HTML; underlying data likely comes from the Live-R API
- **Rankings page:** `https://www.padelfip.com/ranking-male/` and `https://www.padelfip.com/ranking-female/`
- **Ranking system docs:** `https://www.padelfip.com/ranking-system-points-breakdown/`

**Key insight:** The FIP website is a WordPress site. Rankings are rendered server-side as HTML (no obvious public JSON API). The live scoring is entirely delegated to the matchscorerlive.com platform.

**Access method:** Scraping (rankings) + matchscorerlive.com widget data intercept (live scores)  
**Legal risk:** ⚠️ Moderate — no public API, scraping may violate ToS  
**Reliability:** ★★★★★ — This is THE official source of truth

### 2. PremierPadel.com

**URL:** https://www.premierpadel.com  
**Built by:** Yellow Panther (web agency)  
**Coverage:** Premier Padel tournaments only

- Offers live scores on event pages  
- Rankings link redirects to padelfip.com  
- **No public API discovered**  
- Site is a modern SPA — likely has internal JSON endpoints that could be reverse-engineered via browser DevTools
- Streaming via Red Bull TV

**Access method:** Browser automation / network intercept  
**Legal risk:** ⚠️ Moderate  
**Reliability:** ★★★★☆ — Official but limited coverage (Premier Padel only)

### 3. Live-R / MatchScorerLive.com (Toledo API)

**URL:** https://api-toledo.matchscorerlive.com/  
**What it is:** The **official live scoring infrastructure** used by FIP/Premier Padel  
**API version:** v2.0.3 (February 2025)  
**Status:** PRIVATE API — "Online Documentation" link exists but requires auth

- This is the backend that powers the live score widgets on padelfip.com
- Branded as "Live-R PADEL API — Facade for Padel live score and tournament data over tailored formatted feed"
- The `t=tol` parameter in widget URLs likely stands for "Toledo" (their API codename)
- Documentation URL: `https://api-toledo.matchscorerlive.com/falstaff/docs/index.html`

**Access method:** Private — would need to contact them for API access  
**Legal risk:** 🟢 Low if licensed, 🔴 High if reverse-engineered  
**Reliability:** ★★★★★ — This IS the official scoring system  
**Contact:** Unknown — need to investigate matchscorerlive.com ownership

---

## Third-Party APIs

### 4. PadelAPI.org (Fantasy Padel Tour)

**URL:** https://padelapi.org | **Docs:** https://docs.padelapi.org  
**Creator:** Ferran (ferran@padelapi.org) — built by the Fantasy Padel Tour team  
**Coverage:**

| Level | Score | Stats | Point by Point |
|-------|-------|-------|----------------|
| Major (Premier Padel) | ✅ | ✅ | ✅ |
| P1 | ✅ | ✅ | ✅ |
| P2 | ✅ | ✅ | ✅ |
| Finals | ✅ | ✅ | ✅ |
| FIP Platinum | ✅ | ✅ | ✅ |
| FIP Gold | ✅ | ❌ | ❌ |
| FIP Silver | 🔜 | ❌ | ❌ |
| WPT (2023 historical) | ✅ | ❌ | ❌ |

**Technical details:**
- REST API with JSON responses
- Bearer token authentication
- Pagination (per_page, page params; max 50)
- Rate limit: 60 req/min
- WebSocket access (Pro tier and above) for live data
- MCP server for AI integration (Claude, ChatGPT)
- CSV export available

**Pricing:**
| Plan | Price | Key Features |
|------|-------|-------------|
| Free | €0 | 50K req (10/min), last 6 months, no live |
| Analyst | €19/mo | 50K req, MCP access, API (6 months) |
| Pro | €49/mo | Full history, live + stats + point-by-point, WebSocket |
| Business | €169/mo | 2M req, SLA, custom integrations |

**Access method:** REST API + WebSocket  
**Legal risk:** 🟢 Low — legitimate commercial API  
**Reliability:** ★★★★☆ — Third-party but well-maintained; lower-tier FIP events may be incomplete  
**⭐ RECOMMENDED as primary data source for MVP**

### 5. PadelFirst (RapidAPI)

**URL:** https://rapidapi.com/quiquee/api/padelfirst  
**What it is:** Club management API, NOT pro tour data  
**Coverage:** Irrelevant — for local club/court management  
**Verdict:** ❌ Not useful for our purposes

---

## Sports Data Providers

### 6. Sportradar

**URL:** https://docs.sportradar.com/live-data/introduction/information-per-sport/padel  
**Sport ID:** 71 (Padel)  
**Coverage:** Professional padel — Premier Padel confirmed; likely FIP Tour as well

**Technical details:**
- Full XML push feed (Live Data product)
- Match statuses: NOT_STARTED, FIRST_SET, SECOND_SET, THIRD_SET, ENDED, plus walkovers/retirements
- Events include: betstart, betstop, score_change, match_status, ball_in_play, service_fault, penalty, replay_point
- Coverage from venue (on-site scouts)
- Includes serve tracking, tiebreak status, match time
- Data includes player names (natural + uppercase), team IDs, tournament info

**Sample match data fields:**
```
matchid, t1name, t2name, t1id, t2id, start, betstatus, firstserve,
coveredfrom, matchtime, sportid, score (match/game/set1/set2/set3)
```

**Pricing:** Enterprise B2B — typically $1,000+/month minimum; 30-day free trial available  
**Access method:** XML push feed / REST API  
**Legal risk:** 🟢 Low — fully licensed  
**Reliability:** ★★★★★ — Gold standard for sports data  
**Note:** Primarily serves betting industry; may have restrictions on public display

### 7. BetsAPI

**URL:** https://betsapi.com  
**Coverage:** Padel listed under Tennis category  
- World Padel Championship: https://betsapi.com/l/27936/World-Padel-Championship  
- World Padel Tour Madrid: https://betsapi.com/l/18476/World-Padel-Tour-Madrid

**Technical details:**
- REST API with JSON responses
- Covers pre-match and live odds, scores, results
- Padel coverage appears limited and inconsistently categorized

**Pricing:** Subscription-based, various tiers  
**Access method:** REST API  
**Legal risk:** 🟢 Low  
**Reliability:** ★★☆☆☆ — Padel coverage is sparse and unreliable; better for betting odds than scores  
**Verdict:** Not recommended as primary source; might supplement odds data

---

## Aggregator Apps & Sites

### 8. Padel LiveScore (padel-livescore.com)

**URL:** https://padel-livescore.com  
**Coverage:** Premier Padel + A1 Padel  
**Platform:** iOS app + web  
**Data source:** Unknown — likely scraping FIP/matchscorerlive  
**Access method:** No API — consumer app only  
**Reliability:** ★★★☆☆  
**Verdict:** Competitor, not a data source

### 9. Fantasy Padel Tour Scoreboard

**URL:** https://en.fantasypadeltour.com/marcador  
**Coverage:** Premier Padel 2026  
**Data source:** Their own PadelAPI (same team)  
**Access method:** Use PadelAPI.org instead  
**Reliability:** ★★★★☆

### 10. Flashscore / Sofascore

**Status as of March 2026:** ❌ **Neither covers padel**  
- Flashscore covers tennis extensively but has zero padel sections  
- Sofascore same — no padel category  
- Community frequently asks for this (multiple Reddit threads)  
- Both use Sportradar (among others) for data — the padel gap is likely a business/licensing decision, not a technical one  
- Flashscore is owned by Livesport s.r.o. — uses multiple data providers

**Verdict:** Not available; represents a market gap that Vamos could fill

---

## Rankings Data

### Official FIP Rankings

**URLs:**
- Male: https://www.padelfip.com/ranking-male/
- Female: https://www.padelfip.com/ranking-female/
- Points system: https://www.padelfip.com/ranking-system-points-breakdown/

**Data fields available on the page:**
- Rank (current position)
- Movement (positions up/down, shown as arrows)
- Player name (linked to player profile)
- Nationality (country code: ESP, ARG, BRA, UAE, etc.)
- Points (total FIP ranking points)
- Player profile URL pattern: `https://www.padelfip.com/player/{player-slug}/`

**Ranking rules (2025/2026):**
- Best 22 results from Premier Padel + Cupra FIP Tour count
- Updated after each tournament completes
- Calendar year basis (resets annually)
- Both men's and women's rankings

**Update frequency:** After each tournament — typically weekly during season  

**How to access:**
1. **Scraping** — HTML rendered server-side; could use simple HTTP + HTML parser
2. **PadelAPI.org** — likely mirrors this data (needs verification)
3. **No official JSON endpoint discovered**

**Data freshness:** Rankings page shows date stamp (e.g., "02/03/2026")

### Rankings via PadelAPI.org

The PadelAPI likely exposes ranking data via their REST endpoints. The free tier gives 6 months of data. Needs verification of exact endpoints.

---

## League-by-League Breakdown

### Premier Padel (Top Professional Tour)

| Aspect | Detail |
|--------|--------|
| **Official site** | premierpadel.com |
| **FIP page** | padelfip.com events |
| **Live scoring** | matchscorerlive.com widget via padelfip.com |
| **Best API** | PadelAPI.org (Pro tier) — full scores, stats, point-by-point |
| **Alternative** | Sportradar (enterprise) |
| **Streaming** | Red Bull TV |

### Cupra FIP Tour (Platinum, Gold, Silver, Bronze)

| Aspect | Detail |
|--------|--------|
| **Official site** | padelfip.com |
| **Live scoring** | matchscorerlive.com widget |
| **Best API** | PadelAPI.org — Platinum ✅ full, Gold ✅ scores only, Silver 🔜 |
| **Note** | Lower tiers (Bronze) may have inconsistent/incomplete data |
| **Coverage gap** | FIP Rise — explicitly excluded from PadelAPI; data quality issues at source |

### Reserve Padel Cup

| Aspect | Detail |
|--------|--------|
| **Official site** | reservecup.com |
| **Format** | Exhibition/luxury series — 12 top men, 3 events per year |
| **2026 events** | Miami (Jan 22-24), Marbella (Spain), TBD |
| **Live scoring** | No public feed discovered |
| **API** | ❌ None |
| **Data access** | Would need direct partnership or manual data entry |
| **Note** | Very small event count; could be handled manually |

### A1 Padel

| Aspect | Detail |
|--------|--------|
| **Official site** | a1padelglobal.com (scoreboard page exists) |
| **Status** | ⚠️ **EFFECTIVELY DEFUNCT** — cancelled 2025 calendar in May 2025 |
| **2026** | No confirmed events; preparing "ambitious project" (possibly rebrand) |
| **Live scoring** | Was available on their own scoreboard page |
| **API** | ❌ None |
| **Verdict** | Deprioritize — monitor for potential relaunch |

### Other Notable Tours

| Tour | Status | Coverage |
|------|--------|----------|
| **Major Tour (France)** | Active 2026, 7 events | National circuit; no API |
| **Pro Padel League** | Active (team format) | Limited data |
| **National tours** | Various countries | Fragmented, no centralized API |

---

## Recommended Architecture

### Primary Strategy: PadelAPI.org (Pro tier — €49/mo)

**Why:**
- Only dedicated padel API with live data + WebSocket
- Covers Premier Padel (Major, P1, P2, Finals) and FIP Platinum with full stats
- REST + WebSocket for real-time updates
- Reasonable pricing for MVP
- Free tier available to prototype (6 months historical, no live)
- Active development (public roadmap on GitHub)

**What you get:**
- Live scores via WebSocket
- Match results, stats, point-by-point
- Player data, tournament data
- Historical archive

**Limitations:**
- FIP Gold: scores only (no stats)  
- FIP Silver: coming soon
- FIP Bronze / Rise: not covered
- Reserve Cup: not covered
- No odds/betting data

### Fallback Strategy: Scraping padelfip.com + matchscorerlive.com

**For data PadelAPI doesn't cover:**
1. **Rankings:** Scrape `padelfip.com/ranking-male/` and `/ranking-female/` — simple HTML parsing, refresh after each tournament
2. **Live scores for lower tiers:** Intercept `widget.matchscorerlive.com` data — the URL pattern `FIP-{YEAR}-{ID}` is predictable
3. **Reserve Cup:** Manual entry or scrape if they add live scoring

### Enterprise Option: Sportradar

**When to consider:**
- If Vamos scales to serve betting companies or large media
- When budget allows $1K+/month
- For maximum reliability and SLA guarantees
- 30-day free trial available for evaluation

### Data Flow Recommendation

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  PadelAPI.org   │────▶│  Vamos Backend   │────▶│  Vamos App  │
│  (WebSocket +   │     │  (normalize +    │     │  (frontend) │
│   REST API)     │     │   cache + store)  │     │             │
└─────────────────┘     └──────────────────┘     └─────────────┘
                              ▲
┌─────────────────┐          │
│ padelfip.com    │──scrape──┘  (rankings, lower-tier fallback)
│ matchscorerlive │          
└─────────────────┘          
                              ▲
┌─────────────────┐          │
│ Manual entry    │──────────┘  (Reserve Cup, special events)
└─────────────────┘
```

### Implementation Priority

1. **Week 1:** Sign up for PadelAPI.org free tier → prototype data ingestion
2. **Week 2:** Upgrade to Pro tier → integrate WebSocket for live scores
3. **Week 3:** Build rankings scraper for padelfip.com
4. **Week 4:** Evaluate matchscorerlive.com widget data for FIP Tour gaps
5. **Later:** Contact Live-R/matchscorerlive for potential API partnership; evaluate Sportradar trial

### Legal Considerations

| Source | Legal Status | Risk |
|--------|-------------|------|
| PadelAPI.org | Licensed commercial API | 🟢 Safe |
| Sportradar | Licensed commercial API | 🟢 Safe |
| BetsAPI | Licensed commercial API | 🟢 Safe |
| padelfip.com scraping | No explicit permission; ToS may prohibit | ⚠️ Medium |
| matchscorerlive.com | Private API; reverse engineering risky | 🔴 High |
| premierpadel.com | No API; scraping may violate ToS | ⚠️ Medium |

**Recommendation:** Start with PadelAPI.org (licensed). Only resort to scraping for data gaps (rankings). If scraping is needed long-term, explore partnership with FIP or Live-R.

---

## Key Contacts

| Entity | Contact | Purpose |
|--------|---------|---------|
| PadelAPI.org | ferran@padelapi.org | API partnership/custom plan |
| matchscorerlive.com (Live-R) | Unknown — investigate | Official scoring API access |
| Sportradar | developer.sportradar.com | Enterprise data |
| FIP | padelfip.com | Official data partnership |

---

## Summary Table

| Source | Live Scores | Rankings | Historical | API | Price | Recommended |
|--------|------------|----------|------------|-----|-------|-------------|
| PadelAPI.org | ✅ (Pro) | ❓ | ✅ | REST + WS | €0–169/mo | ⭐ PRIMARY |
| Live-R (matchscorerlive) | ✅ | ❌ | ❌ | Private | Unknown | 🎯 INVESTIGATE |
| padelfip.com | ✅ (widget) | ✅ (HTML) | ✅ (HTML) | None (scrape) | Free | 📋 FALLBACK |
| Sportradar | ✅ | ❌ | ✅ | XML/REST | $1K+/mo | 🏢 ENTERPRISE |
| BetsAPI | ⚠️ Partial | ❌ | ⚠️ Partial | REST | Varies | ❌ NOT REC |
| Flashscore/Sofascore | ❌ | ❌ | ❌ | N/A | N/A | ❌ N/A |
