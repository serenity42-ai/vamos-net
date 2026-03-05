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
            // Set in progress — count games won by each team
            let t1Games = 0;
            let t2Games = 0;
            for (const game of set.games) {
              const [g1, g2] = game.game_score.split(" - ").map(Number);
              // game_score is cumulative BEFORE the game, so last game's score + winner
              if (game === set.games[set.games.length - 1]) {
                // Current game — use cumulative score from game_score
                // and check if there's a winner from the points
                t1Games = g1;
                t2Games = g2;
                // Check if the last point suggests a game was won
                // Actually, we should just count from game_score of the last game
              }
            }
            // Better approach: last game's game_score shows cumulative
            if (set.games.length > 0) {
              const lastGame = set.games[set.games.length - 1];
              const [g1, g2] = lastGame.game_score.split(" - ").map(Number);
              t1Games = g1;
              t2Games = g2;
            }
            return { team_1: String(t1Games), team_2: String(t2Games) };
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
