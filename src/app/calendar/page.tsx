import { getSeasonTournaments, levelLabel, type Tournament } from "@/lib/padel-api";

export const metadata = {
  title: "Calendar | VAMOS",
  description: "2026 Premier Padel tournament calendar with dates and locations.",
};

function StatusBadge({ status }: { status: Tournament["status"] }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Live
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Finished
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-[#3CB371]">
      Upcoming
    </span>
  );
}

function levelColor(level: string): string {
  const colors: Record<string, string> = {
    finals: "bg-yellow-50 text-yellow-700 border-yellow-200",
    major: "bg-purple-50 text-purple-700 border-purple-200",
    p1: "bg-blue-50 text-blue-700 border-blue-200",
    p2: "bg-cyan-50 text-cyan-700 border-cyan-200",
    fip_rise: "bg-green-50 text-green-700 border-green-200",
    fip_star: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return colors[level] || "bg-gray-50 text-gray-700 border-gray-200";
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  if (s.getMonth() === e.getMonth()) {
    return `${months[s.getMonth()]} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
}

function groupByMonth(tournaments: Tournament[]): Record<string, Tournament[]> {
  const groups: Record<string, Tournament[]> = {};
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  for (const t of tournaments) {
    const d = new Date(t.start_date);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return groups;
}

export default async function CalendarPage() {
  // Fetch all 2026 season tournaments (season ID 5)
  // API returns max per_page, paginate if needed
  let allTournaments: Tournament[] = [];
  try {
    const res = await getSeasonTournaments(5, { per_page: "50" });
    allTournaments = res.data;
    // If there are more pages, fetch them
    if (res.meta.last_page > 1) {
      const pages = Array.from(
        { length: res.meta.last_page - 1 },
        (_, i) => i + 2
      );
      const extras = await Promise.all(
        pages.map((p) =>
          getSeasonTournaments(5, { per_page: "50", page: String(p) })
        )
      );
      for (const e of extras) {
        allTournaments = allTournaments.concat(e.data);
      }
    }
  } catch {
    // API error — show empty state
  }

  // Sort by start_date ascending
  allTournaments.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const grouped = groupByMonth(allTournaments);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Tournament Calendar
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Premier Padel 2026 season — {allTournaments.length} tournaments
        </p>
      </div>

      {Object.entries(grouped).length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No tournaments found for the 2026 season.
        </div>
      )}

      {Object.entries(grouped).map(([month, tournaments]) => (
        <section key={month} className="mb-8">
          <h2 className="text-lg font-bold text-[#0F1F2E] mb-4 sticky top-20 bg-white py-2 z-10 border-b border-gray-100">
            {month}
          </h2>
          <div className="space-y-3">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className={`rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-md ${
                  t.status === "live"
                    ? "border-red-200 bg-red-50/30"
                    : t.status === "finished"
                    ? "border-gray-100 bg-gray-50/50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${levelColor(
                          t.level
                        )}`}
                      >
                        {levelLabel(t.level)}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F1F2E] mb-1">
                      {t.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {t.location}, {t.country}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-[#0F1F2E]">
                      {formatDateRange(t.start_date, t.end_date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
