import Link from "next/link";
import Image from "next/image";
import Tabs from "@/components/v3/Tabs";
import {
  getPlayers,
  countryFlag,
  type Player,
} from "@/lib/padel-api";

// Player directory rarely changes; 1h
export const revalidate = 3600;

export const metadata = {
  title: "Players | VAMOS",
  description:
    "Browse professional padel players. Rankings, profiles, stats, and more.",
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

async function fetchPlayers(
  category: "men" | "women",
  search?: string,
): Promise<Player[]> {
  const params: Record<string, string> = {
    sort_by: "ranking",
    order_by: "asc",
    per_page: "50",
    category,
  };
  if (search) params.name = search;

  const res = await getPlayers(
    params as Parameters<typeof getPlayers>[0],
  ).catch(() => ({ data: [] as Player[] }));

  const players = res.data;
  // Filter anomalies — same rule the legacy page applied.
  if (players.length < 3) return players;
  const topPoints = players
    .slice(0, 10)
    .map((p) => p.points || 0)
    .filter((p) => p > 0)
    .sort((a, b) => b - a);
  const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
  return players.filter((p) => !p.points || p.points >= threshold);
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function PlayerCard({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <Link
      href={`/players/${player.id}`}
      className="group flex h-full flex-col gap-12 rounded-16 border border-border-primary bg-bg-white p-16 transition-colors hover:bg-bg-gray"
    >
      <div className="flex items-center gap-12">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            width={56}
            height={56}
            className="h-56 w-56 shrink-0 rounded-full border border-border-primary bg-bg-gray object-cover"
          />
        ) : (
          <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-full border border-border-primary bg-bg-gray font-display text-16 font-semibold text-text-secondary">
            {player.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-16 font-semibold leading-[22px] text-text-primary group-hover:text-brand">
            {player.name}
          </h3>
          <p className="truncate font-sans text-12 text-text-secondary">
            <span aria-hidden="true" className="mr-4">
              {flag}
            </span>
            {player.nationality}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-primary pt-12">
        <div>
          <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            Rank
          </div>
          <div
            className={[
              "font-display text-20 font-bold tabular-nums",
              player.ranking && player.ranking <= 3
                ? "text-brand"
                : "text-text-primary",
            ].join(" ")}
          >
            #{player.ranking}
          </div>
        </div>
        <div className="text-right">
          <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            Points
          </div>
          <div className="font-display text-16 font-semibold tabular-nums text-text-primary">
            {player.points?.toLocaleString() ?? "—"}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string };
}) {
  const tab = searchParams.tab === "women" ? "women" : "men";
  const searchQuery = (searchParams.search || "").trim();
  const players = await fetchPlayers(
    tab as "men" | "women",
    searchQuery || undefined,
  );

  const tabItems = [
    {
      label: "Men",
      href: searchQuery
        ? `/players?tab=men&search=${encodeURIComponent(searchQuery)}`
        : "/players",
      active: tab === "men",
    },
    {
      label: "Women",
      href: searchQuery
        ? `/players?tab=women&search=${encodeURIComponent(searchQuery)}`
        : "/players?tab=women",
      active: tab === "women",
    },
  ];

  return (
    <div className="bg-bg-page min-h-screen">
      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Title */}
        <h1 className="mb-24 text-text-primary text-mobile-display-l md:text-desktop-display-l">
          PLAYERS
        </h1>

        {/* Search */}
        <form
          action="/players"
          method="get"
          className="mb-24 flex w-full max-w-xl items-center gap-8 rounded-full border border-border-primary bg-bg-white px-20 py-12"
          role="search"
        >
          <input type="hidden" name="tab" value={tab} />
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center text-text-tertiary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search by name or country"
            aria-label="Search players"
            className="flex-1 bg-transparent font-sans text-16 text-text-primary outline-none placeholder:text-text-tertiary"
          />
          {searchQuery && (
            <Link
              href={`/players?tab=${tab}`}
              className="font-sans text-12 font-semibold text-text-secondary hover:text-text-primary"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Tabs */}
        <div className="mb-32 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Player division filter" />
        </div>

        {/* Grid */}
        {players.length > 0 ? (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              {searchQuery
                ? `No players found for “${searchQuery}”.`
                : "No players found."}
            </p>
          </div>
        )}

        {/* Footer count */}
        <p className="mt-32 text-center font-sans text-12 font-semibold tracking-[0.04em] text-text-secondary">
          Showing {players.length} players
        </p>
      </div>
    </div>
  );
}
