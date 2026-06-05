"use client";

/**
 * MatchCard (v3) — mobile match card, 382×118 from Figma.
 *
 * Layout (Figma MatchCard component set, id=624:16162):
 *  - White surface, rounded-16, 1px border-primary, p=12/8
 *  - Two pair rows stacked vertically (Names left, Scores right)
 *  - Status pill on the right column (LIVE for live, FT for finished, time for upcoming)
 *  - For live: orange ball icon next to the serving pair, current point chip
 *  - Score values flash orange for 5s when they change (`.live-flash`)
 *
 * Props are kept compatible with the existing MatchCard so pages don't need rewiring:
 *   <MatchCard match={...} tournamentName="..." />
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Match, SetScore } from "@/lib/padel-api";
import type { DisplayStatus, NormalizedMatch } from "@/lib/normalize-match";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";
import StatusBadge from "./StatusBadge";

interface MatchCardProps {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
  /** Optional click handler — wire to a modal opener if you have one. */
  onSelect?: (match: Match) => void;
}

function formatTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return null;
  }
}

function isWin(a: string, b: string): boolean {
  const ai = parseInt(a, 10);
  const bi = parseInt(b, 10);
  if (Number.isNaN(ai) || Number.isNaN(bi)) return false;
  return ai > bi;
}

function SetCell({
  value,
  win,
  flash,
}: {
  value: string;
  win: boolean;
  flash: boolean;
}) {
  const tb = value?.match?.(/^(\d+)\((\d+)\)$/);
  return (
    <span
      className={[
        "inline-flex items-center justify-center font-display font-semibold tabular-nums rounded-4",
        "min-w-[20px] h-24 px-4",
        win ? "text-text-primary" : "text-text-tertiary",
        flash ? "live-flash" : "",
      ].join(" ")}
      style={{ fontSize: 16, lineHeight: "22px" }}
    >
      {tb ? (
        <>
          {tb[1]}
          <sup className="ml-[1px] text-text-tertiary" style={{ fontSize: 10 }}>
            {tb[2]}
          </sup>
        </>
      ) : (
        value || "–"
      )}
    </span>
  );
}

/** Track last score-string per index; when it changes, set a flash flag for 5s. */
function useFlashOnChange(scores: SetScore[] | null) {
  const [flashIdx, setFlashIdx] = useState<Set<string>>(new Set());
  const prev = useRef<string>("");
  useEffect(() => {
    if (!scores) return;
    const next = JSON.stringify(scores);
    if (prev.current && prev.current !== next) {
      // Mark every cell as flashing; let CSS animation fade them.
      const ids = new Set<string>();
      scores.forEach((_, i) => {
        ids.add(`t1-${i}`);
        ids.add(`t2-${i}`);
      });
      setFlashIdx(ids);
      const handle = setTimeout(() => setFlashIdx(new Set()), 5000);
      prev.current = next;
      return () => clearTimeout(handle);
    }
    prev.current = next;
  }, [scores]);
  return flashIdx;
}

