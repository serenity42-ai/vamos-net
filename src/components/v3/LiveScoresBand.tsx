"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";
import MatchQuickViewModal from "@/components/v3/MatchQuickViewModal";

/**
 * LiveScoresBand — full-width dark band of currently live matches.
 *
 * Tapping a chip used to navigate to the full /matches/{id} page, which felt
 * heavy for the "I just want to peek at the current game" use case. Now opens
 * a MatchQuickViewModal overlay: instant render with the data we already
 * have, then live game score + player photos fill in. The tournament strip
 * inside the modal is the "open the full page" affordance.
 */

export interface LiveScoresBandProps {
  matches: NormalizedMatch[];
  tournaments?: Tournament[];
}

function shortName(name: string | undefined): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const first = parts[0]?.[0] ?? "";
  return `${first}. ${parts.slice(1).join(" ")}`;
}

function pairLabel(
  match: NormalizedMatch,
  side: "team_1" | "team_2",
): string {
  const players = match.players?.[side];
  if (!Array.isArray(players) || players.length === 0) return "—";
  return players.map((p) => shortName(p.name)).join(" / ");
}

function formatSetsCompact(match: NormalizedMatch): string {
  const sets = match.score;
  if (!Array.isArray(sets) || sets.length === 0) return "—";
  return sets
    .map((s) => {
      const t1 = s.team_1 ?? "-";
      const t2 = s.team_2 ?? "-";
      const a =
        typeof t1 === "number"
          ? String(t1)
          : String(t1).replace(/\(.*\)/, "");
      const b =
        typeof t2 === "number"
          ? String(t2)
          : String(t2).replace(/\(.*\)/, "");
      return `${a}-${b}`;
    })
    .join(" ");
}

function tournamentIdFromMatch(match: NormalizedMatch): number | null {
  const path = match.connections?.tournament;
  if (!path) return null;
  const last = path.split("/").pop();
  if (!last) return null;
  const n = parseInt(last, 10);
  return Number.isFinite(n) ? n : null;
}

export default function LiveScoresBand({
  matches,
  tournaments,
}: LiveScoresBandProps) {
  const live = (matches ?? []).filter((m) => m.displayStatus === "live");

  const tournamentLookup = new Map<number, Tournament>();
  for (const t of tournaments ?? []) tournamentLookup.set(t.id, t);

  const [openMatch, setOpenMatch] = useState<NormalizedMatch | null>(null);
  const openTournament = openMatch
    ? tournamentLookup.get(tournamentIdFromMatch(openMatch) ?? -1)
    : undefined;

  if (live.length === 0) return null;

  return (
    <>
      <section
        aria-label="Live scores"
        className="bg-bg-constant text-text-contrast"
      >
        <div className="mx-auto flex items-stretch max-w-[1440px] px-16 md:px-32 lg:px-48 py-12 gap-16">
          <div className="flex items-center gap-8 shrink-0 pr-16 border-r border-[var(--color-border-secondary)]">
            <span
              aria-hidden="true"
              className="inline-block live-dot rounded-full"
              style={{
                width: 8,
                height: 8,
                background: "var(--color-accent-lime, #D4FF3A)",
              }}
            />
            <span className="text-uppercase-eyebrow text-text-contrast">
              Live now
            </span>
          </div>

          <div className="flex-1 overflow-x-auto -mr-16 md:-mr-32 lg:-mr-48 pr-16 md:pr-32 lg:pr-48 scrollbar-hide">
            <ul className="flex items-center gap-24 min-w-max">
              {live.map((m) => {
                const tournamentId = tournamentIdFromMatch(m);
                const tournament = tournamentId
                  ? tournamentLookup.get(tournamentId)
                  : undefined;
                return (
                  <li key={m.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setOpenMatch(m)}
                      className="flex items-center gap-12 text-body-m transition-colors hover:text-brand"
                    >
                      <span className="truncate text-text-contrast">
                        {pairLabel(m, "team_1")}
                      </span>
                      <span
                        className="font-display font-semibold tabular-nums tracking-tight"
                        style={{
                          color: "var(--color-accent-lime, #D4FF3A)",
                        }}
                      >
                        {formatSetsCompact(m)}
                      </span>
                      <span className="truncate text-text-contrast">
                        {pairLabel(m, "team_2")}
                      </span>
                      {tournament && (
                        <span className="text-uppercase-eyebrow text-text-tertiary shrink-0">
                          {tournament.name}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <Link
            href="/scores"
            className="hidden md:inline-flex items-center gap-4 shrink-0 pl-16 border-l border-[var(--color-border-secondary)] text-uppercase-eyebrow text-text-contrast hover:text-brand transition-colors"
          >
            All scores
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </section>

      {openMatch && (
        <MatchQuickViewModal
          match={openMatch}
          tournament={openTournament}
          onClose={() => setOpenMatch(null)}
        />
      )}
    </>
  );
}
