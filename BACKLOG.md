# BACKLOG.md — Vamos.net Site Audit
**Audited:** 2026-03-04 by Winston
**Site:** vamos-net.vercel.app (full site) / vamos.net (coming-soon gate)

---

## P0 — Broken / Embarrassing

- [BUG] **News images missing everywhere.** All news articles and news cards show placeholder broken-image icons instead of actual photos. This is the single most visible quality issue — the News page looks unfinished. Either images were never uploaded, paths are wrong, or the image component has no src.
  - **Pages affected:** /news, /news/[slug], homepage Latest News section
  - **Fix:** Add real article images or at minimum proper placeholder/fallback styling

- [BUG] **Calendar page redirects to /tournaments.** The /calendar route silently redirects to /tournaments — there is no actual calendar view. Either remove Calendar from nav or build a proper calendar.
  - **Pages affected:** Header nav, footer doesn't link it
  - **Fix:** Build a real calendar view (month grid with tournament dates) or remove from nav

- [BUG] **Social media links in footer go nowhere** (X, Instagram, YouTube icons link to `#`). This is embarrassing for a live site.
  - **Pages affected:** Every page (footer)
  - **Fix:** Link to actual social accounts or remove icons

- [BUG] **Scores page: tournament filter shows wrong tournaments.** The filter bar shows "Riyadh Season P1 2026" and "Gijon P2 2026" even when viewing a date where those tournaments had no matches (e.g., Feb 20). Tournament filter should be contextual to the selected date, or show all season tournaments.
  - **Pages affected:** /scores
  - **Fix:** Either make tournament filter dynamic based on date, or show all tournaments always

- [BUG] **Player detail: match cards missing tournament name.** Recent Matches on player profile show "/ Finals" and "/ Semifinals" with no tournament name — just a slash before the round.
  - **Pages affected:** /players/[id]
  - **Fix:** Fetch and display tournament name in match cards

- [BUG] **Player detail: match cards not clickable.** Recent Matches on player profiles are not wired to the match modal — clicking does nothing.
  - **Pages affected:** /players/[id]
  - **Fix:** Make match cards clickable → open modal (same as homepage/scores)

## P1 — Should Fix Soon

- [UX] **Homepage: hero article has no image.** The main featured story "Coello and Tapia Open 2026 Season" is just a dark blue box with text — no photo. Looks like placeholder content.
  - **Pages affected:** / (homepage)
  - **Fix:** Add hero image or redesign hero section to work without images

- [UX] **Homepage: "The Padel Brief" sidebar has no images.** Articles listed in the sidebar show text-only cards with no visual distinction.
  - **Pages affected:** / (homepage)
  - **Fix:** Add thumbnail images or better text-only card design

- [UX] **Rankings: only shows 20 players by default**, then "Show All 34 Players" button. But 34 is still only men's rankings. No pagination for a larger dataset. Women tab shows similar.
  - **Pages affected:** /rankings
  - **Fix:** Add proper pagination or infinite scroll. Show more players by default.

- [UX] **Rankings: player names not linked to profiles.** You can't click a player name in rankings to go to their profile. The only way to reach a player is through /players.
  - **Pages affected:** /rankings
  - **Fix:** Make player names/rows clickable → /players/[id]

- [UX] **Scores page: matches not grouped by round properly.** All Round of 32 matches are in one big list. When there are multiple rounds on the same day (e.g., R32 + R16), they should be visually separated.
  - **Pages affected:** /scores
  - **Fix:** Group by round with clear headers

- [UX] **Tournament detail: draw layout is confusing.** Matches shown as cards in a flat grid — hard to follow the bracket progression. No bracket visualization.
  - **Pages affected:** /tournaments/[id]
  - **Fix:** Consider bracket/tree view, or at minimum clearer round progression

