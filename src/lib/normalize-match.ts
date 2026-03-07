/**
 * normalize-match.ts — Single source of truth for match status and score logic.
 *
 * Every match from PadelAPI goes through normalizeMatches() before rendering.
 * This is the ONE place where we:
 *   1. Merge live scores from /live endpoint
 *   2. Derive correct display status from multiple signals
 *   3. Validate score arrays (null guards, never crash)
 *   4. Decide visibility (hide byes, phantom matches, etc.)
 *
 * Rules:
 *   - Trust the API data as-is (don't rewrite scores)
 *   - Never invent data — if score is null/garbage, show "—"
 *   - Only derive status when API contradicts itself
 *   - Never crash — graceful fallbacks everywhere
 */

import type { Match, SetScore, LiveMatchData } from "./padel-api";
import { liveDataToScore } from "./padel-api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DisplayStatus =
  | "live"
  | "finished"
  | "scheduled"
  | "cancelled"
  | "walkover"
  | "unknown";

export interface NormalizedMatch extends Match {
  /** Derived display status — use this for rendering, not match.status */
  displayStatus: DisplayStatus;
  /** Whether this match should be rendered at all */
  visible: boolean;
}

export interface NormalizeContext {
  /** Current date as YYYY-MM-DD */
  today: string;
  /** The date being viewed (for scores page) — defaults to today */
  viewDate?: string;
  /** Set of match IDs present in the /live endpoint */
  liveMatchIds: Set<number>;
  /** Live score map: matchId → SetScore[] from /live endpoint */
  liveScoreMap: Map<number, SetScore[]>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract match ID from a LiveMatchData's connections.match path */
export function extractMatchId(liveMatch: LiveMatchData): number {
  return parseInt(
    liveMatch.connections?.match?.split("/").pop() || String(liveMatch.id)
  );
}

/** Build a NormalizeContext from raw /live endpoint data */
export function buildContext(
  liveData: LiveMatchData[],
  viewDate?: string
): NormalizeContext {
  const today = new Date().toISOString().split("T")[0];
  const liveMatchIds = new Set<number>();
  const liveScoreMap = new Map<number, SetScore[]>();

  for (const lm of liveData) {
    const id = extractMatchId(lm);
    liveMatchIds.add(id);
    const scores = liveDataToScore(lm);
    if (scores.length > 0) {
      liveScoreMap.set(id, scores);
    }
  }

  return { today, viewDate: viewDate || today, liveMatchIds, liveScoreMap };
}

// ---------------------------------------------------------------------------
// Status derivation — the decision matrix
// ---------------------------------------------------------------------------

/**
 * Normalize an API status string to our canonical set.
 * PadelAPI status is typed as `string` (not enum) — handle anything.
 */
function normalizeApiStatus(status: string): DisplayStatus {
  switch (status) {
    case "live":
      return "live";
    case "finished":
      return "finished";
    case "scheduled":
      return "scheduled";
    case "cancelled":
      return "cancelled";
    case "walkover":
    case "wo":
      return "walkover";
    case "bye":
      return "scheduled"; // byes get hidden via visibility
    default:
      return "unknown";
  }
}

/**
 * Derive the correct display status from multiple signals.
 *
 * Priority:
 *   1. winner exists → finished (always wins, most reliable signal)
 *   2. match is in /live list → live
 *   3. has scores + no winner → live (API didn't update status)
 *   4. API says "live" + no scores + old → finished (stale)
 *   5. else → trust API status
 */
function deriveStatus(
  match: Match,
  ctx: NormalizeContext,
  hasLiveScores: boolean
): DisplayStatus {
  const apiStatus = normalizeApiStatus(match.status);
  const hasScores = match.score && match.score.length > 0;

  // Signal 1: winner is the most reliable indicator
  if (match.winner) {
    return "finished";
  }

  // Signal 2: present in /live endpoint = definitely live
  if (ctx.liveMatchIds.has(match.id)) {
    return "live";
  }

  // Signal 3: has live scores from /live endpoint
  if (hasLiveScores) {
    return "live";
  }

  // Signal 4: API says scheduled but match has scores → it's playing or done
  if (apiStatus === "scheduled" && hasScores) {
    return "live"; // no winner yet, so assume live
  }

  // Signal 5: API says live but no scores and match is old → stale
  if (apiStatus === "live" && !hasScores) {
    const playedAt = match.played_at ? new Date(match.played_at).getTime() : 0;
    const now = Date.now();
    if (playedAt && now - playedAt > 4 * 60 * 60 * 1000) {
      return "finished";
    }
  }

  // Default: trust the API
  return apiStatus;
}

// ---------------------------------------------------------------------------
// Visibility
// ---------------------------------------------------------------------------

function isVisible(match: Match, displayStatus: DisplayStatus, ctx: NormalizeContext): boolean {
  // Always hide byes
  if (match.status === "bye") return false;

  // Hide cancelled matches with no players
  if (displayStatus === "cancelled" &&
      match.players.team_1.length === 0 &&
      match.players.team_2.length === 0) {
    return false;
  }

  // Hide phantom matches: scheduled + no scores + past date
  // PadelAPI pre-creates next-round matches with yesterday's date
  const viewDate = ctx.viewDate || ctx.today;
  const isPastDate = viewDate < ctx.today;
  if (isPastDate &&
      displayStatus === "scheduled" &&
      (!match.score || match.score.length === 0)) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Score merging
// ---------------------------------------------------------------------------

function mergeScore(match: Match, ctx: NormalizeContext): SetScore[] | null {
  // Priority 1: /live endpoint scores (freshest)
  const liveScores = ctx.liveScoreMap.get(match.id);
  if (liveScores && liveScores.length > 0) {
    return liveScores;
  }

  // Priority 2: match.score from /matches endpoint (as-is, don't rewrite)
  if (match.score && match.score.length > 0) {
    return match.score;
  }

  // No scores available
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a single match. Returns a NormalizedMatch with:
 * - displayStatus: derived from multiple signals
 * - score: merged from /live + /matches (best available)
 * - visible: whether to render this match
 */
export function normalizeMatch(match: Match, ctx: NormalizeContext): NormalizedMatch {
  const mergedScore = mergeScore(match, ctx);
  const hasLiveScores = ctx.liveScoreMap.has(match.id);

  // Update the match score before deriving status (so status can see merged scores)
  const enrichedMatch: Match = {
    ...match,
    score: mergedScore,
  };

  const displayStatus = deriveStatus(enrichedMatch, ctx, hasLiveScores);
  const visible = isVisible(match, displayStatus, ctx);

  return {
    ...enrichedMatch,
    displayStatus,
    visible,
  };
}

/**
 * Normalize an array of matches. Filters out invisible matches.
 */
export function normalizeMatches(
  matches: Match[],
  ctx: NormalizeContext
): NormalizedMatch[] {
  return matches
    .map((m) => normalizeMatch(m, ctx))
    .filter((m) => m.visible);
}
