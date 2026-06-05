/**
 * tour-date.ts — Single source of truth for "today" on the Premier Padel tour.
 *
 * Why this exists:
 *   `new Date().toISOString().split("T")[0]` computes UTC date. Vercel runs in
 *   UTC, so after ~01:00 CET the page's notion of "today" is still UTC's
 *   "yesterday" — and live scores fetch the wrong day's matches.
 *
 * Premier Padel is a European tour. We anchor "today" to Europe/Madrid (the
 * tour's nominal home TZ — Premier Padel HQ + most Spanish tournaments).
 * FIP Tour events that travel further (Asia/Americas) are still close enough
 * for this to be the right default; per-event TZ overrides would be a
 * follow-up if it becomes a problem.
 */

const TOUR_TZ = "Europe/Madrid";

/**
 * Today's date in the tour timezone, formatted as YYYY-MM-DD.
 * Use this instead of new Date().toISOString().split("T")[0] for any
 * date that gets compared against PadelAPI match dates.
 */
export function getTourToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TOUR_TZ }).format(now);
}
