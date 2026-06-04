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

function PairBlock({
  players,
  playerDetails,
  isLoser,
  isWinner,
  alignRight,
}: {
  players: MatchPlayer[];
  playerDetails: Map<number, Player>;
  isLoser: boolean;
  isWinner: boolean;
  alignRight: boolean;
}) {
  // On mobile we always render left-aligned (avatar row + name). On sm+ we
  // mirror the right team so it aligns toward the score in the middle.
  return (
    <div
      className={[
        "flex items-center gap-16 min-w-0",
        alignRight ? "sm:flex-row-reverse sm:text-right" : "",
      ].join(" ")}
    >
      <div className="flex shrink-0 -space-x-12 relative">
        {players.map((p, i) => (
          <div key={p.id} className="relative" style={{ zIndex: i + 1 }}>
            <HeroAvatar
              player={p}
              detail={playerDetails.get(p.id)}
              size={64}
            />
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={[
            "font-display font-semibold uppercase",
            isLoser ? "text-text-tertiary" : "text-text-contrast",
          ].join(" ")}
          style={{ fontSize: 20, lineHeight: "24px" }}
        >
          {players.length > 0
            ? players.map((p) => displaySurname(p.name)).join(" / ")
            : "TBD"}
        </p>
        <div
          className={[
            "flex items-center gap-8 mt-8 flex-wrap",
            alignRight ? "sm:justify-end" : "",
          ].join(" ")}
        >
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
    ? new Date(match.played_at).toLocaleString("en-GB", {
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

      {/* Pair blocks + score —
          Mobile: stack vertically (team1 row → score row → team2 row)
          sm+:    3-column grid (team1 | score | team2) */}
      <div className="px-20 pb-24 pt-24 sm:px-32 sm:pb-32 sm:pt-32 flex flex-col gap-20 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-24 sm:items-center">
        {/* Team 1 */}
        {(() => {
          const t = teams[0];
          const isLoser = !!match.winner && !t.isWinner;
          return (
            <PairBlock
              players={t.players}
              playerDetails={playerDetails}
              isLoser={isLoser}
              isWinner={t.isWinner}
              alignRight={false}
            />
          );
        })()}

        {/* Center score column — no order-last so it sits between the two
            team blocks on mobile (flex-col) and in the centre on desktop grid. */}
        <div className="flex flex-col items-center justify-center gap-12">
          {score && score.length > 0 ? (
            <div className="flex items-center gap-16">
              <div className="flex flex-col items-center gap-4">
                {score.map((s, i) => {
                  const win = isWin(s.team_1, s.team_2);
                  return (
                    <span
                      key={`t1-${i}`}
                      className={[
                        "font-display font-semibold tabular-nums",
                        win ? "text-text-contrast" : "text-text-tertiary",
                      ].join(" ")}
                      style={{ fontSize: 36, lineHeight: "40px" }}
                    >
                      {s.team_1 || "–"}
                    </span>
                  );
                })}
              </div>
              <div
                className="self-stretch"
                aria-hidden
                style={{ width: 1, background: "var(--color-border-secondary)" }}
              />
              <div className="flex flex-col items-center gap-4">
                {score.map((s, i) => {
                  const win = isWin(s.team_2, s.team_1);
                  return (
                    <span
                      key={`t2-${i}`}
                      className={[
                        "font-display font-semibold tabular-nums",
                        win ? "text-text-contrast" : "text-text-tertiary",
                      ].join(" ")}
                      style={{ fontSize: 36, lineHeight: "40px" }}
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

          {/* Current game point is shown in the top-right StatusBadge —
              no duplicate pill needed here. */}
        </div>

        {/* Team 2 */}
        {(() => {
          const t = teams[1];
          const isLoser = !!match.winner && !t.isWinner;
          return (
            <PairBlock
              players={t.players}
              playerDetails={playerDetails}
              isLoser={isLoser}
              isWinner={t.isWinner}
              alignRight={true}
            />
          );
        })()}
      </div>
    </section>
  );
}
