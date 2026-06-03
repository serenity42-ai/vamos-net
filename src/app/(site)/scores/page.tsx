import {
  getSeasonTournaments,
  getMatches,
  getLiveMatches,
  type Match,
  type Tournament,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext } from "@/lib/normalize-match";
import ScoresClient from "./ScoresClient";

export const revalidate = 30;

export const metadata = {
  title: "Live Scores | VAMOS",
  description: "Live padel scores, results, and upcoming matches from the Premier Padel tour.",
};

async function fetchScoresData(date: string) {
  const [s5Res, s6Res] = await Promise.allSettled([
    getSeasonTournaments(5, { per_page: "50" }),
    getSeasonTournaments(6, { per_page: "50" }),
  ]);
  const tournaments = [
    ...(s5Res.status === "fulfilled" ? s5Res.value.data : []),
    ...(s6Res.status === "fulfilled" ? s6Res.value.data : []),
  ];

  const [matchesRes, liveRes] = await Promise.all([
    getMatches({
      after_date: date,
      before_date: date,
      sort_by: "played_at",
      order_by: "desc",
      per_page: "100",
    }).catch(() => ({ data: [] as Match[] })),
    getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
  ]);

  const ctx = buildContext(liveRes.data, date);
  const allMatches = normalizeMatches(matchesRes.data, ctx);

  return { allMatches, tournaments };
}

export default async function ScoresPage({
  searchParams,
}: {
  searchParams: { status?: string; tournament?: string; date?: string };
}) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const selectedDate = searchParams.date || todayStr;

  const { allMatches, tournaments } = await fetchScoresData(selectedDate);

  // Compute the tournaments that actually have matches today (for filter pills)
  const tournamentIdsWithMatches = new Set<number>();
  for (const match of allMatches) {
    const path = match.connections?.tournament;
    if (path) {
      const id = parseInt(path.split("/").pop() || "0");
      if (id) tournamentIdsWithMatches.add(id);
    }
  }
  const activeTournaments = tournaments
    .filter((t) => tournamentIdsWithMatches.has(t.id))
    .slice(0, 12);

  return (
    <ScoresClient
      matches={allMatches}
      tournaments={tournaments}
      activeTournaments={activeTournaments}
      todayStr={todayStr}
    />
  );
}
