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

---
*Batch these up and send to Ferran when we have a few more, or at end of tournament week.*
