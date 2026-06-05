"use client";

/**
 * MatchCardDesktop (v3) — desktop match row, 791×72 from Figma.
 *
 * Layout (Figma MatchCardDesktop component set, id=788:27547):
 *  - Single row, white surface, rounded-16 or pill, 1px border-primary
 *  - LEFT: Status column (LIVE pill / FT chip / time) – fixed width
 *  - MIDDLE: two stacked pair rows (names + scores per row), divider between
 *  - RIGHT: optional accent / star (omitted here, callers can wrap)
 *
 * Keeps prop signature stable with the existing card:
 *   <MatchCardDesktop match={...} tournamentName="..." />
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { Match, SetScore } from "@/lib/padel-api";
import type { DisplayStatus, NormalizedMatch } from "@/lib/normalize-match";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";
import { scheduledMatchTime, formatScheduledTimeShort } from "@/lib/match-time";
import StatusBadge from "./StatusBadge";

interface MatchCardDesktopProps {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
  onSelect?: (match: Match) => void;
}

// Time formatting lives in src/lib/match-time.ts (schedule_label-first).

function isWin(a: string, b: string): boolean {
  const ai = parseInt(a, 10);
  const bi = parseInt(b, 10);
  if (Number.isNaN(ai) || Number.isNaN(bi)) return false;
  return ai > bi;
}

function SetCell({ value, win, flash }: { value: string; win: boolean; flash: boolean }) {
  const tb = value?.match?.(/^(\d+)\((\d+)\)$/);
  return (
    <span
      className={[
        "inline-flex items-center justify-center font-display font-semibold tabular-nums rounded-4",
        "min-w-[24px] h-24 px-4",
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

function useFlashOnChange(scores: SetScore[] | null) {
  const [flashIdx, setFlashIdx] = useState<Set<string>>(new Set());
  const prev = useRef<string>("");
  useEffect(() => {
    if (!scores) return;
    const next = JSON.stringify(scores);
    if (prev.current && prev.current !== next) {
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

export default function MatchCardDesktop({
  match,
  tournamentName,
  onSelect,
}: MatchCardDesktopProps) {
  const initialStatus = (match as NormalizedMatch).displayStatus || match.status;
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

  const team1Label = teamName(match.players.team_1);
  const team2Label = teamName(match.players.team_2);
  const scheduledTime = scheduledMatchTime(match, displayStatus);
  const timeLabel = formatScheduledTimeShort(scheduledTime);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(match)}
      className={[
        "group w-full text-left",
        "flex items-stretch gap-12",
        "bg-bg-white rounded-16 border border-border-primary",
        "transition-colors hover:bg-bg-gray/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        "px-12 py-12",
      ].join(" ")}
      style={{ minHeight: 72 }}
    >
      {/* Status column */}
      <div className="flex items-center justify-center shrink-0" style={{ minWidth: 76 }}>
        <StatusBadge
          status={displayStatus}
          currentPoint={isLive ? currentPoint : null}
          timeLabel={displayStatus === "scheduled" ? timeLabel : null}
          variant="default"
        />
      </div>

      {/* Tournament/round eyebrow + pair rows */}
      <div className="flex-1 min-w-0">
        {(tournamentName || match.round_name) && (
          <p className="truncate font-sans text-12 font-semibold text-text-secondary tracking-[0.04em] mb-4">
            {tournamentName && <span className="text-text-primary">{tournamentName}</span>}
            {tournamentName && match.round_name && (
              <span className="mx-4 text-text-tertiary">/</span>
            )}
            {match.round_name && <span>{match.round_name}</span>}
          </p>
        )}

        {([1, 2] as const).map((teamIdx) => {
          const players = teamIdx === 1 ? match.players.team_1 : match.players.team_2;
          const label = teamIdx === 1 ? team1Label : team2Label;
          // S2 — derive winner from set scores when finished, fall back to match.winner.
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
              className="flex items-center justify-between gap-12 h-24"
              style={
                teamIdx === 2
                  ? { borderTop: "1px solid var(--color-border-primary)", paddingTop: 4, marginTop: 4 }
                  : undefined
              }
            >
              <p
                className={[
                  "truncate font-sans text-14 leading-20 flex-1 min-w-0",
                  isFinished && isLoser
                    ? "text-text-secondary"
                    : isLoser
                      ? "text-text-tertiary"
                      : "text-text-primary",
                  isWinner ? "font-semibold" : "font-normal",
                ].join(" ")}
              >
                {label}
                {players.length > 1 && (
                  <span className="text-text-tertiary"> · {players.length}</span>
                )}
              </p>
              <div className="flex items-center gap-12 shrink-0">
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
                  <span className="font-display text-text-tertiary text-16 tabular-nums">–</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