- [UX] **Tournament detail: "TBD" matches everywhere.** Scheduled matches show "TBD" for one team even when players are known in the API. The data might not be populated in the tournament endpoint.
  - **Pages affected:** /tournaments/[id]
  - **Fix:** Cross-reference with global matches endpoint or show "vs" instead of TBD

- [UX] **Scores page: no visual indicator for live matches in the list.** Live matches have a subtle red background but no animated dot or "LIVE" text like the ribbon. Easy to miss.
  - **Pages affected:** /scores
  - **Fix:** Add pulsing red dot + "LIVE" badge consistent with ribbon

- [UX] **Homepage mobile: ticker text too small.** On 375px width, the ribbon ticker text is barely readable. Player names get truncated heavily.
  - **Pages affected:** / (homepage, mobile)
  - **Fix:** Increase font size on mobile or show fewer matches

- [UX] **Subscribe email form (homepage + about) does nothing.** The "Stay in the Game" email input has no backend — form submission doesn't work.
  - **Pages affected:** /, /about
  - **Fix:** Connect to Mailchimp/Buttondown/etc. or remove the form

- [UX] **Business page: category cards not clickable.** "Market Growth", "Court Economics", etc. are static cards with no links — they look like they should filter articles but don't.
  - **Pages affected:** /business
  - **Fix:** Make them filter business articles by category, or link to relevant content

## P2 — Nice to Have

- [UX] **No loading states.** Pages either show content or nothing — no skeleton loaders or spinners during navigation. Fast enough on desktop but noticeable on mobile.
  - **Pages affected:** All
  - **Fix:** Add skeleton loading states for key sections

- [UX] **No breadcrumbs on most pages.** Only news articles have breadcrumbs. Tournament details, player profiles should have them too.
  - **Pages affected:** /tournaments/[id], /players/[id]
  - **Fix:** Add consistent breadcrumb navigation

- [UX] **Players page: only shows men by default.** Women's tab is there but you have to click it — no indicator of how many women players.
  - **Pages affected:** /players
  - **Fix:** Show count on tabs: "Men (34)" / "Women (28)"

- [UX] **Rankings search doesn't work well.** Typing in the search box requires clicking "Search" button — no live filtering or enter key support.
  - **Pages affected:** /rankings
  - **Fix:** Add real-time filtering as you type, or at least Enter key support

- [UX] **Tournaments page is very long** — lists ALL tournaments for the entire 2026 season in one vertical scroll. No month jump navigation or collapsible sections.
  - **Pages affected:** /tournaments
  - **Fix:** Add month anchor links, or collapsible months, or a compact calendar view

- [UX] **Match modal: no link to player profiles.** You can see player names and photos in the modal but can't click to go to their profile.
  - **Pages affected:** Match modal (all entry points)
  - **Fix:** Make player names/photos link to /players/[id]

- [UX] **Match modal: no head-to-head link.** The API provides h2h connections but we don't use them.
  - **Pages affected:** Match modal
  - **Fix:** Add "Head-to-Head" link or section in modal

- [FEATURE] **No search functionality.** No global search for players, tournaments, or articles.
  - **Fix:** Add search to header (at minimum player search)

- [FEATURE] **No dark mode.** Site is light-only.
  - **Fix:** Add dark mode toggle (low priority, design effort)

- [CONTENT] **Only 6 articles total.** News section is thin. Need regular content for SEO and engagement.
  - **Fix:** Content calendar, article pipeline (separate from this audit)

---

## Summary

| Priority | Count | Key Theme |
|----------|-------|-----------|
| P0 | 6 | Missing images, broken links, dead routes |
| P1 | 12 | UX polish, interactivity gaps, data display |
| P2 | 9 | Features, nice-to-haves, content |
| **Total** | **27** | |

## Recommended Work Order
1. Fix all P0s first (1-2 sessions)
2. P1 UX items grouped by page (homepage → scores → rankings → players)
3. P2 as time allows

---
*This backlog is alive. Update as items are completed or new ones discovered.*
