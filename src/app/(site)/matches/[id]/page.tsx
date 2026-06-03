import { notFound } from "next/navigation";
import {
  getMatch,
  getTournament,
  getLiveMatches,
  type LiveMatchData,
  type Tournament,
} from "@/lib/padel-api";
import { normalizeMatch, buildContext } from "@/lib/normalize-match";
import { fetchArticles } from "@/lib/ghost";
import type { Article } from "@/data/mock";
import MatchDetailClient from "./MatchDetailClient";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const idNum = parseInt(params.id);
  if (!Number.isFinite(idNum)) return { title: "Match | VAMOS" };
  try {
    const match = await getMatch(idNum);
    const t1 =
      match.players.team_1.map((p) => p.name.split(" ").slice(-1)[0]).join(" / ") ||
      "TBD";
    const t2 =
      match.players.team_2.map((p) => p.name.split(" ").slice(-1)[0]).join(" / ") ||
      "TBD";
    return {
      title: `${t1} vs ${t2} | VAMOS`,
      description: `Match details, scores and stats for ${t1} vs ${t2}.`,
    };
  } catch {
    return { title: "Match | VAMOS" };
  }
}

export default async function MatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const idNum = parseInt(params.id);
  if (!Number.isFinite(idNum)) notFound();

  let match;
  try {
    match = await getMatch(idNum);
  } catch {
    notFound();
  }

  // Resolve tournament name (best effort)
  let tournament: Tournament | undefined;
  const tPath = match.connections?.tournament;
  if (tPath) {
    const tId = parseInt(tPath.split("/").pop() || "0");
    if (tId) {
      try {
        tournament = await getTournament(tId);
      } catch {
        /* ignore — tournament name is optional */
      }
    }
  }

  // Live overlay
  let liveData: LiveMatchData[] = [];
  try {
    const live = await getLiveMatches();
    liveData = live.data;
  } catch {
    /* ignore */
  }

  const today = new Date().toISOString().split("T")[0];
  const ctx = buildContext(liveData, today);
  const normalized = normalizeMatch(match, ctx);

  // S16 — News for this match: articles mentioning the tournament name.
  let relatedNews: Article[] = [];
  if (tournament?.name) {
    try {
      const all = await fetchArticles();
      const needle = tournament.name.toLowerCase();
      relatedNews = all
        .filter(
          (a) =>
            a.title.toLowerCase().includes(needle) ||
            a.excerpt.toLowerCase().includes(needle) ||
            a.body.toLowerCase().includes(needle),
        )
        .slice(0, 4);
    } catch {
      /* ignore */
    }
  }

  return (
    <MatchDetailClient
      match={normalized}
      tournamentName={tournament?.name}
      relatedNews={relatedNews}
    />
  );
}
