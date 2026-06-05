/**
 * seasons.ts — Single source of truth for "the current tour seasons".
 *
 * Why this exists:
 *   Six pages had hardcoded season IDs (5 = Premier Padel 2026, 6 = Cupra
 *   FIP Tour 2026). When the tour rolls to 2027 every tournament list and
 *   filter goes silently empty with no error — a slow-fuse outage we'd
 *   only notice from analytics.
 *
 * Verified status values (PadelAPI /seasons, 2026-06-05):
 *   "active"   — running this calendar year (we want these)
 *   "finished" — past seasons
 *
 * If the API ever adds intermediate states (pending / upcoming) we'll see
 * them in console.warn from normalize-match and can extend this filter.
 */

import { getSeasons } from "./padel-api";

/**
 * Resolve the IDs of the currently-running tour seasons.
 * Cached at the API layer (1h TTL via getSeasons) so this is cheap to call
 * from any server component.
 */
export async function getActiveSeasonIds(): Promise<number[]> {
  try {
    const { data } = await getSeasons();
    const ids = data
      .filter((s) => s.status === "active")
      .map((s) => s.id);
    if (ids.length === 0) {
      console.warn("[seasons] No active seasons returned — falling back to last-known IDs [5, 6]");
      return [5, 6];
    }
    return ids;
  } catch (err) {
    console.warn("[seasons] getSeasons() failed, falling back to last-known IDs [5, 6]:", err);
    return [5, 6];
  }
}

/**
 * Current calendar year, used wherever pages display "2026" as a hardcoded
 * label. Server-rendered so it stays correct without rebuilds.
 */
export function getCurrentYear(now: Date = new Date()): number {
  return now.getUTCFullYear();
}
