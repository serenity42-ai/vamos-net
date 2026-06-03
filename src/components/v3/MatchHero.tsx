"use client";

/**
 * MatchHero (v3) — full-width hero for /matches/[id].
 *
 * Figma: MatchHero component set (id=858:55745).
 *  - Dark background (bg-constant), white text
 *  - Back chevron at top-left
 *  - Tournament + round + date/time + court eyebrows
 *  - Two pair blocks with player photos, names, nationality badges
 *  - Big set-score grid + current-game indicator
 *  - LIVE pulse when applicable
 *
 * Prop signature:
 *   <MatchHero match={...} tournamentName="..." onBack={() => ...} />
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Match, MatchPlayer, Player } from "@/lib/padel-api";
import type { DisplayStatus, NormalizedMatch } from "@/lib/normalize-match";
import { displaySurname } from "@/lib/player-utils";
import { useLiveScore } from "@/hooks/useLiveScore";
import StatusBadge from "./StatusBadge";
import IconButton from "@/components/IconButton";

interface MatchHeroProps {
  match: Match & { displayStatus?: DisplayStatus };
  tournamentName?: string;
  onBack?: () => void;
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroAvatar({
  player,
  detail,
  size = 88,
}: {
  player: MatchPlayer;
  detail?: Player;
  size?: number;
}) {
  const initials =
    player.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "—";
  const photo = detail?.photo_url;
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--color-bg-overlay)",
        border: "2px solid var(--color-border-secondary)",
      }}
    >
      {photo ? (
        <Image src={photo} alt={player.name} width={size} height={size} className="object-cover w-full h-full" />
      ) : (
        <span className="font-display font-semibold text-text-contrast" style={{ fontSize: 20 }}>
          {initials}
        </span>
      )}
    </div>
  );
}

function isWin(a: string, b: string): boolean {
  const ai = parseInt(a, 10);
  const bi = parseInt(b, 10);
  if (Number.isNaN(ai) || Number.isNaN(bi)) return false;
  return ai > bi;
}

export default function MatchHero({ match, tournamentName, onBack }: MatchHeroProps) {
  const initialStatus = (match as NormalizedMatch).displayStatus || match.status;
  const isLive = initialStatus === "live" && !match.winner;
  const { score: liveScore, currentPoint, status } = useLiveScore(
    match.id,
    isLive,
    match.score,
    initialStatus,
  );
  const displayStatus = (status || initialStatus) as DisplayStatus;

  const [playerDetails, setPlayerDetails] = useState<Map<number, Player>>(new Map());
  useEffect(() => {
    const ids = [...match.players.team_1, ...match.players.team_2]
      .map((p) => p.id)
      .filter((id) => id && !Number.isNaN(id));
    if (ids.length === 0) return;
    let cancelled = false;
    Promise.allSettled(
      ids.map((id) =>
        fetch(`/api/players/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const map = new Map<number, Player>();
      results.forEach((r, i) => {
        if (r.status === "fulfilled" && r.value && !("error" in r.value)) {
          map.set(ids[i], r.value as Player);
        }
      });
      setPlayerDetails(map);
    });
    return () => {
      cancelled = true;
    };
  }, [match.id, match.players.team_1, match.players.team_2]);

  const score =
    liveScore?.filter((s) => {
      const a = (s.team_1 ?? "").toString().trim();
      const b = (s.team_2 ?? "").toString().trim();
      if (!a && !b) return false;
      if (a === "0" && b === "0") return false;
      return true;
    }) ?? null;

  const dateLabel = match.played_at
    ? new Date(match.played_at).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const teams: Array<{
    players: MatchPlayer[];
    key: "team_1" | "team_2";
    isWinner: boolean;
  }> = [
    {
      players: match.players.team_1,
      key: "team_1",
      isWinner: match.winner === "team_1",
    },
    {
      players: match.players.team_2,
      key: "team_2",
      isWinner: match.winner === "team_2",
    },
  ];

  return (
    <section
      className="w-full bg-bg-constant text-text-contrast rounded-32 overflow-hidden relative"
      style={{ minHeight: 411 }}
    >
      {/* Top bar: back + eyebrows + status */}
      <div className="flex items-start justify-between gap-16 px-20 pt-20 sm:px-32 sm:pt-32">
        <div className="flex items-start gap-12 min-w-0">
          {onBack && (
            <IconButton
              variant="ghost-dark"
              size="md"
              icon={<ChevronLeft />}
              label="Back"
              onClick={onBack}
            />
          )}
          <div className="min-w-0">
            {tournamentName && (
              <p className="truncate font-sans text-12 font-semibold text-brand uppercase tracking-[0.06em]">
                {tournamentName}
              </p>
            )}
            <h1 className="font-display font-semibold uppercase mt-4 text-text-contrast text-28 sm:text-32 leading-none">
              {match.round_name}
            </h1>
            <p className="mt-8 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-tertiary flex items-center gap-8 flex-wrap">
              {dateLabel && <span>{dateLabel}</span>}
              {match.court && (
                <>
                  <span aria-hidden>·</span>
                  <span>{match.court}</span>
                </>
              )}
              {match.duration && (
                <>
                  <span aria-hidden>·</span>
                  <span>{match.duration}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <StatusBadge
          status={displayStatus}
          currentPoint={isLive ? currentPoint : null}
          variant="default"
        />
      </div>

      {/* Pair blocks + score */}
      <div className="px-20 pb-24 pt-24 sm:px-32 sm:pb-32 sm:pt-32 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-24 items-center">
        {teams.map(({ players, key, isWinner }, idx) => {
          const isLoser = !!match.winner && !isWinner;
          const alignRight = idx === 1;
          return (
            <div
              key={key}
              className={[
                "flex items-center gap-16 min-w-0",
                alignRight ? "sm:flex-row-reverse sm:text-right" : "",
              ].join(" ")}
              style={{ gridColumn: idx === 0 ? "1 / 2" : "3 / 4" }}
            >
              <div className={["flex shrink-0", alignRight ? "-space-x-12" : "-space-x-12"].join(" ")}>
                {players.map((p) => (
                  <HeroAvatar key={p.id} player={p} detail={playerDetails.get(p.id)} size={72} />
                ))}
              </div>
              <div className="min-w-0">
                <p
                  className={[
                    "font-display font-semibold uppercase truncate",
                    isLoser ? "text-text-tertiary" : "text-text-contrast",
                  ].join(" ")}
                  style={{ fontSize: 24, lineHeight: "28px" }}
                >
                  {players.length > 0
                    ? players.map((p) => displaySurname(p.name)).join(" / ")
                    : "TBD"}
                </p>
                <div className={["flex items-center gap-8 mt-8 flex-wrap", alignRight ? "sm:justify-end" : ""].join(" ")}>
                  {players.map((p) => {
                    const detail = playerDetails.get(p.id);
                    if (!detail?.nationality) return null;
                    return (
                      <span
                        key={p.id}
                        className="inline-flex items-center font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-contrast rounded-4 px-8 py-4"
                        style={{ background: "var(--color-bg-overlay)" }}
                      >
                        {detail.nationality.toUpperCase()}
                      </span>
                    );
                  })}
                  {isWinner && (
                    <span className="inline-flex items-center font-sans text-12 font-semibold uppercase tracking-[0.06em] text-brand">
                      ✓ WON
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Center score column */}
        <div
          className="flex flex-col items-center justify-center gap-12"
          style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}
        >
          {score && score.length > 0 ? (
            <div className="flex items-center gap-16">
              <div className="flex flex-col items-center gap-8">
                {score.map((s, i) => {
                  const win = isWin(s.team_1, s.team_2);
                  return (
                    <span
                      key={`t1-${i}`}
                      className={[
                        "font-display font-semibold tabular-nums",
                        win ? "text-text-contrast" : "text-text-tertiary",
                      ].join(" ")}
                      style={{ fontSize: 40, lineHeight: "40px" }}
                    >
                      {s.team_1 || "–"}
                    </span>
                  );
                })}
              </div>
              <div className="w-px h-full bg-border-secondary" aria-hidden />
              <div className="flex flex-col items-center gap-8">
                {score.map((s, i) => {
                  const win = isWin(s.team_2, s.team_1);
                  return (
                    <span
                      key={`t2-${i}`}
                      className={[
                        "font-display font-semibold tabular-nums",
                        win ? "text-text-contrast" : "text-text-tertiary",
                      ].join(" ")}
                      style={{ fontSize: 40, lineHeight: "40px" }}
                    >
                      {s.team_2 || "–"}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <span className="font-display font-semibold text-text-tertiary" style={{ fontSize: 40 }}>
              vs
            </span>
          )}

          {isLive && currentPoint && (
            <span className="inline-flex items-center gap-8 font-display font-semibold text-text-contrast bg-brand rounded-full px-12 py-4 text-14 tabular-nums">
              <span className="live-dot inline-block rounded-full bg-text-contrast" style={{ width: 6, height: 6 }} />
              {currentPoint}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
