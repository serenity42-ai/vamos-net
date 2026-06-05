"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Tabs from "@/components/v3/Tabs";
import FilterSheet from "@/components/v3/FilterSheet";
import type { Match, Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

type StatusFilter = "live" | "today" | "upcoming" | "finished";

interface TournamentGroup {
  tournament: Tournament | undefined;
  tournamentId: number;
  matches: NormalizedMatch[];
}

interface OrganizerGroup {
  organizer: string;
  tournaments: TournamentGroup[];
  liveCount: number;
}

interface ScoresClientProps {
  matches: NormalizedMatch[];
  tournaments: Tournament[];
  activeTournaments: Tournament[];
  todayStr: string;
}

function getTournamentForMatch(
  match: Match,
  tournaments: Tournament[],
): Tournament | undefined {
  const tournamentPath = match.connections?.tournament;
  if (!tournamentPath) return undefined;
  const id = parseInt(tournamentPath.split("/").pop() || "0");
  return tournaments.find((t) => t.id === id);
}

// S7 — detect organizer + tier ranking from tournament.level (authoritative).
// Previously this read tournament name and looked for the substring
// 'premier padel', but no tournament is actually named that — events are
// 'Italy Major 2026', 'Riyadh Season P1 2026', etc. — so every Premier
// event was wrongly bucketed as 'Other' and FIP floated to the top.
//
// `level` values seen in PadelAPI:
//   Premier Padel (season 5): 'major', 'p1', 'p2', 'finals', 'fip_other'
//   FIP Tour (season 6):      'fip_platinum', 'fip_gold', 'fip_silver'
// Anything else falls back to 'Other'.
//
// Lower rankWithinOrganizer = higher up in the list.
const TIER_RANK: Record<string, { organizer: string; rank: number }> = {
  major:        { organizer: "Premier Padel", rank: 1 },
  p1:           { organizer: "Premier Padel", rank: 2 },
  p2:           { organizer: "Premier Padel", rank: 3 },
  finals:       { organizer: "Premier Padel", rank: 4 },
  fip_other:    { organizer: "Premier Padel", rank: 5 },
  fip_platinum: { organizer: "FIP Tour",      rank: 1 },
  fip_gold:     { organizer: "FIP Tour",      rank: 2 },
  fip_silver:   { organizer: "FIP Tour",      rank: 3 },
};

function detectOrganizer(tournament: { level?: string | null; name?: string } | undefined): string {
  if (!tournament) return "Other";
  const level = (tournament.level || "").toLowerCase();
  const tier = TIER_RANK[level];
  if (tier) return tier.organizer;
  // Fallback heuristic for tournaments without a recognised level
  const name = (tournament.name || "").toLowerCase();
  if (name.includes("hexagon")) return "Hexagon";
  if (name.includes("a1 padel") || name.includes("a1padel")) return "A1 Padel";
  return "Other";
}

function tierRankWithinOrganizer(tournament: { level?: string | null } | undefined): number {
  const level = (tournament?.level || "").toLowerCase();
  return TIER_RANK[level]?.rank ?? 99;
}

const ORGANIZER_ORDER = ["Premier Padel", "FIP Tour", "Hexagon", "A1 Padel", "Other"];

function FilterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 6h18M6 12h12M9 18h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      style={{ transition: "transform 300ms ease" }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * S4 + S7 — collapsible tournament block used in the organizer grouping.
 * Local state so each tournament card remembers its expanded state.
 */
function ExpandableTournamentBlock({
  group,
  onSelect,
}: {
  group: TournamentGroup;
  onSelect: (m: Match) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const count = group.matches.length;
  const liveCount = group.matches.filter((m) => m.displayStatus === "live").length;

  return (
    <div className="rounded-16 border border-border-primary bg-bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-12 p-16 text-left hover:bg-bg-gray transition-colors"
      >
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-text-primary text-title-m truncate">
            {group.tournament?.name || "Other matches"}
          </h3>
          <p className="font-sans text-12 text-text-secondary mt-2 truncate">
            {group.tournament?.location}
            {group.tournament?.country ? `, ${group.tournament.country}` : ""}
            {!expanded && (
              <>
                <span aria-hidden> · </span>
                <span className="font-semibold">
                  {count} match{count === 1 ? "" : "es"}
                  {liveCount > 0 ? ` · ${liveCount} live` : ""}
                </span>
              </>
            )}
          </p>
        </div>
        <ChevronDown
          className={
            "text-text-secondary shrink-0" + (expanded ? " rotate-180" : "")
          }
        />
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? 4000 : 0,
          transition: "max-height 300ms ease",
        }}
      >
        <div className="p-16 pt-0">
          {/* Mobile */}
          <div className="space-y-8 md:hidden">
            {group.matches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                tournamentName={group.tournament?.name}
                onSelect={onSelect}
              />
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden space-y-8 md:block">
            {group.matches.map((m) => (
              <MatchCardDesktop
                key={m.id}
                match={m}
                tournamentName={group.tournament?.name}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScoresClient({
  matches,
  tournaments,
  activeTournaments,
}: ScoresClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusParam =
    (searchParams.get("status") as StatusFilter | null) || "today";
  const tournamentParam = searchParams.get("tournament") || "all";

  const [filterOpen, setFilterOpen] = useState(false);

  const buildUrl = (next: Partial<{ status: string; tournament: string }>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "all" || v === "today") p.delete(k);
      else p.set(k, v);
    });
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  // Filter matches by status
  const filtered = useMemo(() => {
    let list = matches.filter(
      (m) =>
        m.displayStatus !== "cancelled" &&
        (m.players.team_1.length > 0 ||
          m.players.team_2.length > 0 ||
          m.displayStatus === "scheduled" ||
          (m.displayStatus === "finished" && m.score && m.score.length > 0)),
    );

    if (statusParam === "live") {
      list = list.filter((m) => m.displayStatus === "live");
    } else if (statusParam === "upcoming") {
      list = list.filter((m) => m.displayStatus === "scheduled");
    } else if (statusParam === "finished") {
      list = list.filter((m) => m.displayStatus === "finished");
    }
    // "today" — show all on the day, no further filter

    if (tournamentParam !== "all") {
      const tId = parseInt(tournamentParam);
      list = list.filter((m) => {
        const path = m.connections?.tournament;
        if (!path) return false;
        return parseInt(path.split("/").pop() || "0") === tId;
      });
    }
    return list;
  }, [matches, statusParam, tournamentParam]);

  // Group by tournament
  const groups = useMemo<TournamentGroup[]>(() => {
    const map = new Map<number, TournamentGroup>();
    for (const m of filtered) {
      const t = getTournamentForMatch(m, tournaments);
      const id = t?.id ?? 0;
      if (!map.has(id)) {
        map.set(id, { tournament: t, tournamentId: id, matches: [] });
      }
      map.get(id)!.matches.push(m);
    }
    // Sort matches within each group: live → scheduled → finished
    const order: Record<string, number> = {
      live: 0,
      scheduled: 1,
      finished: 2,
      walkover: 3,
      cancelled: 4,
      unknown: 5,
    };
    map.forEach((g) =>
      g.matches.sort(
        (a, b) => (order[a.displayStatus] ?? 9) - (order[b.displayStatus] ?? 9),
      ),
    );

    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      const al = a.tournament?.status === "live" ? 0 : 1;
      const bl = b.tournament?.status === "live" ? 0 : 1;
      return al - bl;
    });
    return arr;
  }, [filtered, tournaments]);

  // S7 — group tournament groups by organizer, with tier ordering inside.
  const organizerGroups = useMemo<OrganizerGroup[]>(() => {
    const byOrg = new Map<string, OrganizerGroup>();
    for (const tg of groups) {
      const org = detectOrganizer(tg.tournament);
      if (!byOrg.has(org)) {
        byOrg.set(org, { organizer: org, tournaments: [], liveCount: 0 });
      }
      const og = byOrg.get(org)!;
      og.tournaments.push(tg);
      og.liveCount += tg.matches.filter((m) => m.displayStatus === "live").length;
    }
    // Sort tournaments within each organizer by tier: Major > P1 > P2 > Finals
    // for Premier; Platinum > Gold > Silver for FIP. Tiebreak: live tournament
    // first (existing behaviour), then alphabetical so the list is stable.
    for (const og of byOrg.values()) {
      og.tournaments.sort((a, b) => {
        const rankDelta =
          tierRankWithinOrganizer(a.tournament) -
          tierRankWithinOrganizer(b.tournament);
        if (rankDelta !== 0) return rankDelta;
        const aLive = a.tournament?.status === "live" ? 0 : 1;
        const bLive = b.tournament?.status === "live" ? 0 : 1;
        if (aLive !== bLive) return aLive - bLive;
        return (a.tournament?.name || "").localeCompare(b.tournament?.name || "");
      });
    }
    const arr = Array.from(byOrg.values());
    arr.sort(
      (a, b) =>
        ORGANIZER_ORDER.indexOf(a.organizer) -
        ORGANIZER_ORDER.indexOf(b.organizer),
    );
    return arr;
  }, [groups]);

  const tabItems = [
    {
      label: "Live",
      href: buildUrl({ status: "live" }),
      active: statusParam === "live",
    },
    {
      label: "Today",
      href: buildUrl({ status: "today" }),
      active: statusParam === "today",
    },
    {
      label: "Upcoming",
      href: buildUrl({ status: "upcoming" }),
      active: statusParam === "upcoming",
    },
    {
      label: "Finished",
      href: buildUrl({ status: "finished" }),
      active: statusParam === "finished",
    },
  ];

  const handleMatchClick = (match: Match) => {
    router.push(`/matches/${match.id}`);
  };

  const handleSaveFilter = (next: string) => {
    setFilterOpen(false);
    router.push(buildUrl({ tournament: next }));
  };

  const isLiveEmpty = statusParam === "live" && groups.length === 0;

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Title + Filter button row */}
        <div className="mb-24 flex items-center justify-between gap-16">
          <h1 className="font-display font-bold text-text-primary text-mobile-display-l md:text-desktop-display-l">
            SCORES
          </h1>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-8 rounded-full border border-border-primary bg-bg-white px-16 py-8 font-sans text-12 font-semibold text-text-primary hover:bg-bg-gray transition-colors"
            aria-label="Open tournament filters"
          >
            <FilterIcon />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-24 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Match status filter" />
        </div>

        {/* Inline tournament filter pills (still useful) */}
        {activeTournaments.length > 0 && (
          <div className="mb-32 flex gap-8 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => router.push(buildUrl({ tournament: "all" }))}
              className={[
                "shrink-0 rounded-full border px-16 py-8 font-sans text-12 font-semibold transition-colors",
                tournamentParam === "all"
                  ? "bg-text-primary text-text-contrast border-text-primary"
                  : "bg-bg-white text-text-secondary border-border-primary hover:text-text-primary",
              ].join(" ")}
            >
              All tournaments
            </button>
            {activeTournaments.map((t) => {
              const active = tournamentParam === String(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    router.push(buildUrl({ tournament: String(t.id) }))
                  }
                  className={[
                    "shrink-0 rounded-full border px-16 py-8 font-sans text-12 font-semibold transition-colors",
                    active
                      ? "bg-text-primary text-text-contrast border-text-primary"
                      : "bg-bg-white text-text-secondary border-border-primary hover:text-text-primary",
                  ].join(" ")}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Organizer-grouped tournament blocks */}
        {organizerGroups.length > 0 ? (
          <div className="space-y-40">
            {organizerGroups.map((og) => (
              <section key={og.organizer}>
                <div className="mb-12 flex items-baseline gap-12">
                  <h2 className="font-display font-bold text-text-primary text-mobile-heading-m md:text-desktop-heading-m uppercase">
                    {og.organizer}
                  </h2>
                  {og.liveCount > 0 && (
                    <span className="inline-flex items-center gap-4 rounded-full bg-brand px-8 py-2 font-sans text-12 font-semibold text-text-contrast">
                      <span
                        className="live-dot inline-block rounded-full bg-text-contrast"
                        style={{ width: 6, height: 6 }}
                        aria-hidden
                      />
                      {og.liveCount} live
                    </span>
                  )}
                  <span className="font-sans text-12 text-text-secondary">
                    {og.tournaments.length} tournament
                    {og.tournaments.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="space-y-12">
                  {og.tournaments.map((tg) => (
                    <ExpandableTournamentBlock
                      key={tg.tournamentId}
                      group={tg}
                      onSelect={handleMatchClick}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : isLiveEmpty ? (
          // S8 — empty state CTA when live-only and nothing live
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-display font-semibold text-text-primary text-title-l mb-8">
              No live matches right now
            </p>
            <p className="font-sans text-14 text-text-secondary mb-24">
              No matches are streaming live at the moment. Check today&apos;s
              schedule instead.
            </p>
            <button
              type="button"
              onClick={() => router.push(buildUrl({ status: "today" }))}
              className="inline-flex items-center gap-8 rounded-full bg-brand text-text-contrast font-display font-semibold px-24 py-12 text-14 hover:bg-brand-dark transition-colors"
            >
              Show today&apos;s matches
            </button>
          </div>
        ) : (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              No matches in this view. Try a different tab or filter.
            </p>
          </div>
        )}
      </div>

      {/* Filter sheet / modal */}
      <FilterSheet
        open={filterOpen}
        tournaments={activeTournaments}
        value={tournamentParam}
        onSave={handleSaveFilter}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
}
