# PadelAPI Bug Reports (pending)
Report to: ferran@padelapi.org

## 1. Stale "live" status — Match 7284
**Date:** 2026-03-05
**Match:** Goñi/Goenaga vs Chingotto/Galán (Gijón P2, Round of 16, Men)
**Issue:** Match finished ~14:30 CET but API still returns `status: "live"` with `score: []` and `winner: null` at 17:30+ CET (3+ hours after completion).
**Endpoint:** `GET /api/matches/7284`
**Impact:** Our site showed a false LIVE badge with no scores. We added a client-side workaround (downgrade stale live matches >4h old with no scores).

## 2. "1 null" live score — Match (Navarro/Guerrero vs Alonso/Tello)
**Date:** 2026-03-04
**Issue:** Score reference showed "1 null" during live match, only populated after match ended.
**Status:** Ferran acknowledged as bug (email 2026-03-05), said they'll fix.

## 3. Null sets in /live endpoint — Match 7281
**Date:** 2026-03-05
**Issue:** `GET /api/live` returned `sets: null` for match 7281 (instead of empty array or actual data). Caused server-side crash on our scores page.
**Impact:** Fixed with null guard on our side.

## 4. Completed set shows "0-0" score — Match 7277
**Date:** 2026-03-05
**Match:** Coello/Tapia vs Lijo/Arce (Gijón P2, Round of 16, Men)
**Issue:** `/api/live` returns Set 1 with `set_score: "0-0"` even though it's a completed set (9 games played in the data). Correct score should be something like 6-3 or similar.
**Endpoint:** `GET /api/live` → match 7277
**Impact:** Modal shows "0 2 / 0 2" instead of correct set scores.

## 5. "1 null" score AGAIN — Match 7287 (Lebron/Augsburger vs Nieto/Sanz)
**Date:** 2026-03-06
**Match:** Lebron/Augsburger vs Nieto/Sanz (Gijón P2, Quarter, Men)
**Issue:** Same "1 null" bug from match #2 above. Score field shows `1 null` on PadelAPI's own dashboard (padelapi.org/explore/resources/match-games/7287). Live endpoint returns set_score: "0-0" for completed sets.
**Note:** This was supposed to be fixed per Ferran's email on March 5. Still happening next day on a CENTER COURT quarterfinal.

---
*Batch these up and send to Ferran when we have a few more, or at end of tournament week.*
