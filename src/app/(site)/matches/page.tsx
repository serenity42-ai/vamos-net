import { Suspense } from "react";
import {
  getSeasonTournaments,
  getMatches,
  getLiveMatches,
  type Match,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext } from "@/lib/normalize-match";
import MatchesClient from "./MatchesClient";

export const revalidate = 60;

export const metadata = {
  title: "Matches | VAMOS",
  description:
    "Browse padel matches across Premier Padel and Cupra FIP Tour — live, upcoming and finished.",
};

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export default async function MatchesPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const after = addDays(todayStr, -7);
  const before = addDays(todayStr, 7);

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
      after_date: after,
      before_date: before,
      sort_by: "played_at",
      order_by: "desc",
      per_page: "200",
    }).catch(() => ({ data: [] as Match[] })),
    getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
  ]);

  const ctx = buildContext(liveRes.data, todayStr);
  const allMatches = normalizeMatches(matchesRes.data, ctx);

  return (
    <Suspense fallback={null}>
      <MatchesClient matches={allMatches} tournaments={tournaments} />
    </Suspense>
  );
}
