import Link from "next/link";
import Image from "next/image";
import { getPlayers, countryFlag, type Player } from "@/lib/padel-api";

// Player directory rarely changes; 1h
export const revalidate = 3600;

export const metadata = {
  title: "Players | VAMOS",
  description: "Browse professional padel players. Rankings, profiles, stats, and more.",
};

async function fetchPlayers(category: "men" | "women", search?: string) {
  const params: Record<string, string> = {
    sort_by: "ranking",
    order_by: "asc",
    per_page: "50",
    category,
  };
  if (search) {
    params.name = search;
  }

  const res = await getPlayers(params as Parameters<typeof getPlayers>[0]).catch(() => ({
    data: [] as Player[],
  }));

  const players = res.data;
  if (players.length < 3) return players;
  const topPoints = players.slice(0, 10).map((p) => p.points || 0).filter((p) => p > 0).sort((a, b) => b - a);
  const threshold = topPoints.length > 2 ? topPoints[2] * 0.1 : 0;
  return players.filter((p) => !p.points || p.points >= threshold);
}

function PlayerCard({ player }: { player: Player }) {
  const flag = countryFlag(player.nationality);
  return (
    <Link
      href={`/players/${player.id}`}
      className="group transition-colors h-full flex flex-col"
      style={{ border: "1px solid var(--ink)", background: "var(--paper)", padding: 20 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            width={52}
            height={52}
            className="w-13 h-13 rounded-full object-cover shrink-0"
            style={{ background: "var(--paper-2)", width: 52, height: 52 }}
          />
        ) : (
          <div
            className="w-13 h-13 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "var(--paper-2)",
              width: 52,
              height: 52,
              fontFamily: "var(--mono)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--mute)",
            }}
          >
            {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className="truncate transition-colors"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              marginBottom: 2,
            }}
          >
            {player.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            {flag} {player.nationality}
          </p>
        </div>
      </div>
      <div
        className="flex items-center justify-between pt-3 mt-auto"
        style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--mute)",
              marginBottom: 2,
            }}
          >
            Rank
          </div>
          <span
            className="score-mono"
            style={{
              fontSize: 16,
              color: player.ranking && player.ranking <= 10 ? "var(--red)" : "var(--ink)",
            }}
          >
            #{player.ranking}
          </span>
        </div>
        <div className="text-right">
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--mute)",
              marginBottom: 2,
            }}
          >
            Points
          </div>
          <span className="score-mono" style={{ fontSize: 14, color: "var(--ink)" }}>
            {player.points?.toLocaleString() ?? "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string };
}) {
  const tab = searchParams.tab === "women" ? "women" : "men";
  const searchQuery = searchParams.search || "";
  const players = await fetchPlayers(tab as "men" | "women", searchQuery || undefined);

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
      {/* Header */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ Directory</div>
          <h1 className="display" style={{ marginBottom: 12 }}>
            The <span className="italic-serif">players</span>.
          </h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 16, color: "var(--ink-soft)" }}>
            Browse professional padel players, ranked and filtered.
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
          <Link
            href={`/players?tab=men${searchQuery ? `&search=${searchQuery}` : ""}`}
            style={chipStyle(tab === "men")}
          >
            Men
          </Link>
          <Link
            href={`/players?tab=women${searchQuery ? `&search=${searchQuery}` : ""}`}
            style={chipStyle(tab === "women")}
          >
            Women
          </Link>
        </div>

        {/* Search */}
        <form action="/players" method="get" className="flex gap-3 mb-8 max-w-xl">
          <input type="hidden" name="tab" value={tab} />
          <input
            name="search"
            type="text"
            placeholder="Search players…"
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
          <button type="submit" className="btn btn-primary">Search</button>
          {searchQuery && (
            <Link href={`/players?tab=${tab}`} className="btn">Clear</Link>
          )}
        </form>

        {/* Grid */}
        {players.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "80px 24px",
              border: "1px solid var(--ink)",
              textAlign: "center",
              fontFamily: "var(--mono)",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--mute)",
            }}
          >
            {searchQuery ? `No players found for "${searchQuery}".` : "No players found."}
          </div>
        )}

        <div
          className="mt-8 text-center"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--mute)",
          }}
        >
          Showing {players.length} players
        </div>
      </div>
    </main>
  );
}
