"use client";

import type { Match } from "@/lib/padel-api";
import { useMatchModal } from "@/components/MatchModalProvider";
import { useLiveScore } from "@/hooks/useLiveScore";
import { teamName } from "@/lib/player-utils";

/**
 * Editorial live-ticker row. Dark ink surface with paper text, mono scores,
 * lime badge on LIVE matches (per brand guidelines).
 */
function TickerMatch({ match }: { match: Match }) {
  const { openMatch } = useMatchModal();
  const isLive = match.status === "live";
  const { score, currentPoint } = useLiveScore(match.id, isLive, match.score);

  const displayScore = score;

  return (
    <button
      onClick={() => openMatch(match)}
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        borderLeft: "1px solid rgba(243,238,228,0.12)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(243,238,228,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {isLive && (
        <span
          style={{
            background: "var(--lime)",
            color: "var(--ink)",
            padding: "2px 6px",
            fontFamily: "var(--mono)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          LIVE
        </span>
      )}
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(243,238,228,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {teamName(match.players.team_1)}
      </span>
      {displayScore && displayScore.length > 0 ? (
        <span
          className="score-mono"
          style={{
            fontSize: 12,
            color: isLive ? "var(--lime)" : "var(--paper)",
            whiteSpace: "nowrap",
          }}
        >
          {displayScore.map((s) => `${s.team_1 || "0"}-${s.team_2 || "0"}`).join(" ")}
        </span>
      ) : (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(243,238,228,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          vs
        </span>
      )}
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(243,238,228,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {teamName(match.players.team_2)}
      </span>
      {isLive && currentPoint && (
        <span
          className="score-mono"
          style={{
            fontSize: 10,
            color: "var(--lime)",
            whiteSpace: "nowrap",
          }}
        >
          ({currentPoint})
        </span>
      )}
    </button>
  );
}

export default function ScoresTicker({ matches }: { matches: Match[] }) {
  return (
    <div className="flex items-center gap-0 min-w-max">
      {/* LIVE eyebrow at start of ticker */}
      <span
        className="flex items-center gap-2"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--red)",
          padding: "0 20px 0 12px",
          borderRight: "1px solid rgba(243,238,228,0.15)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          aria-hidden
          className="live-dot"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--red)",
            display: "inline-block",
          }}
        />
        Live feed
      </span>
      {matches.map((match) => (
        <TickerMatch key={match.id} match={match} />
      ))}
    </div>
  );
}