export default function MatchCard({ match, tournamentName, onSelect }: MatchCardProps) {
  const initialStatus =
    (match as NormalizedMatch).displayStatus || match.status;
  const isLive = initialStatus === "live" && !match.winner;
  const { score, currentPoint, status } = useLiveScore(
    match.id,
    isLive,
    match.score,
    initialStatus,
  );

  const displayStatus = (status || initialStatus) as DisplayStatus;
  const displayScore = useMemo(
    () =>
      score?.filter((s) => {
        const a = (s.team_1 ?? "").toString().trim();
        const b = (s.team_2 ?? "").toString().trim();
        if (!a && !b) return false;
        if (a === "0" && b === "0") return false;
        return true;
      }) ?? null,
    [score],
  );

  const flashing = useFlashOnChange(displayScore);

  // Which pair is serving? We don't have a direct serving flag on Match,
  // but a heuristic: highlight team_1 by default when no signal is available.
  // (The redesign spec notes "current_server?: 1 | 2" lives on the Pair,
  // which our existing Match type doesn't expose — leave undefined.)
  const servingTeam: 1 | 2 | null = null;

  const team1Label = teamName(match.players.team_1);
  const team2Label = teamName(match.players.team_2);

  const timeLabel = formatTime(match.played_at);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(match)}
      className={[
        "group w-full text-left",
        "bg-bg-white rounded-16 border border-border-primary",
        "transition-colors hover:bg-bg-gray/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        "block",
      ].join(" ")}
    >
      {/* Header: tournament label + status */}
      <div className="flex items-center justify-between gap-8 px-12 pt-8">
        <p className="truncate font-sans text-12 font-semibold text-text-secondary tracking-[0.04em]">
          {tournamentName ? (
            <>
              <span className="text-text-primary">{tournamentName}</span>
              <span className="mx-4 text-text-tertiary">/</span>
              <span>{match.round_name}</span>
            </>
          ) : (
            <span>{match.round_name}</span>
          )}
        </p>
        <StatusBadge
          status={displayStatus}
          currentPoint={isLive ? currentPoint : null}
          timeLabel={displayStatus === "scheduled" ? timeLabel : null}
          variant="compact"
        />
      </div>

      {/* Two pair rows */}
      <div className="relative px-12 pb-8 pt-4">
        {/* Animated serving-ball indicator (S1) — only rendered when current_server is known. */}
        {isLive && servingTeam !== null && (
          <span
            aria-label="serving"
            aria-hidden
            className="absolute left-12 inline-block rounded-full bg-brand shrink-0 pointer-events-none"
            style={{
              width: 8,
              height: 8,
              top: 16,
              transform: `translateY(${(servingTeam - 1) * 40}px)`,
              transition: "transform 200ms ease",
            }}
          />
        )}
        {([1, 2] as const).map((teamIdx) => {
          const players =
            teamIdx === 1 ? match.players.team_1 : match.players.team_2;
          const label = teamIdx === 1 ? team1Label : team2Label;
          // S2 — determine winner from score sets when displayStatus=finished,
          // falling back to match.winner when available.
          const isFinished = displayStatus === "finished";
          let winnerKey: "team_1" | "team_2" | null = match.winner ?? null;
          if (isFinished && !winnerKey && displayScore && displayScore.length > 0) {
            let s1 = 0;
            let s2 = 0;
            for (const s of displayScore) {
              if (isWin(s.team_1, s.team_2)) s1++;
              else if (isWin(s.team_2, s.team_1)) s2++;
            }
            if (s1 > s2) winnerKey = "team_1";
            else if (s2 > s1) winnerKey = "team_2";
          }
          const isWinner =
            (teamIdx === 1 && winnerKey === "team_1") ||
            (teamIdx === 2 && winnerKey === "team_2");
          const isLoser = !!winnerKey && !isWinner;
          return (
            <div
              key={teamIdx}
              className="flex items-center justify-between gap-8 h-40"
              style={
                teamIdx === 2
                  ? { borderTop: "1px solid var(--color-border-primary)" }
                  : undefined
              }
            >
              {/* Names — leave room on the left for the absolutely-positioned ball icon */}
              <div
                className="flex items-center gap-8 min-w-0 flex-1"
                style={
                  isLive && servingTeam !== null ? { paddingLeft: 16 } : undefined
                }
              >
                <div className="min-w-0">
                  <p
                    className={[
                      "truncate font-sans text-14 leading-20",
                      isFinished && isLoser
                        ? "text-text-secondary"
                        : isLoser
                          ? "text-text-tertiary"
                          : "text-text-primary",
                      isWinner ? "font-semibold" : "font-normal",
                    ].join(" ")}
                  >
                    {label}
                  </p>
                  {/* Optional second-line: player count for doubles */}
                  {players.length > 1 && (
                    <p
                      className={[
                        "truncate font-sans text-12",
                        isFinished && isLoser
                          ? "text-text-tertiary"
                          : "text-text-tertiary",
                      ].join(" ")}
                    >
                      {players.map((p) => {
                        const parts = (p?.name ?? "").trim().split(/\s+/).filter(Boolean);
                        return parts.length ? parts[parts.length - 1] : "TBD";
                      }).join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              {/* Set scores */}
              <div className="flex items-center gap-8 shrink-0">
                {displayScore && displayScore.length > 0 ? (
                  displayScore.map((s, i) => {
                    const myVal = teamIdx === 1 ? s.team_1 : s.team_2;
                    const oppVal = teamIdx === 1 ? s.team_2 : s.team_1;
                    return (
                      <SetCell
                        key={i}
                        value={myVal}
                        win={isWin(myVal, oppVal)}
                        flash={flashing.has(`t${teamIdx}-${i}`)}
                      />
                    );
                  })
                ) : (
                  <span className="font-display text-text-tertiary text-16 tabular-nums">
                    –
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
