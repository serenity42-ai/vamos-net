"use client";

import { useMemo, useState } from "react";
import Tabs from "@/components/v3/Tabs";
import MatchCard from "@/components/v3/MatchCard";
import MatchCardDesktop from "@/components/v3/MatchCardDesktop";
import Cell from "@/components/v3/Cell";
import TournamentBracket from "@/components/v3/TournamentBracket";
import { type FilterOption } from "@/components/v3/TournamentMatchFilters";
import type { NormalizedMatch } from "@/lib/normalize-match";
import type { MatchPlayer } from "@/lib/padel-api";

/**
 * TournamentDetailTabs — client-side tab switcher for the tournament page.
 *
 * The whole-page-reload from <Link href="?tab=…"> was making tab switches
 * feel like external navigations (white flash, scroll reset). This component
 * keeps the heavy server-rendered match data in props and just toggles which
 * section is visible, so switching tabs is instant.
 *
 * It still owns the filter row (date/round/court) — those are also local
 * state, no URL roundtrip required for the common "scope to today" flow.
 */

type DetailTab = "schedule" | "results" | "draw" | "players";

const VALID_TABS: DetailTab[] = ["schedule", "results", "draw", "players"];

export type TournamentDetailTabsProps = {
  tournamentId: number;
  initialTab?: string;
  scheduledMatches: NormalizedMatch[];
  finishedMatches: NormalizedMatch[];
  todaysMatches: NormalizedMatch[];
  /** Full match list (any status) — the bracket needs this to render. */
  allMatches: NormalizedMatch[];
  roster: MatchPlayer[];
  scheduleFilterOptions: {
    dates: FilterOption[];
    rounds: FilterOption[];
    courts: FilterOption[];
  };
  resultsFilterOptions: {
    dates: FilterOption[];
    rounds: FilterOption[];
    courts: FilterOption[];
  };
};

// Lightweight client-side helpers — duplicated from the server page so this
// component is self-contained. Keep behaviour identical to the server version.

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

