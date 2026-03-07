# Match Status Architecture — Current vs Proposed

## Current State (Flawed)

### Data Flow
```
PadelAPI /matches       → Match.status ("scheduled" | "live" | "finished" | "cancelled" | "bye")
PadelAPI /live          → Live set data (scores, points, game_score)
PadelAPI /matches/{id}/live → Per-match live detail
Pusher WebSocket        → Real-time score events (client-side)
```

### Where Status Gets Modified (THE PROBLEM)
Status is mutated in **5 different places** with **inconsistent logic**:

1. **`scores/page.tsx` (server)** — Stale "live" → "finished" if >4h + no scores
2. **`scores/page.tsx` (server)** — Filter out "scheduled" on past dates
3. **`page.tsx` homepage (server)** — Same stale "live" → "finished" (duplicated!)
4. **`useLiveScore.ts` (client)** — WebSocket can push new status
5. **`MatchModal.tsx` (client)** — Fetches `/api/matches/{id}/live` independently

### Known Bugs from This Architecture
| Bug | Root Cause |
|-----|-----------|
| Scheduled matches showing "FT" | Hook defaulted non-live to "finished" |
| Stale "live" on finished matches | PadelAPI didn't update status |
| "0-0" for completed sets | PadelAPI data quality (can't fix) |
| "1 null" score | PadelAPI data quality (can't fix) |
| Future matches on past dates | PadelAPI pre-creates with wrong date |
| Inconsistent display across pages | Each page has its own status logic |

### Specific Code Smells
- `StatusBadge` component is **copy-pasted 3 times** (scores/page, ClickableMatchRow, MatchCard)
- `displaySurname` is **copy-pasted 3 times** (player-utils, scores/page, MatchModal)
- Stale live detection is **duplicated** in page.tsx and scores/page.tsx
- No central "normalize match" step — every page does its own patching
- No fallback for unknown statuses (walkover, retirement, etc.)

---

## Proposed Architecture

### Principle: Single Source of Truth → Normalize Once → Display Consistently

### 1. Canonical Match Statuses
```typescript
// src/lib/match-status.ts

type MatchDisplayStatus =
  | "live"        // Currently being played
  | "finished"    // Completed with scores
  | "scheduled"   // Upcoming, not started
  | "cancelled"   // Cancelled / withdrawn
  | "walkover"    // W/O result
  | "bye"         // Bye (hidden from display)
  | "unknown";    // Anything else — fallback

// Map any API status string to our canonical set
function normalizeStatus(apiStatus: string): MatchDisplayStatus
```

### 2. Central Match Normalizer
```typescript
// src/lib/normalize-match.ts

interface NormalizeContext {
  now: number;           // Current timestamp
  today: string;         // "YYYY-MM-DD"
  viewDate: string;      // Date being viewed
  liveScoreMap: Map<number, SetScore[]>;  // From /live endpoint
}

function normalizeMatch(match: RawMatch, ctx: NormalizeContext): NormalizedMatch {
  // 1. Merge live scores if available
  // 2. Fix stale "live" → "finished" (>4h, no scores)
  // 3. Fix stale "scheduled" on past dates → hide
  // 4. Normalize status string
  // 5. Validate score array (null guards)
  // ALL logic in ONE place
}

function normalizeMatches(matches: RawMatch[], ctx: NormalizeContext): NormalizedMatch[] {
  return matches.map(m => normalizeMatch(m, ctx)).filter(m => m.visible);
}
```

### 3. Single StatusBadge Component
```typescript
// src/components/StatusBadge.tsx

// ONE component used everywhere — scores page, match cards, match rows, homepage
// Handles: live (red pulse), finished (FT), scheduled (time/Sched.), 
//          cancelled (strikethrough), walkover (W/O), unknown (gray)
```

### 4. Single Player Name Utility
Already have `src/lib/player-utils.ts` — just remove the duplicate copies in scores/page.tsx and MatchModal.tsx. Import from one place.

### 5. Simplified Page Data Flow
```
[PadelAPI] → /matches + /live
     ↓
[normalizeMatches()] ← single function, all status logic
     ↓
[Page Component] ← receives clean, consistent data
     ↓
[StatusBadge] ← single shared component
     ↓
[useLiveScore] ← client-side WebSocket updates (live matches only)
     ↓
[StatusBadge] ← re-renders with WebSocket status
```

### 6. What Changes
| File | Action |
|------|--------|
| `src/lib/match-status.ts` | **NEW** — status normalization + display config |
| `src/lib/normalize-match.ts` | **NEW** — central normalizer |
| `src/components/StatusBadge.tsx` | **NEW** — single shared component |
| `src/app/scores/page.tsx` | **SIMPLIFY** — remove inline status logic, use normalizer |
| `src/app/page.tsx` | **SIMPLIFY** — remove duplicate stale-live logic |
| `src/components/ClickableMatchRow.tsx` | **SIMPLIFY** — remove inline StatusBadge |
| `src/components/MatchCard.tsx` | **SIMPLIFY** — remove inline StatusBadge |
| `src/components/MatchModal.tsx` | **SIMPLIFY** — remove inline displaySurname |
| `src/hooks/useLiveScore.ts` | **KEEP** — but status now inherits from normalizer |
| `src/lib/player-utils.ts` | **KEEP** — already centralized, just remove duplicates |

### 7. Testing
- All 18 existing Playwright tests must pass (no visual changes)
- Add unit tests for `normalizeMatch()` covering:
  - Stale live → finished
  - Scheduled on past date → hidden
  - Normal live/finished/scheduled → pass through
  - Unknown status → fallback
  - Null/empty scores → safe defaults

---

## Implementation Plan (2 sessions)

### Session 1: Foundation (~45 min)
1. Create `match-status.ts` + `normalize-match.ts`
2. Create shared `StatusBadge.tsx`
3. Refactor `scores/page.tsx` to use normalizer
4. Refactor `page.tsx` homepage to use normalizer
5. Run tests

### Session 2: Cleanup (~30 min)
1. Remove duplicate `StatusBadge` from ClickableMatchRow + MatchCard
2. Remove duplicate `displaySurname` from scores/page + MatchModal
3. Clean up MatchModal live fetch to use shared logic
4. Run tests + deploy
