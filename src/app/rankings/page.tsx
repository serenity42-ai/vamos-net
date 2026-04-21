import Link from "next/link";
import Image from "next/image";
import { getPlayers, countryFlag, type Player } from "@/lib/padel-api";

export const metadata = {
  title: "Rankings | VAMOS",
  description: "Official Premier Padel rankings for men and women. Live rankings, points, and player profiles.",
};

async function fetchRankings() {
  const [menRes, womenRes] = await Promise.allSettled([
    getPlayers({
      category: "men",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "50",
    }),
    getPlayers({
      category: "women",
      sort_by: "ranking",
      order_by: "asc",
      per_page: "50",
    }),
  ]);

  const filterAndSort = (players: Player[]): Player[] => {
    if (players.length < 3) return players;
    // Filter anomalies: remove players with points < 10% of 3rd-highest
    const topPoints = players.slice(0, 10).map((p) => p.points || 0).filter((p) => p > 0).sort((a, b) => b - a);
    const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
    // Filter out juniors leaked into senior rankings (PadelAPI data bug)
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 19);
    const filtered = players.filter((p) => {
      if (!p.points || p.points < threshold) return false;
      // Exclude players under 19 — likely junior/Promises ranking leak
      if (p.birthdate) {
        const bd = new Date(p.birthdate);
        if (bd > cutoffDate) return false;
      }
      return true;
    });
    // Re-sort by points descending and re-assign rankings (API ranking field is unreliable)
    filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
    let currentRank = 1;
    for (let i = 0; i < filtered.length; i++) {
      if (i > 0 && (filtered[i].points || 0) < (filtered[i - 1].points || 0)) {
        currentRank = i + 1;
      }
      filtered[i].ranking = currentRank;
    }
    return filtered;
  };

  return {
    men: filterAndSort(menRes.status === "fulfilled" ? menRes.value.data : []),
    women: filterAndSort(womenRes.status === "fulfilled" ? womenRes.value.data : []),
  };
}

function PlayerRow({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <tr
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      className="transition-colors hover:bg-[var(--paper-2)]"
    >
      <td style={{ padding: "12px 16px", textAlign: "center", width: 56 }}>
        <span
          className="score-mono"
          style={{
            fontSize: 16,
            color: player.ranking <= 3 ? "var(--red)" : "var(--ink)",
          }}
        >
          {player.ranking}
        </span>
      </td>
      <td style={{ padding: "12px 8px" }}>
        <Link href={`/players/${player.id}`} className="flex items-center gap-3 group">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover shrink-0"
              style={{ background: "var(--paper-2)" }}
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "var(--paper-2)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--mute)",
              }}
            >
              {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <span
              className="block truncate transition-colors"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              {player.name}
            </span>
            <span
              className="sm:hidden"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "var(--mute)",
              }}
            >
              {flag} {player.nationality}
            </span>
          </div>
        </Link>
      </td>
      <td style={{ padding: "12px 8px" }} className="hidden sm:table-cell">
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--mute)" }}>
          {flag} {player.nationality}
        </span>
      </td>
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        <span className="score-mono" style={{ fontSize: 14, color: "var(--ink)" }}>
          {player.points?.toLocaleString() ?? "—"}
        </span>
      </td>
    </tr>
  );
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string; show?: string };
}) {
  const { men, women } = await fetchRankings();
  const tab = searchParams.tab === "women" ? "women" : "men";
  const searchQuery = searchParams.search?.toLowerCase() || "";
  const showAll = searchParams.show === "all";

  let rankings = tab === "men" ? men : women;

  // Filter by search
  if (searchQuery) {
    rankings = rankings.filter((p) =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.nationality.toLowerCase().includes(searchQuery)
    );
  }

  // Show top 20 by default or all
  const displayCount = showAll || searchQuery ? rankings.length : Math.min(20, rankings.length);
  const displayRankings = rankings.slice(0, displayCount);
  const hasMore = !showAll && !searchQuery && rankings.length > 20;

  // Schema.org ItemList
  const rankingsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Premier Padel ${tab === "men" ? "Men's" : "Women's"} Rankings`,
    numberOfItems: rankings.length,
    itemListElement: displayRankings.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: p.ranking,
      item: {
        "@type": "Person",
        name: p.name,
        nationality: p.nationality,
        url: `https://vamos.net/players/${p.id}`,
      },
    })),
  };

  const chipStyle = (active: boolean) => ({
    padding: "8px 20px",
    fontFamily: "var(--mono)" as const,
    fontSize: 11,
    fontWeight: 700 as const,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    border: `1px solid ${active ? "var(--red)" : "var(--ink)"}`,
    background: active ? "var(--red)" : "transparent",
    color: active ? "#fff" : "var(--ink)",
  });

  return (
    <main style={{ background: "var(--paper)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingsSchema) }}
      />

      {/* Header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
            ■ Official Premier Padel
          </div>
          <h1 className="display" style={{ marginBottom: 12 }}>
            The <span className="italic-serif">rankings</span>.
          </h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink-soft)" }}>
            Live rankings, points, and player profiles across the tour.
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="eyebrow shrink-0"
            style={{ color: "var(--mute)", paddingRight: 14, borderRight: "1px solid var(--ink)" }}
          >
            ■ Division
          </span>
          <Link href="/rankings?tab=men" style={chipStyle(tab === "men")}>
            Men
          </Link>
          <Link href="/rankings?tab=women" style={chipStyle(tab === "women")}>
            Women
          </Link>
        </div>

        {/* Search */}
        <form action="/rankings" method="get" className="flex gap-3 mb-8 max-w-xl">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="search"
            type="text"
            placeholder="Search by name…"
            defaultValue={searchQuery}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: "var(--paper)",
              border: "1px solid var(--ink)",
              fontFamily: "var(--sans)",
              fontSize: 14,
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {searchQuery && (
            <Link href={`/rankings?tab=${tab}`} className="btn">
              Clear
            </Link>
          )}
        </form>

        {/* Table */}
        <div style={{ border: "1px solid var(--ink)", background: "var(--paper)" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px]">
              <thead>
                <tr
                  style={{
                    background: "var(--ink)",
                    color: "var(--paper)",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "12px 16px", textAlign: "center", width: 56 }}>Rank</th>
                  <th style={{ padding: "12px 8px", textAlign: "left" }}>Player</th>
                  <th style={{ padding: "12px 8px", textAlign: "left" }} className="hidden sm:table-cell">Country</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {displayRankings.map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show more / count */}
        <div className="mt-8 text-center">
          {hasMore ? (
            <Link href={`/rankings?tab=${tab}&show=all`} className="btn">
              Show all {rankings.length} players →
            </Link>
          ) : (
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--mute)",
              }}
            >
              Showing {displayRankings.length} of {rankings.length} players
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
