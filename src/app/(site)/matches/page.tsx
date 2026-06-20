import { Suspense } from "react";
import {
  getSeasonTournaments,
  getMatches,
  getLiveMatches,
  type Match,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext } from "@/lib/normalize-match";
import { getTourToday } from "@/lib/tour-date";
import { getActiveSeasonIds } from "@/lib/seasons";
import MatchesClient from "./MatchesClient";

// Render on-demand, not at build. This page fetches live padel data that can
// rate-limit (PadelAPI 429) during static generation and time out the build.
// Edge caching is handled by Cache-Control headers in next.config.mjs.
export const dynamic = "force-dynamic";

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
  // Use tour-TZ today so the ±7-day window doesn't drift to UTC at night.
  const todayStr = getTourToday();
  const after = addDays(todayStr, -7);
  const before = addDays(todayStr, 7);

  const seasonIds = await getActiveSeasonIds();
  const seasonResults = await Promise.allSettled(
    seasonIds.map((id) => getSeasonTournaments(id, { per_page: "50" })),
  );
  const tournaments = seasonResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value.data : [],
  );

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

  const ctx = buildContext(liveRes.data, todayStr, todayStr);
  const allMatches = normalizeMatches(matchesRes.data, ctx);

  return (
    <Suspense fallback={null}>
      <MatchesClient matches={allMatches} tournaments={tournaments} />
    </Suspense>
  );
}
