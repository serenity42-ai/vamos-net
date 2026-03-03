import Link from "next/link";
import { getSeasonTournaments, levelLabel, type Tournament } from "@/lib/padel-api";

export const metadata = {
  title: "Tournaments | VAMOS",
  description: "2026 Premier Padel tournament calendar. Dates, locations, draws, and results for all events.",
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
    return <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Finished</span>;
  }
  return <span className="text-xs font-semibold uppercase tracking-wider text-[#3CB371]">Upcoming</span>;
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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getMonth() === e.getMonth()) {
    return `${months[s.getMonth()]} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${months[s.getMonth()]} ${s.getDate()} - ${months[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
}

function groupByMonth(tournaments: Tournament[]): Record<string, Tournament[]> {
  const groups: Record<string, Tournament[]> = {};
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  for (const t of tournaments) {
    const d = new Date(t.start_date);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return groups;
}

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: { level?: string };
}) {
  const levelFilter = searchParams.level;

  let allTournaments: Tournament[] = [];
  try {
    const res = await getSeasonTournaments(5, { per_page: "50" });
    allTournaments = res.data;
    if (res.meta.last_page > 1) {
      const pages = Array.from({ length: res.meta.last_page - 1 }, (_, i) => i + 2);
      const extras = await Promise.all(
        pages.map((p) => getSeasonTournaments(5, { per_page: "50", page: String(p) }))
      );
      for (const e of extras) {
        allTournaments = allTournaments.concat(e.data);
      }
    }
  } catch {
    // API error
  }

  allTournaments.sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Get unique levels for filter
  const levels = Array.from(new Set(allTournaments.map((t) => t.level))).sort();

  // Apply level filter
  const filteredTournaments = levelFilter
    ? allTournaments.filter((t) => t.level === levelFilter)
    : allTournaments;

  const grouped = groupByMonth(filteredTournaments);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">Tournaments</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Premier Padel 2026 season -- {filteredTournaments.length} tournaments
        </p>
      </div>

      {/* Level filter */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-6 sm:mb-8">
        <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
          <Link
            href="/tournaments"
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              !levelFilter ? "bg-[#4ABED9] text-white" : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
            }`}
          >
            All Levels
          </Link>
          {levels.map((level) => (
            <Link
              key={level}
              href={`/tournaments?level=${level}`}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                levelFilter === level ? "bg-[#4ABED9] text-white" : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
              }`}
            >
              {levelLabel(level)}
            </Link>
          ))}
        </div>
      </div>

      {Object.entries(grouped).length === 0 && (
        <div className="text-center py-12 text-gray-400">No tournaments found.</div>
      )}

      {Object.entries(grouped).map(([month, tournaments]) => (
        <section key={month} className="mb-8">
          <h2 className="text-lg font-bold text-[#0F1F2E] mb-4 sticky top-16 bg-white py-2 z-10 border-b border-gray-100">
            {month}
          </h2>
          <div className="space-y-3">
            {tournaments.map((t) => (
              <Link
                key={t.id}
                href={`/tournaments/${t.id}`}
                className={`block rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-md ${
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${levelColor(t.level)}`}>
                        {levelLabel(t.level)}
                      </span>
                      <StatusBadge status={t.status} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F1F2E] mb-1">{t.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{t.location}, {t.country}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-[#0F1F2E]">
                      {formatDateRange(t.start_date, t.end_date)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
