"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Tabs from "@/components/v3/Tabs";
import type { Match, Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

type StatusFilter = "live" | "today" | "upcoming" | "finished";

interface TournamentGroup {
  tournament: Tournament | undefined;
  tournamentId: number;
  matches: NormalizedMatch[];
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

export default function ScoresClient({
  matches,
  tournaments,
  activeTournaments,
}: ScoresClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusParam = (searchParams.get("status") as StatusFilter | null) || "today";
  const tournamentParam = searchParams.get("tournament") || "all";

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

  const tabItems = [
    { label: "Live", href: buildUrl({ status: "live" }), active: statusParam === "live" },
    { label: "Today", href: buildUrl({ status: "today" }), active: statusParam === "today" },
    { label: "Upcoming", href: buildUrl({ status: "upcoming" }), active: statusParam === "upcoming" },
    { label: "Finished", href: buildUrl({ status: "finished" }), active: statusParam === "finished" },
  ];

  const handleMatchClick = (match: Match) => {
    router.push(`/matches/${match.id}`);
  };

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Title */}
        <h1 className="font-display font-bold text-text-primary mb-24 text-mobile-display-l md:text-desktop-display-l">
          SCORES
        </h1>

        {/* Tabs */}
        <div className="mb-24 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Match status filter" />
        </div>

        {/* Tournament filter pills */}
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
                  onClick={() => router.push(buildUrl({ tournament: String(t.id) }))}
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

        {/* Tournament groups */}
        {groups.length > 0 ? (
          <div className="space-y-32">
            {groups.map((group) => (
              <section key={group.tournamentId}>
                <div className="mb-12 flex items-baseline gap-12">
                  <h2 className="font-display font-semibold text-text-primary text-title-l">
                    {group.tournament?.name || "Other matches"}
                  </h2>
                  {group.tournament && (
                    <span className="font-sans text-12 text-text-secondary">
                      {group.tournament.location}
                      {group.tournament.country ? `, ${group.tournament.country}` : ""}
                    </span>
                  )}
                </div>

                {/* Mobile cards */}
                <div className="space-y-8 md:hidden">
                  {group.matches.map((m) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      tournamentName={group.tournament?.name}
                      onSelect={handleMatchClick}
                    />
                  ))}
                </div>

                {/* Desktop cards */}
                <div className="hidden space-y-8 md:block">
                  {group.matches.map((m) => (
                    <MatchCardDesktop
                      key={m.id}
                      match={m}
                      tournamentName={group.tournament?.name}
                      onSelect={handleMatchClick}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              No matches in this view. Try a different tab or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
