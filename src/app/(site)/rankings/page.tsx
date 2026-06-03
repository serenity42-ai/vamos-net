import Link from "next/link";
import Image from "next/image";
import Tabs from "@/components/v3/Tabs";
import RankingRow from "@/components/v3/RankingRow";
import {
  getPlayers,
  countryFlag,
  type Player,
} from "@/lib/padel-api";

// Rankings update weekly post-tournament; 1h is plenty
export const revalidate = 3600;

export const metadata = {
  title: "Rankings | VAMOS",
  description:
    "Official Premier Padel rankings for men and women. Live rankings, points, and player profiles.",
};

// ---------------------------------------------------------------------------
// Data — preserve legacy anomaly-filter logic exactly
// ---------------------------------------------------------------------------

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
    const topPoints = players
      .slice(0, 10)
      .map((p) => p.points || 0)
      .filter((p) => p > 0)
      .sort((a, b) => b - a);
    const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
    // Filter out juniors leaked into senior rankings (PadelAPI data bug)
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 19);
    const filtered = players.filter((p) => {
      if (!p.points || p.points < threshold) return false;
      if (p.birthdate) {
        const bd = new Date(p.birthdate);
        if (bd > cutoffDate) return false;
      }
      return true;
    });
    // Re-sort by points and re-assign rankings (API ranking field is unreliable)
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
    women: filterAndSort(
      womenRes.status === "fulfilled" ? womenRes.value.data : [],
    ),
  };
}

// ---------------------------------------------------------------------------
// Podium card (top-3 hero)
// ---------------------------------------------------------------------------

const PODIUM_STYLES: Record<
  1 | 2 | 3,
  { wrapper: string; badge: string; rank: string }
> = {
  1: {
    wrapper:
      "bg-bg-constant text-text-contrast border-transparent shadow-lg sm:scale-[1.04]",
    badge: "bg-brand text-text-contrast",
    rank: "text-brand",
  },
  2: {
    wrapper: "bg-bg-white text-text-primary border-border-primary",
    badge: "bg-text-primary text-text-contrast",
    rank: "text-text-primary",
  },
  3: {
    wrapper: "bg-bg-white text-text-primary border-border-primary",
    badge: "bg-text-secondary text-text-contrast",
    rank: "text-text-primary",
  },
};

function PodiumCard({ player, place }: { player: Player; place: 1 | 2 | 3 }) {
  const flag = countryFlag(player.nationality);
  const style = PODIUM_STYLES[place];
  const isFirst = place === 1;

  return (
    <Link
      href={`/players/${player.id}`}
      className={[
        "group relative flex flex-col items-center gap-12 rounded-24 border p-20 transition-transform hover:-translate-y-1",
        style.wrapper,
      ].join(" ")}
    >
      <span
        className={[
          "absolute -top-12 left-1/2 -translate-x-1/2 rounded-full px-12 py-4 font-sans text-12 font-semibold uppercase tracking-[0.08em]",
          style.badge,
        ].join(" ")}
      >
        #{place}
      </span>

      {player.photo_url ? (
        <Image
          src={player.photo_url}
          alt={player.name}
          width={isFirst ? 120 : 96}
          height={isFirst ? 120 : 96}
          className={[
            "shrink-0 rounded-full object-cover",
            isFirst
              ? "h-[120px] w-[120px] border-4 border-brand"
              : "h-[96px] w-[96px] border-2 border-border-primary",
          ].join(" ")}
        />
      ) : (
        <div
          className={[
            "flex shrink-0 items-center justify-center rounded-full font-display font-bold",
            isFirst
              ? "h-[120px] w-[120px] border-4 border-brand bg-bg-gray text-32 text-text-secondary"
              : "h-[96px] w-[96px] border-2 border-border-primary bg-bg-gray text-24 text-text-secondary",
          ].join(" ")}
        >
          {player.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-14">
            {flag}
          </span>
          <span className="font-sans text-12 uppercase tracking-[0.06em] opacity-80">
            {player.nationality}
          </span>
        </div>
        <div className="mt-4 font-display text-18 font-bold uppercase tracking-[0.02em] leading-tight">
          {player.name}
        </div>
        <div
          className={[
            "mt-8 font-display text-24 font-bold tabular-nums",
            style.rank,
          ].join(" ")}
        >
          {player.points?.toLocaleString() ?? "—"}
        </div>
        <div className="font-sans text-10 font-semibold uppercase tracking-[0.08em] opacity-70">
          points
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const { men, women } = await fetchRankings();
  const tab = searchParams.tab === "women" ? "women" : "men";

  const rankings = tab === "men" ? men : women;
  const top3 = rankings.slice(0, 3);
  // Order podium: 2 / 1 / 3 visually
  const podiumOrder: Player[] = [];
  if (top3[1]) podiumOrder.push(top3[1]);
  if (top3[0]) podiumOrder.push(top3[0]);
  if (top3[2]) podiumOrder.push(top3[2]);
  const podiumPlaces: (1 | 2 | 3)[] = [];
  if (top3[1]) podiumPlaces.push(2);
  if (top3[0]) podiumPlaces.push(1);
  if (top3[2]) podiumPlaces.push(3);

  const tail = rankings.slice(3, 50);

  const tabItems = [
    { label: "Men", href: "/rankings", active: tab === "men" },
    { label: "Women", href: "/rankings?tab=women", active: tab === "women" },
  ];

  const rankingsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Premier Padel ${tab === "men" ? "Men's" : "Women's"} Rankings`,
    numberOfItems: rankings.length,
    itemListElement: rankings.slice(0, 20).map((p) => ({
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

  return (
    <div className="bg-bg-page min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rankingsSchema) }}
      />

      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32">
        {/* Title */}
        <h1 className="mb-24 text-text-primary text-mobile-display-l md:text-desktop-display-l">
          RANKINGS
        </h1>

        {/* Tabs */}
        <div className="mb-32 -mx-16 sm:-mx-24 lg:-mx-32 sm:mx-0">
          <Tabs items={tabItems} ariaLabel="Ranking division filter" />
        </div>

        {/* Podium (top 3) */}
        {top3.length > 0 && (
          <section className="mb-40">
            <p className="mb-20 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
              Top 3 · {tab === "men" ? "Men" : "Women"}
            </p>
            <div className="grid grid-cols-1 items-end gap-16 pt-12 sm:grid-cols-3">
              {podiumOrder.map((p, i) => (
                <PodiumCard key={p.id} player={p} place={podiumPlaces[i]} />
              ))}
            </div>
          </section>
        )}

        {/* Tail list 4–50 */}
        {tail.length > 0 && (
          <section>
            <p className="mb-12 font-sans text-12 font-semibold uppercase tracking-[0.06em] text-text-secondary">
              Ranks 4–{Math.min(50, rankings.length)}
            </p>
            <div className="overflow-hidden rounded-16 border border-border-primary bg-bg-white">
              <div className="divide-y divide-border-primary">
                {tail.map((p) => (
                  <RankingRow key={p.id} player={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer count */}
        <p className="mt-32 text-center font-sans text-12 font-semibold tracking-[0.04em] text-text-secondary">
          Showing {Math.min(50, rankings.length)} of {rankings.length} players
        </p>

        {rankings.length === 0 && (
          <div className="rounded-16 border border-border-primary bg-bg-white p-48 text-center">
            <p className="font-sans text-14 text-text-secondary">
              No ranking data available right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
