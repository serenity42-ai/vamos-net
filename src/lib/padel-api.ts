// PadelAPI.org client — server-side only
// Docs: https://docs.padelapi.org

const BASE_URL = "https://padelapi.org/api";

function headers() {
  const token = process.env.PADEL_API_TOKEN;
  if (!token) throw new Error("PADEL_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Player {
  id: number;
  self: string;
  name: string;
  url: string | null;
  photo_url: string | null;
  category: "men" | "women";
  ranking: number;
  points: number | null;
  height: number | null;
  nationality: string;
  birthplace: string | null;
  birthdate: string | null;
  age: number | null;
  hand: "left" | "right" | null;
  side: "drive" | "backhand" | null;
  links: string | null;
  connections: {
    matches: string;
  };
}

export interface MatchPlayer {
  id: number;
  self: string;
  name: string;
  side: string;
  connections: {
    pair: string;
  };
}

export interface SetScore {
  team_1: string;
  team_2: string;
}

export interface Match {
  id: number;
  self: string;
  name: string | null;
  url: string | null;
  category: "men" | "women";
  round: number;
  round_name: string;
  index: number;
  played_at: string;
  schedule_label: string | null;
  court: string | null;
  court_order: number | null;
  status: "finished" | "scheduled" | "live" | "cancelled" | "bye";
  score: SetScore[] | null;
  winner: "team_1" | "team_2" | null;
  started_time: string | null;
  duration: string | null;
  players: {
    team_1: MatchPlayer[];
    team_2: MatchPlayer[];
  };
  connections: {
    tournament: string;
    headtohead: string;
    stats: string;
    live: string;
    video?: string;
    prev?: string;
  };
}

export interface Tournament {
  id: number;
  self: string;
  name: string;
  url: string | null;
  location: string;
  country: string;
  level: string;
  status: "finished" | "live" | "pending";
  start_date: string;
  end_date: string;
  links: string | null;
  connections: {
    season: string;
    matches: string;
    news: string;
    videos?: string;
  };
}

export interface Season {
  id: number;
  self: string;
  name: string;
  url: string | null;
  tournaments_count: number;
  status: string;
  start_date: string;
  end_date: string;
  year: number;
  connections: {
    tournaments: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface SimulationResult {
  name: string;
  probability: {
    team_1: number;
    team_2: number;
  };
  players: {
    team_1: Player[];
    team_2: Player[];
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function get<T>(
  path: string,
  params?: Record<string, string>,
  revalidate = 900
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  // Retry on 429 (rate limit) and 5xx with exponential backoff.
  // PadelAPI Pro tier = 60 req/min; burst during SSR can trip this.
  const maxAttempts = 4;
  let lastErr: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(url.toString(), {
      headers: headers(),
      next: { revalidate },
    });

    if (res.ok) return res.json();

    const isRateLimit = res.status === 429;
    const isServerError = res.status >= 500 && res.status < 600;

    if ((isRateLimit || isServerError) && attempt < maxAttempts - 1) {
      // Honor Retry-After if present, else exponential: 1s, 2s, 4s
      const retryAfter = res.headers.get("retry-after");
      const delayMs = retryAfter
        ? Math.min(parseInt(retryAfter) * 1000, 10000)
        : Math.min(1000 * Math.pow(2, attempt), 8000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      lastErr = new Error(`PadelAPI ${res.status}: ${res.statusText} — ${url.pathname}`);
      continue;
    }

    throw new Error(`PadelAPI ${res.status}: ${res.statusText} — ${url.pathname}`);
  }

  throw lastErr ?? new Error(`PadelAPI failed after ${maxAttempts} attempts — ${url.pathname}`);
}

async function post<T>(
  path: string,
  body: Record<string, unknown>,
  revalidate = 60
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`PadelAPI POST ${res.status}: ${res.statusText} — ${path}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Players
// ---------------------------------------------------------------------------

export async function getPlayers(params?: {
  category?: "men" | "women";
  name?: string;
  nationality?: string;
  sort_by?: string;
  order_by?: "asc" | "desc";
  per_page?: string;
  page?: string;
}): Promise<PaginatedResponse<Player>> {
  return get("/players", params as Record<string, string>, 900);
}

export async function getPlayer(id: number): Promise<Player> {
  return get(`/players/${id}`, undefined, 900);
}

export async function getPlayerMatches(
  playerId: number,
  params?: {
    per_page?: string;
    sort_by?: string;
    order_by?: string;
  }
): Promise<PaginatedResponse<Match>> {
  return get(`/players/${playerId}/matches`, params as Record<string, string>, 900);
}

// ---------------------------------------------------------------------------
// Matches
// ---------------------------------------------------------------------------

export async function getMatches(params?: {
  after_date?: string;
  before_date?: string;
  round?: string;
  category?: "men" | "women";
  sort_by?: string;
  order_by?: "asc" | "desc";
  per_page?: string;
  page?: string;
}): Promise<PaginatedResponse<Match>> {
  return get("/matches", params as Record<string, string>, 300);
}

export async function getMatch(id: number): Promise<Match> {
  return get(`/matches/${id}`, undefined, 300);
}

export interface LiveSet {
  set_number: number;
  set_score: string;
  games: {
    game_number: number;
    game_score: string;
    points: string[];
  }[];
}

export interface LiveMatchData {
  id: number;
  self: string;
  status: string;
  channel: string;
  sets: LiveSet[];
  connections?: {
    match?: string;
  };
}

export async function getMatchLive(id: number): Promise<LiveMatchData> {
  return get(`/matches/${id}/live`, undefined, 15);
}

export async function getLiveMatches(): Promise<PaginatedResponse<LiveMatchData>> {
  return get("/live", undefined, 15);
}

/**
 * Normalize a tiebreak score like "65" → "6(5)" or "713" → "7(13)".
 * /live endpoint returns "65" format, /matches returns "6(5)" format.
 * If score > 9 and starts with 6 or 7, it's a tiebreak: first digit is the game score.
 */
function normalizeTiebreak(score: string): string {
  if (!score) return score;
  const num = parseInt(score);
  // Normal game scores are 0-7. If it's > 9 and not already formatted, it's a tiebreak.
  if (num > 9 && !score.includes("(")) {
    // First digit is game score (6 or 7), rest is tiebreak points
    return `${score[0]}(${score.slice(1)})`;
  }
  return score;
}

/**
 * Convert live set data to SetScore array for display.
 * For completed sets, uses set_score. For in-progress sets, uses last game's cumulative score.
 */
export function liveDataToScore(liveData: LiveMatchData): SetScore[] {
  if (!liveData.sets || !Array.isArray(liveData.sets)) return [];
  return liveData.sets.map((set) => {
    if (set.set_score) {
      const [t1, t2] = set.set_score.split("-");
      return { team_1: normalizeTiebreak(t1), team_2: normalizeTiebreak(t2) };
    }
    // In-progress set: use the last game's cumulative game_score
    if (set.games && set.games.length > 0) {
      const lastGame = set.games[set.games.length - 1];
      // Handle both "5 - 3" and "5-3" formats
      const parts = lastGame.game_score.split(/\s*-\s*/);
      return { team_1: parts[0] || "0", team_2: parts[1] || "0" };
    }
    return { team_1: "0", team_2: "0" };
  });
}

// ---------------------------------------------------------------------------
// Tournaments
// ---------------------------------------------------------------------------

export async function getTournaments(params?: {
  name?: string;
  location?: string;
  country?: string;
  level?: string;
  sort_by?: string;
  order_by?: string;
  per_page?: string;
  page?: string;
}): Promise<PaginatedResponse<Tournament>> {
  return get("/tournaments", params as Record<string, string>, 900);
}

export async function getTournament(id: number): Promise<Tournament> {
  return get(`/tournaments/${id}`, undefined, 900);
}

export async function getTournamentMatches(
  tournamentId: number,
  params?: {
    category?: string;
    round?: string;
    sort_by?: string;
    order_by?: string;
    per_page?: string;
  }
): Promise<PaginatedResponse<Match>> {
  return get(
    `/tournaments/${tournamentId}/matches`,
    params as Record<string, string>,
    60
  );
}

// ---------------------------------------------------------------------------
// Seasons
// ---------------------------------------------------------------------------

export async function getSeasons(): Promise<PaginatedResponse<Season>> {
  return get("/seasons", undefined, 3600);
}

export async function getSeasonTournaments(
  seasonId: number,
  params?: { per_page?: string; page?: string }
): Promise<PaginatedResponse<Tournament>> {
  return get(
    `/seasons/${seasonId}/tournaments`,
    params as Record<string, string>,
    300
  );
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Country code to flag emoji — used server-side only */
export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

/** Format score array to readable string */
export function formatScore(score: SetScore[] | null): string {
  if (!score || score.length === 0) return "";
  return score.map((s) => `${s.team_1}-${s.team_2}`).join(", ");
}

/** Round number to display name */
export function roundName(round: number): string {
  const names: Record<number, string> = {
    1: "Final",
    2: "Semi-Final",
    4: "Quarter-Final",
    8: "Round of 16",
    16: "Round of 32",
    32: "Round of 64",
  };
  return names[round] || `Round ${round}`;
}

/** Level label */
export function levelLabel(level: string): string {
  const labels: Record<string, string> = {
    p1: "Premier 1",
    p2: "Premier 2",
    major: "Major",
    finals: "Finals",
    fip_platinum: "FIP Platinum",
    fip_gold: "FIP Gold",
    fip_silver: "FIP Silver",
    fip_bronze: "FIP Bronze",
    fip_rise: "FIP Rise",
    fip_star: "FIP Star",
  };
  return labels[level] || level.toUpperCase();
}
