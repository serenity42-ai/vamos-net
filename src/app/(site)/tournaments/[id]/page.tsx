import Link from "next/link";
import { notFound } from "next/navigation";
import TournamentBanner from "@/components/v3/TournamentBanner";
import BestPlayersStrip, { type BestPlayer } from "@/components/v3/BestPlayersStrip";
import TournamentDetailTabs from "@/components/v3/TournamentDetailTabs";
import type { FilterOption } from "@/components/v3/TournamentMatchFilters";
import {
  getTournament,
  getAllTournamentMatches,
  getLiveMatches,
  getPlayer,
  levelLabel,
  type Tournament,
  type Match,
  type MatchPlayer,
  type LiveMatchData,
} from "@/lib/padel-api";
import {
  normalizeMatches,
  buildContext,
  type NormalizedMatch,
} from "@/lib/normalize-match";
import { getTourToday } from "@/lib/tour-date";

// ---------------------------------------------------------------------------
// Schema helpers
// ---------------------------------------------------------------------------

function stripEmpty<T extends object>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) =>
      v === undefined || v === null ? undefined : v,
    ),
  ) as T;
}

function tournamentEventStatus(_status: Tournament["status"]): string {
  return "https://schema.org/EventScheduled";
}

function organizerForLevel(level: string): {
  "@type": string;
  name: string;
} {
  if (
    level.startsWith("premier_") ||
    level === "p1" ||
    level === "p2" ||
    level === "major" ||
    level === "finals"
  ) {
    return { "@type": "SportsOrganization", name: "Premier Padel" };
  }
  return { "@type": "SportsOrganization", name: "FIP" };
}

// Tournament page shows live match state — short revalidate
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  try {
    const tournament = await getTournament(parseInt(params.id));
    return {
      title: `${tournament.name} | VAMOS`,
      description: `${tournament.name} — ${tournament.location}, ${tournament.country}. ${levelLabel(
        tournament.level,
      )} tournament results, draws, and schedule.`,
    };
  } catch {
    return { title: "Tournament Not Found | VAMOS" };
  }
}

/** How many top-ranked players to feature in the Best Players strip. */
const BEST_PLAYERS_LIMIT = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMatchDay(iso: string | null): string {
  if (!iso) return "TBD";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "TBD";
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return "TBD";
  }
}

function dateKey(iso: string | null): string {
  if (!iso) return "9999-99-99";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "9999-99-99";
    return d.toISOString().split("T")[0];
  } catch {
    return "9999-99-99";
  }
}

