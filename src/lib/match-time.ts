/**
 * match-time.ts — Single source of truth for scheduled match time display.
 *
 * Why this exists:
 *   PadelAPI's `played_at` for scheduled matches is often a date-only string
 *   ("2026-06-05"), not a UTC datetime. `new Date("2026-06-05")` parses to
 *   midnight UTC. Converted to CEST that renders as "02:00" — a fabricated
 *   time that misleads the user about when the match actually starts.
 *
 *   Meanwhile PadelAPI ships a `schedule_label` field that is the source of
 *   truth for when a match starts:
 *     "Not before 2:00 PM"   → soft schedule (depends on prior match)
 *     "Starting at 10:00 AM" → confirmed start
 *     "TBC"                  → no time set
 *     null                   → no schedule data
 *
 *   All times in `schedule_label` are venue-local (the tournament's home TZ).
 *   We render them as-is. No user-TZ conversion — that's what every major
 *   sports site (ATP, ESPN) does, and trying to convert without venue-TZ
 *   metadata leads to more bugs than it solves.
 *
 *   Display rules:
 *     - "Not before 2:00 PM"   → { kind: "not-before", time: "14:00" }
 *     - "Starting at 10:00 AM" → { kind: "starts-at",  time: "10:00" }
 *     - other recognised labels → { kind: "raw", text: <label> }
 *     - null + date-only played_at → { kind: "tbd" }
 *     - null + datetime played_at  → { kind: "starts-at", time: "HH:MM" }
 *     - past / live / finished     → null (caller decides what to render)
 */

import type { Match } from "./padel-api";
import type { DisplayStatus } from "./normalize-match";

export type ScheduledTime =
  | { kind: "not-before"; time: string }
  | { kind: "starts-at"; time: string }
  | { kind: "raw"; text: string }
  | { kind: "tbd" };

/**
 * `played_at` may be a date-only "YYYY-MM-DD" (no time component) or a full
 * ISO datetime. We treat anything without a "T" or ":" past character 10 as
 * date-only and refuse to fabricate a clock from it.
 */
function isDateOnly(iso: string): boolean {
  // "2026-06-05"            → true
  // "2026-06-05T14:00:00Z"  → false
  // "2026-06-05 14:00:00"   → false
  if (iso.length <= 10) return true;
  return !iso.slice(10).match(/[T:\d]/);
}

/**
 * Parse a "2:00 PM" / "10:00 AM" / "14:00" fragment from a schedule label
 * into a 24h "HH:MM" string. Returns null if no time fragment is present.
 */
function extract24hTime(label: string): string | null {
  // 12h format: "2:00 PM", "10:30 am"
  const ampm = label.match(/(\d{1,2}):(\d{2})\s*([AP])\.?M\.?/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = ampm[2];
    const isPm = ampm[3].toUpperCase() === "P";
    if (h === 12) h = isPm ? 12 : 0;
    else if (isPm) h += 12;
    return `${String(h).padStart(2, "0")}:${m}`;
  }
  // 24h format: "14:00", already canonical
  const h24 = label.match(/\b(\d{1,2}):(\d{2})\b/);
  if (h24) {
    const h = parseInt(h24[1], 10);
    if (h >= 0 && h < 24) {
      return `${String(h).padStart(2, "0")}:${h24[2]}`;
    }
  }
  return null;
}

/**
 * Classify a raw schedule_label into our display semantics.
 */
function classifyLabel(label: string): ScheduledTime | null {
  const trimmed = label.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();

  // "Not before 2:00 PM", "Not Before 14:00", "NB 2pm"
  if (/^not\s+before\b/i.test(trimmed) || lower.startsWith("nb ")) {
    const time = extract24hTime(trimmed);
    if (time) return { kind: "not-before", time };
    return { kind: "raw", text: trimmed };
  }

  // "Starting at 10:00 AM", "Start 14:00"
  if (/^starting\b|^starts?\b|^start at\b/i.test(trimmed)) {
    const time = extract24hTime(trimmed);
    if (time) return { kind: "starts-at", time };
    return { kind: "raw", text: trimmed };
  }

  // "TBC" / "TBD" / "Schedule pending"
  if (/^tb[cd]$/i.test(trimmed) || lower.includes("pending")) {
    return { kind: "tbd" };
  }

  // Any other label — surface as-is, don't try to outsmart the API.
  return { kind: "raw", text: trimmed };
}

/**
 * Resolve a scheduled time for display. Returns null when the match is
 * live/finished/cancelled (caller renders status, not time) OR when there's
 * truly nothing to show.
 */
export function scheduledMatchTime(
  match: Pick<Match, "played_at" | "schedule_label">,
  displayStatus?: DisplayStatus,
): ScheduledTime | null {
  if (displayStatus && displayStatus !== "scheduled") return null;

  // Priority 1: schedule_label is authoritative
  if (match.schedule_label) {
    const fromLabel = classifyLabel(match.schedule_label);
    if (fromLabel) return fromLabel;
  }

  // Priority 2: played_at with an actual time component
  if (match.played_at && !isDateOnly(match.played_at)) {
    try {
      const d = new Date(match.played_at);
      if (!Number.isNaN(d.getTime())) {
        // Use UTC hours so SSR + client agree and venue/UTC mismatch doesn't
        // resurface here. (We're rendering venue-local elsewhere; without
        // venue TZ metadata, this branch only fires when the API has given
        // us a real timestamp it considers stable.)
        const h = String(d.getUTCHours()).padStart(2, "0");
        const m = String(d.getUTCMinutes()).padStart(2, "0");
        return { kind: "starts-at", time: `${h}:${m}` };
      }
    } catch {
      // fall through
    }
  }

  // Priority 3: date-only played_at — no time data; honest TBD
  if (match.played_at && isDateOnly(match.played_at)) {
    return { kind: "tbd" };
  }

  return null;
}

/**
 * Convenience: format a ScheduledTime into the short string that lives on
 * compact match cards (StatusBadge timeLabel slot). Wider/desktop callers
 * can read the structured form directly to render styling.
 */
export function formatScheduledTimeShort(t: ScheduledTime | null): string | null {
  if (!t) return null;
  switch (t.kind) {
    case "not-before":
      return `NB ${t.time}`;
    case "starts-at":
      return t.time;
    case "raw":
      return t.text;
    case "tbd":
      return "TBD";
  }
}

/**
 * Verbose variant for modal / detail screens where we have horizontal room.
 */
export function formatScheduledTimeLong(t: ScheduledTime | null): string | null {
  if (!t) return null;
  switch (t.kind) {
    case "not-before":
      return `Not before ${t.time}`;
    case "starts-at":
      return `Starts ${t.time}`;
    case "raw":
      return t.text;
    case "tbd":
      return "Schedule pending";
  }
}
