import Link from "next/link";
import type { Tournament } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

/**
 * LiveScoresBand — full-width dark band of currently live matches.
 *
 * Spec (Figma homepage annotation 306:82483 + banner TodayMatchesDesktop):
 *   - Dark band (bg-bg-constant), orange "LIVE" badge on the left
 *   - Horizontal-scrollable strip of currently live matches
 *   - Each match: "Pair 1 / 6-3 2-6 1-2 / Pair 2"
 *   - Hides entirely if no live matches.
 *
 * Where it lives: homepage, between the hero carousel and the LAST NEWS
 * section. Provides Alex's expected "Spotlight shows live scores when
 * tournaments are running" behavior.
 */

export interface LiveScoresBandProps {
  matches: NormalizedMatch[];
  tournaments?: Tournament[];
}

function shortName(name: string | undefined): string {
  if (!name) return "—";
  // Convert "Agustin Tapia" → "A. Tapia"
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const first = parts[0]?.[0] ?? "";
  return `${first}. ${parts.slice(1).join(" ")}`;
}

function pairLabel(match: NormalizedMatch, side: "team_1" | "team_2"): string {
  const players = match.players?.[side];
  if (!Array.isArray(players) || players.length === 0) return "—";
  // Compact: just surname or initial + surname for both
  const names = players.map((p) => shortName(p.name));
  return names.join(" / ");
}

function formatSetsCompact(match: NormalizedMatch): string {
  const sets = match.score;
  if (!Array.isArray(sets) || sets.length === 0) return "—";
  return sets
    .map((s) => {
      const t1 = s.team_1 ?? "-";
      const t2 = s.team_2 ?? "-";
      // Tiebreak markers like 7-6(3) → render as "7-6"
      const a = typeof t1 === "number" ? String(t1) : String(t1).replace(/\(.*\)/, "");
      const b = typeof t2 === "number" ? String(t2) : String(t2).replace(/\(.*\)/, "");
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

export default function LiveScoresBand({ matches, tournaments }: LiveScoresBandProps) {
  // Only show currently live matches
  const live = (matches ?? []).filter(
    (m) => m.displayStatus === "live"
  );

  if (live.length === 0) return null;

  // Map match → tournament name (for the link)
  const tournamentLookup = new Map<number, Tournament>();
  for (const t of tournaments ?? []) tournamentLookup.set(t.id, t);

  return (
    <section
      aria-label="Live scores"
      className="bg-bg-constant text-text-contrast"
    >
      <div className="mx-auto flex items-stretch max-w-[1440px] px-16 md:px-32 lg:px-48 py-12 gap-16">
        {/* LIVE badge */}
        <div className="flex items-center gap-8 shrink-0 pr-16 border-r border-[var(--color-border-secondary)]">
          <span
            aria-hidden="true"
            className="inline-block live-dot rounded-full"
            style={{ width: 8, height: 8, background: "var(--color-brand-primary)" }}
          />
          <span className="text-uppercase-eyebrow text-text-contrast">
            Live now
          </span>
        </div>

        {/* Horizontal scroller of live match chips */}
        <div className="flex-1 overflow-x-auto -mr-16 md:-mr-32 lg:-mr-48 pr-16 md:pr-32 lg:pr-48 scrollbar-hide">
          <ul className="flex items-center gap-24 min-w-max">
            {live.map((m) => {
              const tournamentId = tournamentIdFromMatch(m);
              const tournament = tournamentId
                ? tournamentLookup.get(tournamentId)
                : undefined;
              const href = `/matches/${m.id}`;
              return (
                <li key={m.id} className="shrink-0">
                  <Link
                    href={href}
                    className="flex items-center gap-12 text-body-m hover:text-brand transition-colors"
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* All scores link */}
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
  );
}
