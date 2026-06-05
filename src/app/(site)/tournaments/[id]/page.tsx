import Link from "next/link";
import { notFound } from "next/navigation";
import Tabs from "@/components/v3/Tabs";
import TournamentBanner from "@/components/v3/TournamentBanner";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Cell from "@/components/v3/Cell";
import {
  getTournament,
  getTournamentMatches,
  getLiveMatches,
  levelLabel,
  type Tournament,
  type Match,
  type MatchPlayer,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext, type NormalizedMatch } from "@/lib/normalize-match";
import { getTourToday } from "@/lib/tour-date";

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

type DetailTab = "schedule" | "results" | "draw" | "players";

const VALID_TABS: DetailTab[] = ["schedule", "results", "draw", "players"];

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

/**
 * Groups matches by round, preserving the original numerical round order.
 */
function groupByRound(matchList: NormalizedMatch[]): Array<[string, NormalizedMatch[]]> {
  const groups = new Map<string, NormalizedMatch[]>();
  for (const m of matchList) {
    const key = m.round_name || `Round ${m.round}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries()).sort((a, b) => {
    const aRound = a[1][0]?.round ?? 99;
    const bRound = b[1][0]?.round ?? 99;
    return aRound - bRound;
  });
}

/**
 * Groups matches by ISO date string, oldest first.
 */
function groupByDate(matchList: NormalizedMatch[]): Array<[string, NormalizedMatch[]]> {
  const groups = new Map<string, NormalizedMatch[]>();
  for (const m of matchList) {
    const key = dateKey(m.played_at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Returns a unique roster (player id → player) extracted from every match.
 */
function collectRoster(matchList: NormalizedMatch[]): MatchPlayer[] {
  const map = new Map<number, MatchPlayer>();
  for (const m of matchList) {
    for (const p of [...m.players.team_1, ...m.players.team_2]) {
      if (!map.has(p.id)) map.set(p.id, p);
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
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
    const [matchesRes, liveRes] = await Promise.all([
      getTournamentMatches(id, {
        per_page: "100",
        sort_by: "played_at",
        order_by: "asc",
      }),
      getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
    ]);
    matches = matchesRes.data;
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
    (m) =>
      m.players.team_1.length > 0 || m.players.team_2.length > 0,
  );

  const tab = (
    VALID_TABS.includes(searchParams.tab as DetailTab)
      ? searchParams.tab
      : "schedule"
  ) as DetailTab;

  const scheduledMatches = validMatches.filter(
    (m) => m.displayStatus === "scheduled" || m.displayStatus === "live",
  );
  const finishedMatches = validMatches.filter(
    (m) => m.displayStatus === "finished",
  );

  const scheduleGroups = groupByDate(scheduledMatches);
  const resultsGroups = groupByRound(finishedMatches);
  const roster = collectRoster(validMatches);

  const tabItems = [
    {
      label: "Schedule",
      href: `/tournaments/${id}`,
      active: tab === "schedule",
    },
    {
      label: "Results",
      href: `/tournaments/${id}?tab=results`,
      active: tab === "results",
    },
    {
      label: "Draw",
      href: `/tournaments/${id}?tab=draw`,
      active: tab === "draw",
    },
    {
      label: "Players",
      href: `/tournaments/${id}?tab=players`,
      active: tab === "players",
    },
  ];

  return (
    <div className="bg-bg-page min-h-screen">
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

        {/* Tabs */}
        <div className="mt-24 mb-24 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Tournament section navigation" />
        </div>

        {/* ── Schedule ─────────────────────────────────────────────── */}
        {tab === "schedule" && (
          <section>
            {scheduleGroups.length === 0 ? (
              <EmptyState message="No upcoming matches scheduled." />
            ) : (
              <div className="space-y-32">
                {scheduleGroups.map(([day, dayMatches]) => {
                  const byRound = groupByRound(dayMatches);
                  return (
                    <div key={day}>
                      <h2 className="mb-12 font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
                        {formatMatchDay(dayMatches[0]?.played_at ?? null)}
                      </h2>
                      {byRound.map(([roundName, roundMatches]) => (
                        <div key={roundName} className="mb-20">
                          <p className="mb-8 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
                            {roundName}
                          </p>
                          <div className="grid grid-cols-1 gap-8 md:hidden">
                            {roundMatches.map((m) => (
                              <MatchCard key={m.id} match={m} />
                            ))}
                          </div>
                          <div className="hidden flex-col gap-8 md:flex">
                            {roundMatches.map((m) => (
                              <MatchCardDesktop key={m.id} match={m} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Results ──────────────────────────────────────────────── */}
        {tab === "results" && (
          <section>
            {resultsGroups.length === 0 ? (
              <EmptyState message="No finished matches yet." />
            ) : (
              <div className="space-y-24">
                {resultsGroups.map(([roundName, roundMatches]) => (
                  <div key={roundName}>
                    <h2 className="mb-12 font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
                      {roundName}
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:hidden">
                      {roundMatches.map((m) => (
                        <MatchCard key={m.id} match={m} />
                      ))}
                    </div>
                    <div className="hidden flex-col gap-8 md:flex">
                      {roundMatches.map((m) => (
                        <MatchCardDesktop key={m.id} match={m} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Draw (v1 stub) ───────────────────────────────────────── */}
        {tab === "draw" && (
          <section>
            <div className="rounded-24 border border-border-primary bg-bg-white p-48 text-center">
              <p className="font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
                Bracket coming soon
              </p>
              <p className="mt-8 font-sans text-14 text-text-secondary">
                We&rsquo;re building a visual bracket view for this tournament.
              </p>
              <p className="mt-4 font-sans text-12 text-text-tertiary">
                In the meantime, check the{" "}
                <Link
                  href={`/tournaments/${id}?tab=results`}
                  className="text-brand hover:underline"
                >
                  Results
                </Link>{" "}
                or{" "}
                <Link
                  href={`/tournaments/${id}?tab=schedule`}
                  className="text-brand hover:underline"
                >
                  Schedule
                </Link>{" "}
                tab.
              </p>
            </div>
          </section>
        )}

        {/* ── Players ──────────────────────────────────────────────── */}
        {tab === "players" && (
          <section>
            {roster.length === 0 ? (
              <EmptyState message="No players listed yet for this tournament." />
            ) : (
              <>
                <p className="mb-16 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
                  {roster.length} player{roster.length === 1 ? "" : "s"}
                </p>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {roster.map((p) => (
                    <Cell
                      key={p.id}
                      title={p.name}
                      subtitle={p.side ? `Side: ${p.side}` : undefined}
                      href={`/players/${p.id}`}
                      chevron
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
      <p className="font-sans text-14 text-text-secondary">{message}</p>
    </div>
  );
}
