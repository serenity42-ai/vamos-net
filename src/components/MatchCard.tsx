"use client";

import type { Match } from "@/lib/padel-api";
import { formatScore } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";
import StatusBadge from "@/components/StatusBadge";
import type { NormalizedMatch, DisplayStatus } from "@/lib/normalize-match";

/**
 * Editorial match card.
 *
 * Palette:
 *   paper (#F3EEE4)  — surface
 *   ink   (#151210)  — winner + chrome
 *   mute  (#8A7D71)  — loser + metadata
 *   red   (#C1443A)  — live highlights + schedule chips
 *   lime  (#D4FF3A)  — LIVE-only badge
 */

/** Render a set score, splitting tiebreak into superscript: "6(4)" → 6⁴ */
function SetScoreCell({ value, isWinner }: { value: string; isWinner: boolean }) {
  const tb = value.match(/^(\d+)\((\d+)\)$/);
  const color = isWinner ? "var(--ink)" : "var(--mute)";
  if (tb) {
    return (
      <span
        className="score-mono"
        style={{ fontSize: 15, color, textAlign: "center" }}
      >
        {tb[1]}
        <sup style={{ fontSize: 9, marginLeft: 1, color: "var(--mute)" }}>{tb[2]}</sup>
      </span>
    );
  }
  return (
    <span
      className="score-mono"
      style={{ fontSize: 15, color, textAlign: "center" }}
    >
      {value}
    </span>
  );
}

export default function MatchCard({
  match,
  tournamentName,
}: {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
}) {
  const { openMatch } = useMatchModal();
  const initialStatus = (match as NormalizedMatch).displayStatus || match.status;
  // Guard: even if the status says live, a declared winner means finished.
  const isLive = initialStatus === "live" && !match.winner;
  const { score, currentPoint, status } = useLiveScore(
    match.id,
    isLive,
    match.score,
    initialStatus
  );

  // Drop empty / 0-0 in-progress sets so we never render a fake '0 0' set.
  const displayScore = score?.filter((s) => {
    const a = (s.team_1 ?? "").toString().trim();
    const b = (s.team_2 ?? "").toString().trim();
    if (!a && !b) return false;
    if (a === "0" && b === "0") return false;
    return true;
  }) ?? null;
  const displayStatus = status as DisplayStatus;
  const scoreStr = formatScore(displayScore);
  const team1Label = teamName(match.players.team_1);
  const team2Label = teamName(match.players.team_2);

  return (
    <div
      className="transition-colors cursor-pointer group"
      style={{
        background: "var(--paper)",
        border: `1px solid ${displayStatus === "live" ? "var(--red)" : "var(--ink)"}`,
      }}
      onClick={() => openMatch(match, tournamentName)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") openMatch(match, tournamentName);
      }}
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-between gap-2"
        style={{
          padding: "10px 16px",
          background: "var(--paper-2)",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div
          className="flex items-center gap-2 min-w-0"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {tournamentName && (
            <span style={{ color: "var(--ink)" }} className="truncate">
              {tournamentName}
            </span>
          )}
          <span style={{ color: "var(--mute)" }} className="shrink-0">
            / {match.round_name}
          </span>
        </div>
        <div className="shrink-0">
          <StatusBadge
            status={displayStatus}
            currentPoint={isLive ? currentPoint : null}
            variant="compact"
          />
        </div>
      </div>

      {/* Teams + scores */}
      <div className="p-5 space-y-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between gap-3">
          <p
            className="truncate flex-1 min-w-0"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: match.winner === "team_1" ? 800 : 600,
              color: match.winner === "team_2" ? "var(--mute)" : "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {team1Label}
          </p>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell
                  key={i}
                  value={s.team_1}
                  isWinner={parseInt(s.team_1) > parseInt(s.team_2)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between gap-3">
          <p
            className="truncate flex-1 min-w-0"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 14,
              fontWeight: match.winner === "team_2" ? 800 : 600,
              color: match.winner === "team_1" ? "var(--mute)" : "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            {team2Label}
          </p>
          {displayScore && displayScore.length > 0 && (
            <div className="flex gap-3 shrink-0">
              {displayScore.map((s, i) => (
                <SetScoreCell
                  key={i}
                  value={s.team_2}
                  isWinner={parseInt(s.team_2) > parseInt(s.team_1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Full score string (duration) */}
        {scoreStr && (
          <p
            className="truncate pt-2"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.05em",
              color: "var(--mute)",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {scoreStr}
            {match.duration && (
              <span style={{ color: "var(--mute)", marginLeft: 10 }}>
                · {match.duration}
              </span>
            )}
          </p>
        )}

        {/* Schedule / court for scheduled */}
        {displayStatus === "scheduled" && (
          <div
            className="flex items-center gap-2 pt-2"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.08)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.05em",
            }}
          >
            {match.schedule_label ? (
              <span style={{ color: "var(--red)", fontWeight: 700 }}>
                {match.schedule_label}
              </span>
            ) : (
              <span style={{ color: "var(--mute)" }}>{match.played_at}</span>
            )}
            {match.court && (
              <>
                <span style={{ color: "var(--mute)" }}>·</span>
                <span style={{ color: "var(--mute)" }}>{match.court}</span>
              </>
            )}
          </div>
        )}

        {/* Court for live */}
        {displayStatus === "live" && match.court && (
          <p
            className="pt-2"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.08)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.05em",
              color: "var(--mute)",
            }}
          >
            {match.court}
          </p>
        )}

        {/* Category chip */}
        <div className="pt-1">
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--mono)",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "3px 7px",
              color: match.category === "women" ? "#A83362" : "var(--ink)",
              border: `1px solid ${match.category === "women" ? "#A83362" : "var(--ink)"}`,
            }}
          >
            {match.category}
          </span>
        </div>
      </div>
    </div>
  );
}