function collectRoster(matchList: NormalizedMatch[]): MatchPlayer[] {
  const map = new Map<number, MatchPlayer>();
  for (const m of matchList) {
    for (const p of [...m.players.team_1, ...m.players.team_2]) {
      if (!map.has(p.id)) map.set(p.id, p);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function loadBestPlayers(
  roster: MatchPlayer[],
): Promise<BestPlayer[]> {
  if (roster.length === 0) return [];
  const ids = roster.slice(0, 64).map((p) => p.id);
  const profiles = await Promise.all(
    ids.map(async (id) => {
      try {
        return await getPlayer(id);
      } catch {
        return null;
      }
    }),
  );
  return profiles
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .filter((p) => typeof p.ranking === "number" && p.ranking > 0)
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, BEST_PLAYERS_LIMIT)
    .map((p) => ({
      id: p.id,
      name: p.name,
      photoUrl: p.photo_url ?? null,
      ranking: p.ranking,
      nationality: p.nationality ?? null,
    }));
}

function buildFilterOptions(matchList: NormalizedMatch[]): {
  dates: FilterOption[];
  rounds: FilterOption[];
  courts: FilterOption[];
} {
  const dateMap = new Map<string, string>();
  const roundMap = new Map<string, { label: string; order: number }>();
  const courtSet = new Set<string>();

  for (const m of matchList) {
    const key = dateKey(m.played_at);
    if (key !== "9999-99-99" && !dateMap.has(key)) {
      dateMap.set(key, formatMatchDay(m.played_at));
    }
    const roundKey = m.round_name || `Round ${m.round}`;
    if (!roundMap.has(roundKey)) {
      roundMap.set(roundKey, { label: roundKey, order: m.round ?? 99 });
    }
    if (m.court && m.court.trim().length > 0) {
      courtSet.add(m.court.trim());
    }
  }

  const dates: FilterOption[] = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, label]) => ({ value, label }));
  const rounds: FilterOption[] = Array.from(roundMap.entries())
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([value, info]) => ({ value, label: info.label }));
  const courts: FilterOption[] = Array.from(courtSet)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ value, label: value }));

  return { dates, rounds, courts };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TournamentDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const id = parseInt(params.id);
  if (Number.isNaN(id)) notFound();

  let tournament: Tournament;
  let matches: Match[] = [];
  let liveData: LiveMatchData[] = [];

  try {
    tournament = await getTournament(id);
    const [matchesAll, liveRes] = await Promise.all([
      getAllTournamentMatches(id, {
        sort_by: "played_at",
        order_by: "asc",
      }),
      getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
    ]);
    matches = matchesAll;
    liveData = liveRes.data;
  } catch {
    notFound();
  }

  // Route every match through the normalizer (H4) so we filter on displayStatus,
  // not the raw API status that contradicts itself (see MATCH-STATUS-ARCHITECTURE.md).
  const todayStr = getTourToday();
  const ctx = buildContext(liveData, undefined, todayStr);
  const normalized = normalizeMatches(matches, ctx);

  const validMatches = normalized.filter(
    (m) => m.players.team_1.length > 0 || m.players.team_2.length > 0,
  );

  const scheduledMatches = validMatches.filter(
    (m) => m.displayStatus === "scheduled" || m.displayStatus === "live",
  );
  const finishedMatches = validMatches.filter(
    (m) => m.displayStatus === "finished",
  );

  const todaysMatches = scheduledMatches.filter(
    (m) => dateKey(m.played_at) === todayStr,
  );

  const roster = collectRoster(validMatches);
  const bestPlayers = await loadBestPlayers(roster);
  const scheduleFilterOptions = buildFilterOptions(scheduledMatches);
  const resultsFilterOptions = buildFilterOptions(finishedMatches);

  // ---------------------------------------------------------------------------
  // Schema.org JSON-LD
  // ---------------------------------------------------------------------------

  const lastWord = (n: string | null | undefined) => {
    const parts = (n ?? "").trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "TBD";
  };

  const subEventSchemas = scheduledMatches.slice(0, 5).map((m) => {
    const mT1 =
      m.players.team_1.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
    const mT2 =
      m.players.team_2.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
    return stripEmpty({
      "@type": "SportsEvent",
      name: `${mT1} vs ${mT2}`,
      startDate: m.played_at,
      url: `https://vamos.net/matches/${m.id}`,
      competitor: [
        {
          "@type": "SportsTeam",
          name: mT1,
          member: m.players.team_1.map((p) => ({
            "@type": "Person",
            name: p.name,
          })),
        },
        {
          "@type": "SportsTeam",
          name: mT2,
          member: m.players.team_2.map((p) => ({
            "@type": "Person",
            name: p.name,
          })),
        },
      ],
    });
  });

  const tournamentSchema = stripEmpty({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    sport: "Padel",
    startDate: tournament.start_date,
    endDate: tournament.end_date,
    eventStatus: tournamentEventStatus(tournament.status),
    url: `https://vamos.net/tournaments/${id}`,
    description: `${levelLabel(tournament.level)} tournament in ${tournament.location}, ${tournament.country}.`,
    location: {
      "@type": "Place",
      name: tournament.location,
      address: {
        "@type": "PostalAddress",
        addressCountry: tournament.country,
      },
    },
    organizer: organizerForLevel(tournament.level),
    subEvent: subEventSchemas.length > 0 ? subEventSchemas : undefined,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vamos.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tournaments",
        item: "https://vamos.net/tournaments",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tournament.name,
        item: `https://vamos.net/tournaments/${id}`,
      },
    ],
  };

  return (
    <div className="bg-bg-page min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tournamentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mx-auto max-w-[1320px] px-16 py-24 sm:px-24 sm:py-32 lg:px-32">
        {/* Back link */}
        <Link
          href="/tournaments"
          className="mb-16 inline-flex items-center gap-4 font-sans text-12 font-semibold tracking-[0.04em] text-text-secondary transition-colors hover:text-text-primary"
        >
          ← All tournaments
        </Link>

        {/* Hero banner */}
        <TournamentBanner
          tournament={tournament}
          ctaHref={`/tournaments/${id}?tab=schedule`}
        />

        {/* Best Players strip (S18) — sits between banner and tabs */}
        <BestPlayersStrip players={bestPlayers} />

        {/* Tabs + tab content — client-side so switching is instant */}
        <TournamentDetailTabs
          tournamentId={id}
          initialTab={searchParams.tab}
          scheduledMatches={scheduledMatches}
          finishedMatches={finishedMatches}
          todaysMatches={todaysMatches}
          allMatches={validMatches}
          roster={roster}
          scheduleFilterOptions={scheduleFilterOptions}
          resultsFilterOptions={resultsFilterOptions}
        />
      </div>
    </div>
  );
}
