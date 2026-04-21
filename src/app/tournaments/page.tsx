import Link from "next/link";
import { getSeasonTournaments, levelLabel, type Tournament } from "@/lib/padel-api";

// Tournament list changes weekly when events start/finish
export const revalidate = 1800;

export const metadata = {
  title: "Tournaments | VAMOS",
  description: "2026 Premier Padel tournament calendar. Dates, locations, draws, and results for all events.",
};

function StatusBadge({ status }: { status: Tournament["status"] }) {
  const base = {
    fontFamily: "var(--mono)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  };
  if (status === "live") {
    return (
      <span
        className="badge-live"
        style={{ padding: "2px 6px" }}
      >
        LIVE
      </span>
    );
  }
  if (status === "finished") {
    return <span style={{ ...base, color: "var(--mute)" }}>Finished</span>;
  }
  return <span style={{ ...base, color: "var(--red)" }}>■ Upcoming</span>;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}–${e.getDate()} ${months[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${s.getDate()} ${months[s.getMonth()]} – ${e.getDate()} ${months[e.getMonth()]} ${s.getFullYear()}`;
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

  const levels = Array.from(new Set(allTournaments.map((t) => t.level))).sort();
  const filteredTournaments = levelFilter
    ? allTournaments.filter((t) => t.level === levelFilter)
    : allTournaments;
  const grouped = groupByMonth(filteredTournaments);

  const chipStyle = (active: boolean) => ({
    padding: "8px 14px",
    fontFamily: "var(--mono)" as const,
    fontSize: 11,
    fontWeight: 700 as const,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    border: `1px solid ${active ? "var(--red)" : "var(--ink)"}`,
    background: active ? "var(--red)" : "transparent",
    color: active ? "#fff" : "var(--ink)",
    whiteSpace: "nowrap" as const,
  });

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ 2026 Season</div>
          <h1 className="display" style={{ marginBottom: 12 }}>
            The <span className="italic-serif">calendar</span>.
          </h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink-soft)" }}>
            Premier Padel 2026 · {filteredTournaments.length} tournaments
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Level filter */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-10">
          <div className="flex gap-2">
            <span
              className="eyebrow shrink-0 flex items-center"
              style={{ color: "var(--mute)", paddingRight: 14, borderRight: "1px solid var(--ink)" }}
            >
              ■ Level
            </span>
            <Link href="/tournaments" style={{ ...chipStyle(!levelFilter), flexShrink: 0 }}>
              All
            </Link>
            {levels.map((level) => (
              <Link
                key={level}
                href={`/tournaments?level=${level}`}
                style={{ ...chipStyle(levelFilter === level), flexShrink: 0 }}
              >
                {levelLabel(level)}
              </Link>
            ))}
          </div>
        </div>

        {Object.entries(grouped).length === 0 && (
          <div
            style={{
              padding: "60px 24px",
              border: "1px solid var(--ink)",
              textAlign: "center",
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--mute)",
            }}
          >
            No tournaments found.
          </div>
        )}

        {Object.entries(grouped).map(([month, tournaments]) => (
          <section key={month} className="mb-12">
            <div
              className="flex items-baseline gap-4 mb-4"
              style={{ paddingBottom: 12, borderBottom: "1px solid var(--ink)" }}
            >
              <h2
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 32,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                }}
              >
                {month}
              </h2>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mute)",
                }}
              >
                · {tournaments.length} {tournaments.length === 1 ? "event" : "events"}
              </span>
            </div>
            <div style={{ border: "1px solid var(--ink)" }}>
              {tournaments.map((t, i) => (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className={`block transition-colors ${t.status !== "live" ? "hover:bg-[var(--paper-2)]" : ""}`}
                  style={{
                    padding: "20px 24px",
                    borderBottom: i < tournaments.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                    background:
                      t.status === "live" ? "rgba(193,68,58,0.05)" : "transparent",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            border: "1px solid var(--ink)",
                            color: "var(--ink)",
                          }}
                        >
                          {levelLabel(t.level)}
                        </span>
                        <StatusBadge status={t.status} />
                      </div>
                      <h3
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: 18,
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          color: "var(--ink)",
                          marginBottom: 4,
                        }}
                      >
                        {t.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          letterSpacing: "0.1em",
                          color: "var(--mute)",
                        }}
                      >
                        {t.location}, {t.country}
                      </p>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <div
                        className="score-mono"
                        style={{ fontSize: 14, color: "var(--ink)" }}
                      >
                        {formatDateRange(t.start_date, t.end_date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
