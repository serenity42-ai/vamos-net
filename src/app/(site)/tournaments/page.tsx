import Link from "next/link";
import Tabs from "@/components/v3/Tabs";
import TournamentCard from "@/components/v3/TournamentCard";
import TournamentCardDesktop from "@/components/v3/TournamentCardDesktop";
import {
  getSeasonTournaments,
  type Tournament,
} from "@/lib/padel-api";

// Tournament list changes weekly when events start/finish
export const revalidate = 1800;

export const metadata = {
  title: "Tournaments | VAMOS",
  description:
    "2026 Premier Padel tournament calendar. Dates, locations, draws, and results for all events.",
};

type StatusFilter = "all" | "live" | "upcoming" | "finished";
type CategoryFilter = "all" | "men" | "women";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function fetchTournaments(): Promise<Tournament[]> {
  let all: Tournament[] = [];
  try {
    const res = await getSeasonTournaments(5, { per_page: "50" });
    all = res.data;
    if (res.meta.last_page > 1) {
      const pages = Array.from(
        { length: res.meta.last_page - 1 },
        (_, i) => i + 2,
      );
      const extras = await Promise.all(
        pages.map((p) =>
          getSeasonTournaments(5, { per_page: "50", page: String(p) }),
        ),
      );
      for (const e of extras) all = all.concat(e.data);
    }
  } catch {
    // swallow — empty list renders an empty state
  }
  all.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );
  return all;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthKey(t: Tournament): string {
  const d = new Date(t.start_date);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function buildUrl(
  base: string,
  next: Partial<{ status: StatusFilter; category: CategoryFilter }>,
  current: { status: StatusFilter; category: CategoryFilter },
): string {
  const params = new URLSearchParams();
  const status = next.status ?? current.status;
  const category = next.category ?? current.category;
  if (status !== "all") params.set("status", status);
  if (category !== "all") params.set("category", category);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string };
}) {
  const all = await fetchTournaments();

  const status = (
    ["all", "live", "upcoming", "finished"].includes(searchParams.status ?? "")
      ? searchParams.status
      : "all"
  ) as StatusFilter;

  const category = (
    ["all", "men", "women"].includes(searchParams.category ?? "")
      ? searchParams.category
      : "all"
  ) as CategoryFilter;

  // Status filter (note: Tournament.status is "pending" | "live" | "finished")
  let filtered = all.filter((t) => {
    if (status === "live") return t.status === "live";
    if (status === "upcoming") return t.status === "pending";
    if (status === "finished") return t.status === "finished";
    return true;
  });

  // Category filter — Tournament has no top-level category, but tournament names
  // commonly encode "Women" / "Femenino" / "Female"; otherwise we treat as both.
  // We keep this filter as a no-op for "all" and rely on a simple name heuristic
  // since the data set doesn't expose a clean category field. Safer to leave
  // tournaments visible than to over-filter — show ALL when category=all.
  if (category === "women") {
    filtered = filtered.filter((t) =>
      /women|female|femenino|femenina|wta/i.test(t.name),
    );
  } else if (category === "men") {
    // Hide explicit "women" tournaments only — most events are mixed, leave them.
    filtered = filtered.filter(
      (t) => !/women|female|femenino|femenina|wta/i.test(t.name),
    );
  }

  // Group by month for display
  const grouped = new Map<string, Tournament[]>();
  for (const t of filtered) {
    const key = monthKey(t);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }

  const current = { status, category };

  const statusTabs = [
    {
      label: "All",
      href: buildUrl("/tournaments", { status: "all" }, current),
      active: status === "all",
    },
    {
      label: "Live",
      href: buildUrl("/tournaments", { status: "live" }, current),
      active: status === "live",
    },
    {
      label: "Upcoming",
      href: buildUrl("/tournaments", { status: "upcoming" }, current),
      active: status === "upcoming",
    },
    {
      label: "Finished",
      href: buildUrl("/tournaments", { status: "finished" }, current),
      active: status === "finished",
    },
  ];

  const categoryTabs = [
    {
      label: "All",
      href: buildUrl("/tournaments", { category: "all" }, current),
      active: category === "all",
    },
    {
      label: "Men",
      href: buildUrl("/tournaments", { category: "men" }, current),
      active: category === "men",
    },
    {
      label: "Women",
      href: buildUrl("/tournaments", { category: "women" }, current),
      active: category === "women",
    },
  ];

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Title */}
        <h1 className="mb-24 text-text-primary text-mobile-display-l md:text-desktop-display-l">
          TOURNAMENTS
        </h1>

        {/* Status tabs */}
        <div className="mb-12 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={statusTabs} ariaLabel="Tournament status filter" />
        </div>

        {/* Category sub-tabs */}
        <div className="mb-32 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={categoryTabs} ariaLabel="Tournament category filter" />
        </div>

        {/* Empty state */}
        {grouped.size === 0 && (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              No tournaments match this filter.
            </p>
            <Link
              href="/tournaments"
              className="mt-12 inline-block font-sans text-12 font-semibold text-brand hover:underline"
            >
              Clear filters →
            </Link>
          </div>
        )}

        {/* Grouped sections */}
        <div className="space-y-40">
          {Array.from(grouped.entries()).map(([month, tournaments]) => (
            <section key={month}>
              <div className="mb-16 flex items-baseline gap-12 border-b border-border-primary pb-8">
                <h2 className="text-text-primary text-mobile-heading-l md:text-desktop-heading-l">
                  {month}
                </h2>
                <span className="font-sans text-12 font-semibold text-text-secondary tracking-[0.04em]">
                  {tournaments.length}{" "}
                  {tournaments.length === 1 ? "event" : "events"}
                </span>
              </div>

              {/* Mobile: grid of TournamentCard */}
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:hidden">
                {tournaments.map((t) => (
                  <TournamentCard
                    key={t.id}
                    tournament={t}
                    variant={t.status === "live" ? "dark" : "default"}
                  />
                ))}
              </div>

              {/* Desktop: list of TournamentCardDesktop */}
              <div className="hidden flex-col gap-8 md:flex">
                {tournaments.map((t) => (
                  <TournamentCardDesktop
                    key={t.id}
                    tournament={t}
                    variant={t.status === "live" ? "dark" : "default"}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer count */}
        <p className="mt-32 text-center font-sans text-12 font-semibold tracking-[0.04em] text-text-secondary">
          Showing {filtered.length} of {all.length} tournaments
        </p>
      </div>
    </div>
  );
}
