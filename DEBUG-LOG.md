# Debug Log — Scores & Rankings Fix (2026-03-02)

## Root Cause

The scores page and homepage both used `getMatches()` (the global `/api/matches` endpoint) with `per_page=50` sorted by `played_at desc`. Since Gijón P2 (tournament 726, March 2-8) has 62+ scheduled matches with later dates, **all 50 results were Gijón scheduled matches**. Riyadh P1 (tournament 725, finished Feb 14) was pushed to page 3+ and never fetched.

## Bugs Found & Fixed

### 1. Scores page — No matches for Riyadh, only Gijón scheduled (CRITICAL)
**File:** `src/app/scores/page.tsx`
**Problem:** Fetched 50 matches from global `/matches` endpoint → all Gijón. When filtering by Riyadh (tournament 725), 0 matches found since none were fetched.
**Fix:** Replaced global `getMatches()` with tournament-specific `getTournamentMatches()`:
- When a tournament filter is selected: fetch that tournament's matches directly via `/tournaments/{id}/matches`
- When "All" is selected: fetch matches from all "live" + "finished" tournaments in parallel
- Increased `per_page` to 100 (Riyadh has 94 matches, Gijón has 62)

### 2. Homepage — "No recent results available" (CRITICAL)
**File:** `src/app/page.tsx`
**Problem:** Same as #1 — fetched 50 global matches (all Gijón scheduled), then filtered for `status === "finished"` → 0 results.
**Fix:** Replaced global `getMatches()` with tournament-specific fetching. Fetches from all "live" + "finished" season tournaments, then filters for finished matches with players.

### 3. Match type missing "bye" status (MINOR)
**File:** `src/lib/padel-api.ts`
**Problem:** API returns matches with `status: "bye"` but TypeScript type only had `"finished" | "scheduled" | "live" | "cancelled"`. This caused a type error when filtering out bye matches.
**Fix:** Added `"bye"` to the Match status union type.

### 4. Bye matches cluttering results (MINOR)
**File:** `src/app/scores/page.tsx`
**Problem:** "bye" status matches have no players and no scores but weren't explicitly filtered out.
**Fix:** Added explicit filter: `m.status !== "bye" && m.status !== "cancelled"`.

## What Was Already Working
- **Rankings page** — Correctly fetches from `/players` with `sort_by=ranking`, photos load from `storage.googleapis.com` (already in `next.config` remote patterns)
- **MatchCard component** — Properly handles null/empty scores, TBD players, all status badges
- **Tournament filter UI** — Shows "live" + "finished" tournaments (Gijón + Riyadh both appear)
- **Mobile responsive layout** — Grid columns adapt correctly

## Verification
- Build passes: `npm run build` ✓
- Riyadh P1: 94 matches with full scores (6-4, 6-2 final etc.) via `/tournaments/725/matches`
- Gijón P2: 62 matches (scheduled, no scores yet) via `/tournaments/726/matches`
- Homepage: Shows recent finished Riyadh results
- Rankings: Real player data with photos from API

## Files Changed
1. `src/app/scores/page.tsx` — Rewrote data fetching to use tournament-specific endpoints
2. `src/app/page.tsx` — Rewrote data fetching to use tournament-specific endpoints
3. `src/lib/padel-api.ts` — Added "bye" to Match status type
