"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Tournament, Player, LiveMatchData } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";
import { countryFlag } from "@/lib/padel-api";

/**
 * MatchQuickViewModal — bottom-anchored dark dialog that opens when a user
 * clicks a live match in the LiveScoresBand. Mirrors the spec mockup:
 *
 *   ┌─────────────────────────────────────────┐
 *   │ ● SET 3  1h 24m              ☆  ✕      │
 *   │ 24 apr 2026 · 12:30 · Final             │
 *   │ Central court                            │
 *   ├─────────────────────────────────────────┤
 *   │ [photo]            CURRENT GAME         │
 *   │ A. Coello           15 : 30   [photo]   │
 *   │                                          │
 *   │ [photo]            SET SCORE            │
 *   │ A. Tapia           S1  6  3   [photo]   │
 *   │                    S2  6  7(2)          │
 *   │                    S3 [2] [2]           │
 *   │                                          │
 *   │                  MATCH SCORE             │
 *   │                    1 - 1                 │
 *   ├─────────────────────────────────────────┤
 *   │ ▶ Premier Padel · Final            →    │
 *   ├─────────────────────────────────────────┤
 *   │ Location · Ground type · Venue           │
 *   └─────────────────────────────────────────┘
 *
 * Renders instantly with whatever data the parent already has (names + set
 * scores from NormalizedMatch). Player photos + flags + current-game score
 * fill in once their fetches resolve. Closes on backdrop tap or ✕.
 */

const TENNIS_BALL_EMOJI = "🎾";

export type MatchQuickViewModalProps = {
  match: NormalizedMatch;
  tournament?: Tournament;
  onClose: () => void;
};

type PlayerLite = Pick<Player, "id" | "name" | "photo_url" | "nationality">;

