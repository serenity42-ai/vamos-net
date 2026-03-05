"use client";

import { useEffect, useState, useRef } from "react";
import { getPusher } from "@/lib/pusher-client";
import type { SetScore } from "@/lib/padel-api";

export interface LiveScoreData {
  sets: {
    set_number: number;
    set_score: string | null;
    games: {
      game_number: number;
      game_score: string;
      points: string[];
    }[];
  }[];
  status: string;
}

/**
 * Subscribe to real-time score updates for a match via Pusher WebSocket.
 * Only subscribes if the match is live.
 * Returns updated score array and current game point, or null if no update yet.
 */
export function useLiveScore(
  matchId: number,
  isLive: boolean,
  initialScore: SetScore[] | null
) {
  const [score, setScore] = useState<SetScore[] | null>(initialScore);
  const [currentPoint, setCurrentPoint] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(isLive ? "live" : "finished");
  const channelRef = useRef<ReturnType<ReturnType<typeof getPusher>["subscribe"]> | null>(null);

  useEffect(() => {
    if (!isLive) return;

    const pusher = getPusher();
    const channelName = `matches.${matchId}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    channel.bind(
      "App\\PadelApi\\Events\\MatchLiveUpdated",
      (data: LiveScoreData) => {
        // Convert sets to SetScore array
        if (data.sets && data.sets.length > 0) {
          const newScore: SetScore[] = data.sets.map((set) => {
            if (set.set_score) {
              const [t1, t2] = set.set_score.split("-");
              return { team_1: t1, team_2: t2 };
            }
            // In-progress set: last game's game_score is cumulative before that game
            if (set.games && set.games.length > 0) {
              const lastGame = set.games[set.games.length - 1];
              const parts = lastGame.game_score.split(" - ").map((s) => s.trim());
              return { team_1: parts[0] || "0", team_2: parts[1] || "0" };
            }
            return { team_1: "0", team_2: "0" };
          });
          setScore(newScore);
        }

        // Get current point (last point of last game of last set)
        if (data.sets && data.sets.length > 0) {
          const lastSet = data.sets[data.sets.length - 1];
          if (lastSet.games && lastSet.games.length > 0) {
            const lastGame = lastSet.games[lastSet.games.length - 1];
            if (lastGame.points && lastGame.points.length > 0) {
              setCurrentPoint(lastGame.points[lastGame.points.length - 1]);
            }
          }
        }

        if (data.status) {
          setStatus(data.status);
        }
      }
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [matchId, isLive]);

  return { score, currentPoint, status };
}
