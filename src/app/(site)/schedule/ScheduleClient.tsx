"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DatesPicker, { type DateItem } from "@/components/v3/DatesPicker";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import type { Match, Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

interface ScheduleClientProps {
  /** All matches across the windowed range (14 days). */
  matches: NormalizedMatch[];
  tournaments: Tournament[];
  /** Map of YYYY-MM-DD → match count, precomputed server-side. */
  dateCounts: Record<string, number>;
  /** List of YYYY-MM-DD date strings to show in picker. */
  dateList: string[];
  todayStr: string;
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

function formatDateLabel(iso: string, todayStr: string): string {
  if (iso === todayStr) return "Today";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function matchDateKey(m: Match): string | null {
  if (!m.played_at) return null;
  return m.played_at.split("T")[0];
}

export default function ScheduleClient({
  matches,
  tournaments,
  dateCounts,
  dateList,
  todayStr,
}: ScheduleClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedDate = searchParams.get("date") || todayStr;

  const dateItems: DateItem[] = useMemo(
    () =>
      dateList.map((iso) => {
        const count = dateCounts[iso] || 0;
        return {
          iso,
          label: formatDateLabel(iso, todayStr),
          meta: count > 0 ? `${count} match${count === 1 ? "" : "es"}` : "No matches",
        };
      }),
    [dateList, dateCounts, todayStr],
  );

  const onSelectDate = (iso: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (iso === todayStr) p.delete("date");
    else p.set("date", iso);
    const qs = p.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  // Filter matches to the selected date
  const dayMatches = useMemo(
    () => matches.filter((m) => matchDateKey(m) === selectedDate),
    [matches, selectedDate],
  );

  // Group by tournament
  const groups = useMemo(() => {
    const map = new Map<
      number,
      { tournament: Tournament | undefined; matches: NormalizedMatch[] }
    >();
    for (const m of dayMatches) {
      const t = getTournamentForMatch(m, tournaments);
      const id = t?.id ?? 0;
      if (!map.has(id)) map.set(id, { tournament: t, matches: [] });
      map.get(id)!.matches.push(m);
    }
    return Array.from(map.entries()).map(([id, g]) => ({
      tournamentId: id,
      tournament: g.tournament,
      matches: g.matches,
    }));
  }, [dayMatches, tournaments]);

  const handleMatchClick = (match: Match) => {
    router.push(`/matches/${match.id}`);
  };

  const headerDate = new Date(selectedDate + "T12:00:00");
  const headerLabel = headerDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Page title */}
        <h1 className="font-display font-bold text-text-primary mb-24 text-mobile-display-l md:text-desktop-display-l">
          SCHEDULE
        </h1>

        <div className="grid gap-24 lg:grid-cols-[320px_1fr] lg:items-start">
          {/* Dates picker — sticky sidebar on desktop */}
          <aside className="lg:sticky lg:top-24">
            <DatesPicker
              dates={dateItems}
              activeIso={selectedDate}
              onSelect={onSelectDate}
              title="Pick a date"
            />
          </aside>

          {/* Matches column */}
          <div>
            <div className="mb-16">
              <p className="font-display text-title-l font-semibold text-text-primary">
                {headerLabel}
              </p>
              <p className="font-sans text-14 text-text-secondary">
                {dayMatches.length} match{dayMatches.length === 1 ? "" : "es"}
              </p>
            </div>

            {groups.length > 0 ? (
              <div className="space-y-24">
                {groups.map((group) => (
                  <section key={group.tournamentId}>
                    <h3 className="mb-12 font-display text-title-l font-semibold text-text-primary">
                      {group.tournament?.name || "Other matches"}
                    </h3>

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

                    {/* Desktop rows */}
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
                  No matches scheduled for this date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
