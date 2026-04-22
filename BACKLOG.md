# BACKLOG.md — Vamos.net Site Audit & Work Plan
**Audited:** 2026-03-04 by Winston
**Updated:** 2026-03-04 23:30 (post-crash reconciliation)
**Site:** vamos-net.vercel.app (full site) / vamos.net (coming-soon gate)

---

## P0 — Broken / Embarrassing

- [x] ~~**News images missing everywhere.**~~ ✅ Fixed — real padel photos from Unsplash/Pexels (commits 0ae8f41, eecdb0a)

- [ ] [BUG] **Calendar page redirects to /tournaments.** The /calendar route silently redirects — there is no calendar view. Either remove Calendar from nav or build a proper calendar.
  - **Pages affected:** Header nav
  - **Fix:** Build a real calendar view (month grid with tournament dates) or remove from nav

- [x] ~~**Social media links go to #**~~ ⏸️ Deferred — no social accounts created yet. Remove icons or add accounts when ready.

- [ ] [BUG] **Scores page: tournament filter shows wrong tournaments.** Filter shows "Riyadh Season P1 2026" even when viewing dates where Riyadh had no matches (e.g., Mar 4 — only Gijón is active). Filter should be contextual to selected date.
  - **Pages affected:** /scores
  - **Fix:** Make tournament filter dynamic based on date's actual tournaments

- [ ] [BUG] **Match cards missing tournament name (everywhere).** Recent Matches on player profiles AND homepage "Recent Results" show "/ Finals", "/ Semifinals" — tournament name is missing (just a slash before the round).
  - **Pages affected:** /players/[id], / (homepage Recent Results)
  - **Fix:** Fetch and display tournament name in match cards

- [x] ~~**Player detail: match cards not clickable.**~~ ✅ Fixed — match cards are now buttons that open modal

---

## P1 — Should Fix Soon (Tomorrow's Session)

### 🏠 Homepage Group
1. [ ] [UX] **Hero article has no image.** "Coello and Tapia Open 2026 Season" — dark blue box with text only. Add hero image.
2. [ ] [UX] **"The Padel Brief" sidebar has no images.** Text-only cards, no visual distinction. Add thumbnails or better text-only design.
3. [ ] [UX] **Mobile ticker text too small.** On 375px, ribbon text barely readable, player names truncated. Increase font size or show fewer matches on mobile.
4. [ ] [UX] **Subscribe email form does nothing.** "Stay in the Game" input has no backend. Connect to Mailchimp/Buttondown or remove.

### 📊 Scores Group
5. [ ] [UX] **Matches not grouped by round properly.** All R32 matches in one big list. When multiple rounds on same day, should be visually separated with clear headers.
6. [ ] [UX] **No visual indicator for live matches in the list.** Subtle red background but no animated dot or "LIVE" text like the ribbon. Easy to miss.

### 🏆 Rankings Group
7. [ ] [UX] **Only shows 20 players by default.** "Show All 34 Players" button, but 34 is still limited. Add proper pagination or infinite scroll.
8. [ ] [UX] **Player names not linked to profiles.** Can't click player in rankings → profile. Only way to reach player is /players page.

### 🎾 Tournaments Group
9. [ ] [UX] **Tournament detail draw layout confusing.** Flat grid of match cards — hard to follow bracket progression. Consider bracket/tree view or clearer round progression.
10. [ ] [UX] **"TBD" matches everywhere.** Scheduled matches show "TBD" even when players are known. Cross-reference with global matches endpoint.

### 📰 Business & Content Group
11. [ ] [UX] **Business page category cards not clickable.** "Market Growth", "Court Economics" etc. are static. Make them filter articles or link to content.

---

## P2 — Nice to Have (After P1s)

### UX Polish
1. [ ] [UX] No loading states — no skeletons or spinners during navigation
2. [ ] [UX] No breadcrumbs on tournament detail or player profiles
3. [ ] [UX] Players page: no count on tabs — show "Men (34)" / "Women (28)"
4. [ ] [UX] Rankings search requires clicking "Search" button — add live filtering or Enter key
5. [ ] [UX] Tournaments page very long — add month jump navigation or collapsible sections

### Match Modal
6. [ ] [UX] Match modal: no link to player profiles — can see names but can't click to /players/[id]
7. [ ] [UX] Match modal: no head-to-head data — API provides h2h but we don't use it

### Features
8. [ ] [FEATURE] No global search for players, tournaments, or articles
9. [ ] [FEATURE] No dark mode

### Tech Debt (Brand v2 cleanup)
10. [ ] [DEBT] Remove the `globals.css` legacy-color remap block once every remaining file references CSS variables instead of hex arbitrary values. Grep for `bg-[#0F1F2E]`, `text-[#4ABED9]`, `bg-[#3CB371]`, etc. Migrate each occurrence page-by-page, then delete the matching `!important` rules in globals.css. Final state: no hex colors outside of `:root` in `globals.css`.
11. [ ] [DEBT] `/calendar` page still uses pre-redesign color classes (bg-blue-100, bg-emerald-100, etc). Not in nav so low-risk, but should be editorial-ized before we surface it again.
12. [ ] [DEBT] Dead API exports in `src/lib/padel-api.ts`: `getMatch`, `getTournaments`, `getSeasons`. Prune.

---

## Summary

| Priority | Total | Done | Remaining |
|----------|-------|------|-----------|
| P0 | 6 | 3 (1 deferred) | 2 open |
| P1 | 11 | 0 | 11 |
| P2 | 9 | 0 | 9 |

## Recommended Work Order (Tomorrow)

### Session 1: Finish P0s (~30 min)
- Fix tournament name in match cards (API data enrichment)
- Fix tournament filter to be date-contextual
- Decide: build calendar view or remove from nav

### Session 2: P1 Homepage + Scores (~1-2 hours)
- Hero image for featured article
- Sidebar thumbnails or redesign
- Round grouping on scores page
- Live match indicators

### Session 3: P1 Rankings + Tournaments (~1 hour)
- Rankings → player profile links
- Pagination / show more
- Tournament draw improvements

### Session 4: P1 Remaining + P2 cherry picks
- Subscribe form (connect or remove)
- Business category filters
- Loading states (quick win)
- Match modal → player links

---

## Autoresearch Experiments (Karpathy Pattern)
*Added: 2026-03-10 | Start: 2026-03-11*

Autonomous agent loop: modify → test → measure → keep/discard → repeat overnight.

- [ ] **Vamos SEO headline optimizer** — Loop agent over existing article titles + metas, score by SEO metrics (keyword density, CTR prediction, readability), keep winners. Start with our 18 existing articles.
- [ ] **Polymarket strategy backtester** — Agent tweaks entry/exit parameters, backtests against historical Polymarket data, ranks strategies by simulated P&L.

Pattern: `agent + sandbox + one metric + autonomous loop = 100 experiments overnight`
Ref: github.com/karpathy/autoresearch

---
*Backlog is alive. Check off items as completed. Last verified against live site: 2026-03-04 23:30.*
