"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { NormalizedMatch } from "@/lib/normalize-match";
import type { MatchPlayer } from "@/lib/padel-api";

/**
 * TournamentBracket — tennis/ATP-style 5-column bracket view.
 *
 * Premier Padel main draws run R32 → R16 → QF → SF → Final. The PadelAPI
 * encodes the round as the number of matches in that round (32 = R32, 16 =
 * R16, 4 = QF, 2 = SF, 1 = Final). We bucket every match by round and lay
 * them out as evenly-spaced cards within each column.
 *
 * Category toggle (Men / Women) shows the right draw — Premier events always
 * have both. If a tournament only has one category we hide the toggle.
 *
 * Each match links to its detail page. The Draw stub stays for any event
 * where the bracket isn't published yet.
 */

const BRACKET_ROUNDS: Array<{ key: number; label: string; short: string }> = [
  { key: 32, label: "Round of 32", short: "R32" },
  { key: 16, label: "Round of 16", short: "R16" },
  { key: 4, label: "Quarterfinals", short: "QF" },
  { key: 2, label: "Semifinals", short: "SF" },
  { key: 1, label: "Final", short: "F" },
];

type Category = "men" | "women";

export type TournamentBracketProps = {
  matches: NormalizedMatch[];
};

export default function TournamentBracket({
  matches,
}: TournamentBracketProps) {
  const availableCategories = useMemo<Category[]>(() => {
    const set = new Set<Category>();
    for (const m of matches) {
      if (m.category === "men" || m.category === "women") set.add(m.category);
    }
    const order: Category[] = [];
    if (set.has("men")) order.push("men");
    if (set.has("women")) order.push("women");
    return order;
  }, [matches]);

  const [category, setCategory] = useState<Category>(
    availableCategories[0] ?? "men",
  );

  // Bucket matches by round for the active category.
  const byRound = useMemo(() => {
    const map = new Map<number, NormalizedMatch[]>();
    for (const m of matches) {
      if (m.category !== category) continue;
      if (!BRACKET_ROUNDS.some((r) => r.key === m.round)) continue;
      if (!map.has(m.round)) map.set(m.round, []);
      map.get(m.round)!.push(m);
    }
    // Sort each round by match index (so the bracket reads top-to-bottom
    // in the API's intended order).
    for (const [, list] of map) {
      list.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    }
    return map;
  }, [matches, category]);

  const hasAnyBracketData = Array.from(byRound.values()).some(
    (list) => list.length > 0,
  );

  if (!hasAnyBracketData) {
    return (
      <div className="rounded-24 border border-border-primary bg-bg-white p-48 text-center">
        <p className="font-display text-20 font-bold uppercase tracking-[0.02em] text-text-primary">
          Bracket not published yet
        </p>
        <p className="mt-8 font-sans text-14 text-text-secondary">
          The draw for this tournament hasn&rsquo;t been released. Check back
          closer to the start date.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category toggle */}
      {availableCategories.length > 1 && (
        <div className="mb-24 inline-flex rounded-full border border-border-primary bg-bg-white p-4">
          {availableCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={[
                "rounded-full px-16 py-6 font-sans text-13 font-semibold capitalize transition-colors",
                category === c
                  ? "bg-brand text-text-contrast"
                  : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Bracket grid — horizontally scrollable on small screens */}
      <div className="-mx-16 overflow-x-auto px-16 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex min-w-[960px] gap-12">
          {BRACKET_ROUNDS.map((round) => {
            const list = byRound.get(round.key) ?? [];
            return (
              <div
                key={round.key}
                className="flex min-w-[180px] flex-1 flex-col"
              >
                <h3 className="mb-12 font-display text-12 font-bold uppercase tracking-[0.06em] text-text-secondary">
                  <span className="hidden md:inline">{round.label}</span>
                  <span className="md:hidden">{round.short}</span>
                </h3>
                <div className="flex flex-1 flex-col justify-around gap-12">
                  {list.length === 0 ? (
                    <RoundEmpty />
                  ) : (
                    list.map((m) => <BracketMatchCard key={m.id} match={m} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RoundEmpty() {
  return (
    <div className="rounded-12 border border-dashed border-border-primary bg-bg-white p-12 text-center">
      <p className="font-sans text-11 text-text-tertiary">TBD</p>
    </div>
  );
}

function BracketMatchCard({ match }: { match: NormalizedMatch }) {
  const isFinished = match.displayStatus === "finished";
  const isLive = match.displayStatus === "live";

  const winner1 = match.winner === "team_1";
  const winner2 = match.winner === "team_2";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group block rounded-12 border border-border-primary bg-bg-white p-10 transition-colors hover:bg-bg-gray"
    >
      <BracketTeamRow
        players={match.players.team_1}
        score={match.score?.map((s) => s.team_1) ?? []}
        isWinner={winner1}
        isLoser={isFinished && winner2}
      />
      <div className="my-4 h-px bg-border-primary" />
      <BracketTeamRow
        players={match.players.team_2}
        score={match.score?.map((s) => s.team_2) ?? []}
        isWinner={winner2}
        isLoser={isFinished && winner1}
      />
      {isLive && (
        <p className="mt-6 text-center font-sans text-10 font-bold uppercase tracking-[0.1em] text-brand">
          ● Live
        </p>
      )}
    </Link>
  );
}

function BracketTeamRow({
  players,
  score,
  isWinner,
  isLoser,
}: {
  players: MatchPlayer[];
  score: string[];
  isWinner: boolean;
  isLoser: boolean;
}) {
  const lastName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1];
  };
  const label =
    players.length > 0
      ? players.map((p) => lastName(p.name)).join(" / ")
      : "TBD";

  return (
    <div
      className={[
        "flex items-center justify-between gap-8",
        isLoser ? "text-text-tertiary" : "text-text-primary",
        isWinner ? "font-semibold" : "font-normal",
      ].join(" ")}
    >
      <span className="truncate font-sans text-13 leading-tight">{label}</span>
      <span className="shrink-0 font-mono text-12 tabular-nums">
        {score.length > 0 ? score.join(" ") : isWinner || isLoser ? "—" : ""}
      </span>
    </div>
  );
}
