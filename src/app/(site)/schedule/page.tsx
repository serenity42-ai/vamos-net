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
import ScheduleClient from "./ScheduleClient";

export const revalidate = 60;

export const metadata = {
  title: "Schedule | VAMOS",
  description:
    "Daily padel match schedule — pick a date to see every Premier Padel and Cupra FIP Tour match.",
};

const DAYS_WINDOW = 14;

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  // Use tour-TZ today so the 14-day window starts at the right date for European viewers.
  const todayStr = getTourToday();

  // Build a 14-day window starting today
  const dateList: string[] = [];
  for (let i = 0; i < DAYS_WINDOW; i++) {
    dateList.push(addDays(todayStr, i));
  }
  const windowStart = dateList[0];
  const windowEnd = dateList[dateList.length - 1];

  // Fetch tournaments + matches across the window
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
      after_date: windowStart,
      before_date: windowEnd,
      sort_by: "played_at",
      order_by: "asc",
      per_page: "200",
    }).catch(() => ({ data: [] as Match[] })),
    getLiveMatches().catch(() => ({ data: [] as LiveMatchData[] })),
  ]);

  const selectedDate = searchParams.date || todayStr;
  const ctx = buildContext(liveRes.data, selectedDate, todayStr);
  const allMatches = normalizeMatches(matchesRes.data, ctx);

  // Per-date counts (only count matches with at least one player or scheduled)
  const dateCounts: Record<string, number> = {};
  for (const iso of dateList) dateCounts[iso] = 0;
  for (const m of allMatches) {
    if (m.displayStatus === "cancelled") continue;
    if (!m.played_at) continue;
    const key = m.played_at.split("T")[0];
    if (key in dateCounts) dateCounts[key] += 1;
  }

  return (
    <Suspense fallback={null}>
      <ScheduleClient
        matches={allMatches}
        tournaments={tournaments}
        dateCounts={dateCounts}
        dateList={dateList}
        todayStr={todayStr}
      />
    </Suspense>
  );
}
