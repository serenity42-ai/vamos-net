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
  revalidate = 300
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const res = await fetch(url.toString(), {
    headers: headers(),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`PadelAPI ${res.status}: ${res.statusText} — ${url.pathname}`);
  }

  return res.json();
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
  return get("/players", params as Record<string, string>, 300);
}

export async function getPlayer(id: number): Promise<Player> {
  return get(`/players/${id}`, undefined, 300);
}

export async function getPlayerMatches(
  playerId: number,
  params?: {
    per_page?: string;
    sort_by?: string;
    order_by?: string;
  }
): Promise<PaginatedResponse<Match>> {
  return get(`/players/${playerId}/matches`, params as Record<string, string>, 60);
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
  return get("/matches", params as Record<string, string>, 60);
}

export async function getMatch(id: number): Promise<Match> {
  return get(`/matches/${id}`, undefined, 60);
}

// ---------------------------------------------------------------------------
// Head to Head (POST)
// ---------------------------------------------------------------------------

export async function getHeadToHead(
  team1: number[],
  team2?: number[]
): Promise<PaginatedResponse<Match>> {
  const body: Record<string, unknown> = { team_1: team1 };
  if (team2 && team2.length > 0) body.team_2 = team2;
  return post("/matches/headtohead", body, 300);
}

// ---------------------------------------------------------------------------
// Simulate (POST)
// ---------------------------------------------------------------------------

export async function simulateMatch(
  team1: number[],
  team2: number[]
): Promise<SimulationResult> {
  return post("/matches/simulate", { team_1: team1, team_2: team2 }, 60);
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
  return get("/tournaments", params as Record<string, string>, 300);
}

export async function getTournament(id: number): Promise<Tournament> {
  return get(`/tournaments/${id}`, undefined, 300);
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
    fip_rise: "FIP Rise",
    fip_star: "FIP Star",
  };
  return labels[level] || level.toUpperCase();
}
