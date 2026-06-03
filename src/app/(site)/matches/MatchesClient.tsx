"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Tabs from "@/components/v3/Tabs";
import type { Match, Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

type StatusFilter = "all" | "live" | "finished" | "upcoming";

interface MatchesClientProps {
  matches: NormalizedMatch[];
  tournaments: Tournament[];
}

function getTournamentForMatch(
  match: Match,
  tournaments: Tournament[],
): Tournament | undefined {
  const path = match.connections?.tournament;
  if (!path) return undefined;
  const id = parseInt(path.split("/").pop() || "0");
  return tournaments.find((t) => t.id === id);
}

export default function MatchesClient({ matches, tournaments }: MatchesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusParam = (searchParams.get("status") as StatusFilter | null) || "all";

  const buildUrl = (status: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (!status || status === "all") p.delete("status");
    else p.set("status", status);
    const qs = p.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  const filtered = useMemo(() => {
    let list = matches.filter((m) => m.displayStatus !== "cancelled");
    if (statusParam === "live") list = list.filter((m) => m.displayStatus === "live");
    else if (statusParam === "finished")
      list = list.filter((m) => m.displayStatus === "finished");
    else if (statusParam === "upcoming")
      list = list.filter((m) => m.displayStatus === "scheduled");
    // Sort: live first, then scheduled, then finished
    const order: Record<string, number> = {
      live: 0,
      scheduled: 1,
      finished: 2,
      walkover: 3,
      cancelled: 4,
      unknown: 5,
    };
    return list.slice().sort((a, b) => {
      const ord = (order[a.displayStatus] ?? 9) - (order[b.displayStatus] ?? 9);
      if (ord !== 0) return ord;
      // Then by played_at descending for finished, ascending otherwise
      const at = a.played_at ? new Date(a.played_at).getTime() : 0;
      const bt = b.played_at ? new Date(b.played_at).getTime() : 0;
      return a.displayStatus === "finished" ? bt - at : at - bt;
    });
  }, [matches, statusParam]);

  const tabItems = [
    { label: "All", href: buildUrl("all"), active: statusParam === "all" },
    { label: "Live", href: buildUrl("live"), active: statusParam === "live" },
    { label: "Upcoming", href: buildUrl("upcoming"), active: statusParam === "upcoming" },
    { label: "Finished", href: buildUrl("finished"), active: statusParam === "finished" },
  ];

  const handleMatchClick = (match: Match) => {
    router.push(`/matches/${match.id}`);
  };

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        <h1 className="font-display font-bold text-text-primary mb-24 text-mobile-display-l md:text-desktop-display-l">
          MATCHES
        </h1>

        <div className="mb-24 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Match status filter" />
        </div>

        {filtered.length > 0 ? (
          <>
            {/* Mobile */}
            <div className="space-y-8 md:hidden">
              {filtered.map((m) => {
                const t = getTournamentForMatch(m, tournaments);
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    tournamentName={t?.name}
                    onSelect={handleMatchClick}
                  />
                );
              })}
            </div>
            {/* Desktop */}
            <div className="hidden space-y-8 md:block">
              {filtered.map((m) => {
                const t = getTournamentForMatch(m, tournaments);
                return (
                  <MatchCardDesktop
                    key={m.id}
                    match={m}
                    tournamentName={t?.name}
                    onSelect={handleMatchClick}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              No matches found for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
