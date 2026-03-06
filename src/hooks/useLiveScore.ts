"use client";

import { useEffect, useState, useRef } from "react";
import { getPusher } from "@/lib/pusher-client";
import type { SetScore } from "@/lib/padel-api";

/**
 * Subscribe to real-time score updates for a match via Pusher WebSocket.
 * Only subscribes if the match is live.
 * Returns updated score array and current game point, or null if no update yet.
 */
export function useLiveScore(
  matchId: number,
  isLive: boolean,
  initialScore: SetScore[] | null,
  initialStatus: string = "finished"
) {
  const [score, setScore] = useState<SetScore[] | null>(initialScore);
  const [currentPoint, setCurrentPoint] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(initialStatus);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!isLive) return;

    try {
      const pusher = getPusher();
      const channelName = `matches.${matchId}`;
      const channel = pusher.subscribe(channelName);
      channelRef.current = channel;

      channel.bind(
        "App\\PadelApi\\Events\\MatchLiveUpdated",
        (data: any) => {
          try {
            // Convert sets to SetScore array
            if (data?.sets && Array.isArray(data.sets) && data.sets.length > 0) {
              const newScore: SetScore[] = [];
              for (const set of data.sets) {
                if (!set) continue;
                if (set.set_score && typeof set.set_score === "string") {
                  const parts = set.set_score.split("-");
                  newScore.push({
                    team_1: parts[0] || "0",
                    team_2: parts[1] || "0",
                  });
                } else if (set.games && Array.isArray(set.games) && set.games.length > 0) {
                  const lastGame = set.games[set.games.length - 1];
                  if (lastGame?.game_score && typeof lastGame.game_score === "string") {
                    const parts = lastGame.game_score.split(/\s*-\s*/);
                    newScore.push({
                      team_1: parts[0] || "0",
                      team_2: parts[1] || "0",
                    });
                  } else {
                    newScore.push({ team_1: "0", team_2: "0" });
                  }
                } else {
                  newScore.push({ team_1: "0", team_2: "0" });
                }
              }
              if (newScore.length > 0) {
                setScore(newScore);
              }
            }

            // Get current point (last point of last game of last set)
            try {
              if (data?.sets && Array.isArray(data.sets) && data.sets.length > 0) {
                const lastSet = data.sets[data.sets.length - 1];
                if (lastSet?.games && Array.isArray(lastSet.games) && lastSet.games.length > 0) {
                  const lastGame = lastSet.games[lastSet.games.length - 1];
                  if (lastGame?.points && Array.isArray(lastGame.points) && lastGame.points.length > 0) {
                    setCurrentPoint(String(lastGame.points[lastGame.points.length - 1]));
                  }
                }
              }
            } catch {
              // Ignore point parsing errors
            }

            if (data?.status && typeof data.status === "string") {
              setStatus(data.status);
            }
          } catch (err) {
            // Silently ignore malformed WebSocket events
            console.warn("[useLiveScore] Error processing event:", err);
          }
        }
      );

      return () => {
        try {
          channel.unbind_all();
          pusher.unsubscribe(channelName);
        } catch {
          // Ignore cleanup errors
        }
        channelRef.current = null;
      };
    } catch (err) {
      console.warn("[useLiveScore] Error setting up Pusher:", err);
      return;
    }
  }, [matchId, isLive]);

  return { score, currentPoint, status };
}
