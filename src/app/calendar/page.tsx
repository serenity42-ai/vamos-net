import Link from "next/link";
import {
  getSeasonTournaments,
  levelLabel,
  type Tournament,
} from "@/lib/padel-api";

export const metadata = {
  title: "Calendar | VAMOS",
  description: "2026 Premier Padel tournament calendar — dates, locations, and levels for every event this season.",
};

function getMonthName(month: number): string {
  return [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][month];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  // Monday = 0, Sunday = 6
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function tournamentDaysInMonth(
  tournament: Tournament,
  year: number,
  month: number
): number[] {
  const start = new Date(tournament.start_date + "T00:00:00");
  const end = new Date(tournament.end_date + "T00:00:00");
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const days: number[] = [];
  const from = start < monthStart ? monthStart : start;
  const to = end > monthEnd ? monthEnd : end;

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    days.push(d.getDate());
  }
  return days;
}

// Assign consistent colors to tournaments
const TOURNAMENT_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
];

function statusDot(status: string) {
  if (status === "live") return "bg-red-500 animate-pulse";
  if (status === "finished") return "bg-gray-400";
  return "bg-green-500";
}

export default async function CalendarPage() {
  const tournamentsRes = await getSeasonTournaments(5, { per_page: "50" }).catch(
    () => ({ data: [] as Tournament[] })
  );
  const tournaments = tournamentsRes.data.sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  // Determine which months to show (from first tournament to last)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Group tournaments by month for the calendar
  const months: { year: number; month: number }[] = [];
  if (tournaments.length > 0) {
    const first = new Date(tournaments[0].start_date);
    const last = new Date(tournaments[tournaments.length - 1].end_date);
    let y = first.getFullYear();
    let m = first.getMonth();
    while (y < last.getFullYear() || (y === last.getFullYear() && m <= last.getMonth())) {
      months.push({ year: y, month: m });
      m++;
      if (m > 11) { m = 0; y++; }
    }
  }

  // Color map for tournaments
  const colorMap = new Map<number, typeof TOURNAMENT_COLORS[0]>();
  tournaments.forEach((t, i) => {
    colorMap.set(t.id, TOURNAMENT_COLORS[i % TOURNAMENT_COLORS.length]);
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-1">
          2026 Calendar
        </h1>
        <p className="text-sm text-gray-500">
          Premier Padel tournament schedule
        </p>
      </div>

      {/* Legend — upcoming tournaments */}
      <div className="mb-6 sm:mb-8 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
          Tournaments
        </h2>
        <div className="flex flex-wrap gap-2">
          {tournaments.map((t) => {
            const color = colorMap.get(t.id)!;
            return (
              <Link
                key={t.id}
                href={`/tournaments/${t.id}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${color.bg} ${color.text} hover:opacity-80 transition-opacity`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot(t.status)}`} />
                {t.name}
                <span className="opacity-60 ml-1">
                  {levelLabel(t.level)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {months.map(({ year, month }) => {
          const daysInMonth = getDaysInMonth(year, month);
          const firstDay = getFirstDayOfWeek(year, month);
          const isCurrentMonth = year === currentYear && month === currentMonth;

          // Find tournaments active this month
          const monthTournaments = tournaments.filter((t) => {
            const days = tournamentDaysInMonth(t, year, month);
            return days.length > 0;
          });

          // Map day → tournaments
          const dayTournaments = new Map<number, Tournament[]>();
          monthTournaments.forEach((t) => {
            const days = tournamentDaysInMonth(t, year, month);
            days.forEach((d) => {
              if (!dayTournaments.has(d)) dayTournaments.set(d, []);
              dayTournaments.get(d)!.push(t);
            });
          });

          return (
            <div
              key={`${year}-${month}`}
              className={`bg-white rounded-xl border overflow-hidden ${
                isCurrentMonth ? "border-[#4ABED9] ring-1 ring-[#4ABED9]/20" : "border-gray-100"
              }`}
              id={`month-${month}`}
            >
              <div className={`px-4 py-3 border-b ${isCurrentMonth ? "bg-[#4ABED9]/5 border-[#4ABED9]/20" : "bg-gray-50 border-gray-100"}`}>
                <h3 className={`text-sm font-bold ${isCurrentMonth ? "text-[#4ABED9]" : "text-[#0F1F2E]"}`}>
                  {getMonthName(month)} {year}
                </h3>
              </div>

              <div className="p-3">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-center py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-0.5">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = isCurrentMonth && day === currentDay;
                    const tourns = dayTournaments.get(day) || [];
                    const hasTournament = tourns.length > 0;
                    const topColor = hasTournament ? colorMap.get(tourns[0].id) : undefined;

                    return (
                      <div
                        key={day}
                        className={`aspect-square flex flex-col items-center justify-center rounded-md text-xs relative ${
                          isToday
                            ? "bg-[#0F1F2E] text-white font-bold"
                            : hasTournament && topColor
                            ? `${topColor.bg} ${topColor.text} font-semibold`
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        title={tourns.map((t) => t.name).join(", ") || undefined}
                      >
                        {day}
                        {tourns.length > 1 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {tourns.slice(0, 3).map((t) => {
                              const c = colorMap.get(t.id)!;
                              return (
                                <span
                                  key={t.id}
                                  className={`w-1 h-1 rounded-full ${c.text.replace("text-", "bg-")}`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Month's tournaments list */}
              {monthTournaments.length > 0 && (
                <div className="border-t border-gray-100 px-3 py-2 space-y-1">
                  {monthTournaments.map((t) => {
                    const color = colorMap.get(t.id)!;
                    const start = new Date(t.start_date + "T00:00:00");
                    const end = new Date(t.end_date + "T00:00:00");
                    return (
                      <Link
                        key={t.id}
                        href={`/tournaments/${t.id}`}
                        className="flex items-center gap-2 py-1 group"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${color.text.replace("text-", "bg-")}`} />
                        <span className="text-[11px] font-semibold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors truncate">
                          {t.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-auto">
                          {start.getDate()}-{end.getDate()}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Link to full tournaments list */}
      <div className="mt-8 text-center">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#0F1F2E] font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          View All Tournaments
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