export default function MatchQuickViewModal({
  match,
  tournament,
  onClose,
}: MatchQuickViewModalProps) {
  const [live, setLive] = useState<LiveMatchData | null>(null);
  const [players, setPlayers] = useState<Map<number, PlayerLite>>(new Map());

  // Fetch live data (for current-game 15:30 score).
  useEffect(() => {
    let cancelled = false;
    if (match.displayStatus !== "live") return;
    fetch(`/api/matches/${match.id}/live`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setLive(data as LiveMatchData);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [match.id, match.displayStatus]);

  // Fetch the four player profiles for photos + nationality.
  useEffect(() => {
    let cancelled = false;
    const ids = [
      ...match.players.team_1.map((p) => p.id),
      ...match.players.team_2.map((p) => p.id),
    ];
    Promise.all(
      ids.map(async (id) => {
        try {
          const r = await fetch(`/api/players/${id}`);
          if (!r.ok) return null;
          const p = (await r.json()) as Player;
          return p;
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      const next = new Map<number, PlayerLite>();
      for (const p of results) {
        if (p) next.set(p.id, p);
      }
      setPlayers(next);
    });
    return () => {
      cancelled = true;
    };
  }, [match.id, match.players]);

  // Body scroll lock + ESC to close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const currentSetNumber = live?.sets?.length ?? match.score?.length ?? 0;
  const currentGame = computeCurrentGame(live);
  const matchScore = computeMatchScore(match);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center px-12 pt-16 sm:items-center sm:px-16 sm:pt-0"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close match details"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 transition-opacity"
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[460px] overflow-y-auto overflow-x-hidden rounded-20"
        style={{
          background: "#0F1420",
          color: "#fff",
          maxHeight: "calc(100dvh - 32px)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-12 px-16 pt-16">
          <div className="min-w-0">
            <div className="flex items-center gap-12">
              {match.displayStatus === "live" && currentSetNumber > 0 && (
                <span className="inline-flex items-center gap-6 rounded-full bg-brand px-12 py-4 font-sans text-12 font-bold uppercase tracking-wide text-white">
                  <span
                    aria-hidden
                    className="inline-block h-6 w-6 rounded-full bg-white live-dot"
                  />
                  Set {currentSetNumber}
                </span>
              )}
              {match.duration && (
                <span className="font-sans text-14 font-semibold text-white/90">
                  {match.duration}
                </span>
              )}
            </div>
            <p
              id="match-modal-title"
              className="mt-8 font-sans text-12 text-white/60"
            >
              {formatPlayedAt(match.played_at)}
              {match.round_name && (
                <>
                  <span aria-hidden> · </span>
                  {match.round_name}
                </>
              )}
            </p>
            {match.court && (
              <p className="font-sans text-12 text-white/60">{match.court}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-8">
            {/* TODO: favourite star (v2). Hidden for now. */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-32 w-32 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="mx-16 mt-12 h-px bg-white/10" />

        {/* Body grid: [team1 col] [middle scores col] [team2 col] */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-8 px-16 py-12">
          {/* Team 1 column */}
          <PlayerColumn
            players={match.players.team_1}
            playerLookup={players}
            align="left"
            isWinner={match.winner === "team_1"}
          />

          {/* Centre column: current game + set scores + match score */}
          <div className="flex min-w-[120px] flex-col items-center gap-10">
            {match.displayStatus === "live" && currentGame && (
              <div className="text-center">
                <p className="font-sans text-10 font-semibold uppercase tracking-[0.1em] text-white/60">
                  Current game
                </p>
                <p className="mt-4 font-display text-24 font-bold tabular-nums">
                  <span className="text-white">{currentGame.team1}</span>
                  <span className="px-6 text-white/40">:</span>
                  <span
                    style={{ color: "#D4FF3A" }}
                    className="font-bold"
                  >
                    {currentGame.team2}
                  </span>
                </p>
              </div>
            )}

            {(match.score?.length ?? 0) > 0 && (
              <div className="w-full text-center">
                <p className="font-sans text-10 font-semibold uppercase tracking-[0.1em] text-white/60">
                  Set score
                </p>
                <div className="mt-6 space-y-3">
                  {(match.score ?? []).map((s, i) => {
                    const isCurrent =
                      match.displayStatus === "live" &&
                      i === (match.score?.length ?? 0) - 1;
                    return (
                      <div
                        key={i}
                        className={[
                          "mx-auto flex w-full max-w-[140px] items-center justify-between rounded-6 px-8 py-2 font-mono text-13 tabular-nums",
                          isCurrent ? "bg-[#D4FF3A] text-black" : "text-white/85",
                        ].join(" ")}
                      >
                        <span
                          className={
                            "shrink-0 font-sans text-10 font-bold " +
                            (isCurrent ? "text-black" : "text-white/60")
                          }
                        >
                          S{s_index(i)}
                        </span>
                        <span>{s.team_1}</span>
                        <span>{s.team_2}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {matchScore && (
              <div className="text-center">
                <p className="font-sans text-10 font-semibold uppercase tracking-[0.1em] text-white/60">
                  Match score
                </p>
                <p className="mt-4 font-display text-24 font-bold tabular-nums">
                  {matchScore.team1} - {matchScore.team2}
                </p>
              </div>
            )}
          </div>

          {/* Team 2 column */}
          <PlayerColumn
            players={match.players.team_2}
            playerLookup={players}
            align="right"
            isWinner={match.winner === "team_2"}
          />
        </div>

        {/* Tournament strip */}
        {tournament && (
          <Link
            href={`/tournaments/${tournament.id}`}
            className="flex items-center gap-12 border-t border-white/10 px-16 py-12 transition-colors hover:bg-white/5"
          >
            <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 font-display text-14 font-bold text-white">
              {tournament.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-14 font-bold text-white">
                {tournament.name}
              </p>
              <p className="truncate font-sans text-12 text-white/60">
                {match.round_name || "View tournament"}
              </p>
            </div>
            <ChevronRight />
          </Link>
        )}

        {/* Meta row: venue, ground, location */}
        {tournament && (
          <div className="grid grid-cols-3 gap-12 border-t border-white/10 px-16 py-12">
            <Meta label="Location" value={tournament.location} />
            <Meta label="Ground type" value="Outdoor hard" />
            <Meta label="Venue" value={match.court || "—"} />
          </div>
        )}

        {/* Bottom safe-area on mobile */}
        <div className="h-8 sm:h-0" />

        <span aria-hidden className="hidden">
          {TENNIS_BALL_EMOJI}
        </span>
      </div>
    </div>
  );
}

function s_index(i: number): number {
  return i + 1;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-white/50">
        {label}
      </p>
      <p className="mt-2 truncate font-sans text-13 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function PlayerColumn({
  players,
  playerLookup,
  align,
  isWinner,
}: {
  players: NormalizedMatch["players"]["team_1"];
  playerLookup: Map<number, PlayerLite>;
  align: "left" | "right";
  isWinner: boolean;
}) {
  const isRight = align === "right";
  return (
    <div
      className={[
        "flex flex-col gap-12",
        isRight ? "items-end text-right" : "items-start text-left",
      ].join(" ")}
    >
      {players.map((p) => {
        const profile = playerLookup.get(p.id);
        const flag = profile?.nationality
          ? countryFlag(profile.nationality)
          : "";
        const short = shortName(p.name);
        return (
          <div
            key={p.id}
            className={[
              "flex items-center gap-8",
              isRight ? "flex-row-reverse" : "flex-row",
            ].join(" ")}
          >
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5">
              {profile?.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={p.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-12 font-bold text-white/80">
                  {p.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={isRight ? "text-right" : "text-left"}>
              <p
                className={[
                  "font-sans text-13 leading-tight",
                  isWinner ? "font-bold text-white" : "font-medium text-white/85",
                ].join(" ")}
              >
                {flag && (
                  <span aria-hidden className="mr-4">
                    {flag}
                  </span>
                )}
                {short}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

function formatPlayedAt(iso: string | null): string {
  if (!iso) return "TBD";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "TBD";
  }
}

function computeCurrentGame(
  live: LiveMatchData | null,
): { team1: string; team2: string } | null {
  if (!live?.sets || live.sets.length === 0) return null;
  const lastSet = live.sets[live.sets.length - 1];
  const lastGame = lastSet?.games?.[lastSet.games.length - 1];
  if (!lastGame?.game_score) return null;
  const [t1, t2] = lastGame.game_score.split("-");
  return { team1: t1 ?? "0", team2: t2 ?? "0" };
}

function computeMatchScore(
  match: NormalizedMatch,
): { team1: number; team2: number } | null {
  if (!match.score || match.score.length === 0) return null;
  let t1 = 0;
  let t2 = 0;
  for (const s of match.score) {
    const a = parseInt(String(s.team_1).replace(/\(.*\)/, ""), 10);
    const b = parseInt(String(s.team_2).replace(/\(.*\)/, ""), 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    if (a > b) t1++;
    else if (b > a) t2++;
  }
  return { team1: t1, team2: t2 };
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-white/70"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
