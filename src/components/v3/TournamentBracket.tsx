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
 * R16, 4 = QF, 2 = SF, 1 = Final).
 *
 * Byes (one team blank, opponent auto-advances) are rendered as
 * single-row cards so the column still has the right structural count.
 *
 * Visual: each match card is a fixed-height block, and CSS pseudo-elements
 * draw the classic ┐ ┘ connector lines from each card to its parent in the
 * next column. Columns past R32 use `justify-around` with doubled gaps so
 * matches align with the midpoint of their two children.
 *
 * Category toggle (Men / Women) shows the right draw — hidden when only one
 * category is present.
 */

const BRACKET_ROUNDS: Array<{ key: number; label: string; short: string }> = [
  { key: 16, label: "Round of 32", short: "R32" }, // 16 matches per draw side
  { key: 8, label: "Round of 16", short: "R16" },
  { key: 4, label: "Quarterfinals", short: "QF" },
  { key: 2, label: "Semifinals", short: "SF" },
  { key: 1, label: "Final", short: "F" },
];

// Card height + vertical gap baseline. Tuned so cards in column N align with
// the midpoint of the pair below in column N-1.
const CARD_HEIGHT = 64; // px

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

  // Bucket matches by round for the active category, sorted by index.
  const byRound = useMemo(() => {
    const map = new Map<number, NormalizedMatch[]>();
    for (const m of matches) {
      if (m.category !== category) continue;
      if (!BRACKET_ROUNDS.some((r) => r.key === m.round)) continue;
      if (!map.has(m.round)) map.set(m.round, []);
      map.get(m.round)!.push(m);
    }
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

      {/* Round headers — fixed strip above the scroll area */}
      <div className="-mx-16 overflow-x-auto px-16 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex min-w-[960px] gap-0">
          {BRACKET_ROUNDS.map((round) => (
            <div
              key={`h-${round.key}`}
              className="flex-1 min-w-[180px] pr-24"
            >
              <h3 className="mb-12 font-display text-12 font-bold uppercase tracking-[0.06em] text-text-secondary">
                <span className="hidden md:inline">{round.label}</span>
                <span className="md:hidden">{round.short}</span>
              </h3>
            </div>
          ))}
        </div>

        {/* Bracket body — each column is justify-around so cards space
            evenly inside their column, lining up pairs with parents. */}
        <div className="flex min-w-[960px] gap-0">
          {BRACKET_ROUNDS.map((round, columnIdx) => {
            const list = byRound.get(round.key) ?? [];
            // Each column doubles its match density relative to the next:
            // R32 has 16 cells, R16 has 8, QF has 4, SF has 2, F has 1.
            // We set a min-height so the column is tall enough to space cards
            // evenly with justify-around.
            const expectedCount = round.key;
            return (
              <div
                key={round.key}
                className="relative flex flex-1 min-w-[180px] flex-col justify-around pr-24"
                style={{
                  minHeight: expectedCount * CARD_HEIGHT * 1.4,
                }}
              >
                {list.length === 0
                  ? Array.from({ length: expectedCount }).map((_, i) => (
                      <PlaceholderCard key={`ph-${i}`} />
                    ))
                  : list.map((m, idx) => (
                      <BracketMatchCard
                        key={m.id}
                        match={m}
                        showConnectorRight={columnIdx < BRACKET_ROUNDS.length - 1}
                        connectorDirection={idx % 2 === 0 ? "down" : "up"}
                      />
                    ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard() {
  return (
    <div
      className="rounded-8 border border-dashed border-border-primary bg-bg-white px-10 py-8 text-center"
      style={{ minHeight: CARD_HEIGHT - 8 }}
    >
      <p className="mt-4 font-sans text-11 text-text-tertiary">TBD</p>
    </div>
  );
}

function BracketMatchCard({
  match,
  showConnectorRight,
  connectorDirection,
}: {
  match: NormalizedMatch;
  showConnectorRight: boolean;
  connectorDirection: "up" | "down";
}) {
  const isBye = match.status === "bye";
  const isFinished = match.displayStatus === "finished" || isBye;
  const isLive = match.displayStatus === "live";

  const winner1 = match.winner === "team_1";
  const winner2 = match.winner === "team_2";

  // Bye case: render only the advancing team, no opponent row.
  const team1HasPlayers = match.players.team_1.length > 0;
  const team2HasPlayers = match.players.team_2.length > 0;

  return (
    <div className="relative">
      {/* Right-side connector: short horizontal line out of the card, then a
          vertical segment going up or down to meet the sibling match. */}
      {showConnectorRight && (
        <>
          <span
            aria-hidden="true"
            className="absolute right-[-24px] top-1/2 h-px w-24 bg-border-primary"
          />
          <span
            aria-hidden="true"
            className={[
              "absolute right-[-24px] w-px bg-border-primary",
              connectorDirection === "down" ? "top-1/2 h-1/2" : "bottom-1/2 h-1/2",
            ].join(" ")}
            style={{
              // Vertical segment extends past the half-height to reach the
              // midpoint between this card and its sibling.
              height: `calc(50% + ${CARD_HEIGHT / 2}px)`,
            }}
          />
        </>
      )}

      <Link
        href={`/matches/${match.id}`}
        className="group block rounded-8 border border-border-primary bg-bg-white p-8 transition-colors hover:bg-bg-gray"
        style={{ minHeight: CARD_HEIGHT - 8 }}
      >
        {team1HasPlayers && (
          <BracketTeamRow
            players={match.players.team_1}
            score={match.score?.map((s) => s.team_1) ?? []}
            isWinner={winner1}
            isLoser={isFinished && winner2}
          />
        )}
        {team1HasPlayers && team2HasPlayers && (
          <div className="my-3 h-px bg-border-primary" />
        )}
        {team2HasPlayers && (
          <BracketTeamRow
            players={match.players.team_2}
            score={match.score?.map((s) => s.team_2) ?? []}
            isWinner={winner2}
            isLoser={isFinished && winner1}
          />
        )}
        {isBye && (
          <p className="mt-2 text-right font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            Bye
          </p>
        )}
        {isLive && (
          <p className="mt-2 text-center font-sans text-10 font-bold uppercase tracking-[0.1em] text-brand">
            ● Live
          </p>
        )}
      </Link>
    </div>
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
        "flex items-center justify-between gap-8 py-2",
        isLoser ? "text-text-tertiary" : "text-text-primary",
        isWinner ? "font-semibold" : "font-normal",
      ].join(" ")}
    >
      <span className="truncate font-sans text-13 leading-tight">{label}</span>
      <span className="shrink-0 font-mono text-11 tabular-nums">
        {score.length > 0
          ? score.join(" ")
          : isWinner || isLoser
            ? "—"
            : ""}
      </span>
    </div>
  );
}