function groupByDate(
  list: NormalizedMatch[],
): Array<[string, NormalizedMatch[]]> {
  const groups = new Map<string, NormalizedMatch[]>();
  for (const m of list) {
    const key = dateKey(m.played_at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function groupByRound(
  list: NormalizedMatch[],
): Array<[string, NormalizedMatch[]]> {
  const groups = new Map<string, NormalizedMatch[]>();
  for (const m of list) {
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

function applyFilters(
  list: NormalizedMatch[],
  filters: { date?: string; round?: string; court?: string },
): NormalizedMatch[] {
  return list.filter((m) => {
    if (filters.date && dateKey(m.played_at) !== filters.date) return false;
    if (filters.round) {
      const roundKey = m.round_name || `Round ${m.round}`;
      if (roundKey !== filters.round) return false;
    }
    if (filters.court) {
      if (!m.court || m.court.trim() !== filters.court) return false;
    }
    return true;
  });
}

export default function TournamentDetailTabs({
  initialTab,
  scheduledMatches,
  finishedMatches,
  todaysMatches,
  allMatches,
  roster,
  scheduleFilterOptions,
  resultsFilterOptions,
}: TournamentDetailTabsProps) {
  const [tab, setTab] = useState<DetailTab>(
    VALID_TABS.includes(initialTab as DetailTab)
      ? (initialTab as DetailTab)
      : "schedule",
  );
  const [scheduleFilters, setScheduleFilters] = useState<{
    date?: string;
    round?: string;
    court?: string;
  }>({});
  const [resultsFilters, setResultsFilters] = useState<{
    date?: string;
    round?: string;
    court?: string;
  }>({});

  const filteredScheduled = useMemo(
    () => applyFilters(scheduledMatches, scheduleFilters),
    [scheduledMatches, scheduleFilters],
  );
  const filteredFinished = useMemo(
    () => applyFilters(finishedMatches, resultsFilters),
    [finishedMatches, resultsFilters],
  );
  const scheduleGroups = useMemo(
    () => groupByDate(filteredScheduled),
    [filteredScheduled],
  );
  const resultsGroups = useMemo(
    () => groupByRound(filteredFinished),
    [filteredFinished],
  );

  const tabItems = [
    { label: "Schedule", active: tab === "schedule", onClick: () => setTab("schedule") },
    { label: "Results", active: tab === "results", onClick: () => setTab("results") },
    { label: "Draw", active: tab === "draw", onClick: () => setTab("draw") },
    { label: "Players", active: tab === "players", onClick: () => setTab("players") },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="mt-24 mb-24 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
        <Tabs items={tabItems} ariaLabel="Tournament section navigation" />
      </div>

      {/* ── Schedule ─────────────────────────────────────────────── */}
      {tab === "schedule" && (
        <section>
          {todaysMatches.length > 0 && (
            <div className="mb-32">
              <h2 className="mb-12 font-display text-16 font-bold uppercase tracking-[0.04em] text-text-primary">
                Today&rsquo;s matches
              </h2>
              <div className="grid grid-cols-1 gap-8 md:hidden">
                {todaysMatches.map((m) => (
                  <MatchCard key={`today-${m.id}`} match={m} />
                ))}
              </div>
              <div className="hidden flex-col gap-8 md:flex">
                {todaysMatches.map((m) => (
                  <MatchCardDesktop key={`today-${m.id}`} match={m} />
                ))}
              </div>
            </div>
          )}

          <TournamentMatchFiltersLocal
            dates={scheduleFilterOptions.dates}
            rounds={scheduleFilterOptions.rounds}
            courts={scheduleFilterOptions.courts}
            selected={scheduleFilters}
            onChange={setScheduleFilters}
          />

          {scheduleGroups.length === 0 ? (
            <EmptyState
              message={
                scheduledMatches.length > 0
                  ? "No matches match the current filters."
                  : "No upcoming matches scheduled."
              }
            />
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
          <TournamentMatchFiltersLocal
            dates={resultsFilterOptions.dates}
            rounds={resultsFilterOptions.rounds}
            courts={resultsFilterOptions.courts}
            selected={resultsFilters}
            onChange={setResultsFilters}
          />

          {resultsGroups.length === 0 ? (
            <EmptyState
              message={
                finishedMatches.length > 0
                  ? "No matches match the current filters."
                  : "No finished matches yet."
              }
            />
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
          <TournamentBracket matches={allMatches} />
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
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
      <p className="font-sans text-14 text-text-secondary">{message}</p>
    </div>
  );
}

/**
 * Local filter row — mirrors TournamentMatchFilters' UI but takes a direct
 * setState callback instead of writing to URL search params. Means filter
 * changes don't trigger a server roundtrip.
 */
function TournamentMatchFiltersLocal({
  dates,
  rounds,
  courts,
  selected,
  onChange,
}: {
  dates: FilterOption[];
  rounds: FilterOption[];
  courts: FilterOption[];
  selected: { date?: string; round?: string; court?: string };
  onChange: (next: { date?: string; round?: string; court?: string }) => void;
}) {
  const showDates = dates.length > 1;
  const showRounds = rounds.length > 1;
  const showCourts = courts.length > 1;
  if (!showDates && !showRounds && !showCourts) return null;

  const update = (key: "date" | "round" | "court", value: string) => {
    onChange({ ...selected, [key]: value || undefined });
  };

  return (
    <div className="mb-24 flex flex-wrap items-center gap-8">
      {showDates && (
        <Select
          ariaLabel="Filter by date"
          value={selected.date ?? ""}
          options={[{ value: "", label: "All dates" }, ...dates]}
          onChange={(v) => update("date", v)}
        />
      )}
      {showRounds && (
        <Select
          ariaLabel="Filter by round"
          value={selected.round ?? ""}
          options={[{ value: "", label: "All rounds" }, ...rounds]}
          onChange={(v) => update("round", v)}
        />
      )}
      {showCourts && (
        <Select
          ariaLabel="Filter by court"
          value={selected.court ?? ""}
          options={[{ value: "", label: "All courts" }, ...courts]}
          onChange={(v) => update("court", v)}
        />
      )}
    </div>
  );
}

function Select({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{ariaLabel}</span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-border-primary bg-bg-white py-8 pl-16 pr-32 font-sans text-13 font-semibold text-text-primary transition-colors hover:bg-bg-gray focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-12 h-12 w-12 text-text-secondary"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
}
