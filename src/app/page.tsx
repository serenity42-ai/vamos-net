import Image from "next/image";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import MatchCard from "@/components/MatchCard";
import RankingRow from "@/components/RankingRow";
import NewsletterSignup from "@/components/NewsletterSignup";
import { articles, matches, menRankings, womenRankings } from "@/data/mock";

export default function Home() {
  const liveMatches = matches.filter((m) => m.status === "live" || m.status === "upcoming").slice(0, 4);
  const latestNews = articles.slice(0, 4);
  const topMen = menRankings.slice(0, 5);
  const topWomen = womenRankings.slice(0, 5);

  return (
    <main>
      {/* Hero — Logo + Live Scores */}
      <section className="bg-[#0F1F2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Hero logo */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <Image
              src="/logo.png"
              alt="Vamos.net — The World of Padel"
              width={400}
              height={100}
              className="h-auto w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px]"
              priority
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Live Scores</h1>
              <p className="text-gray-400 text-sm mt-1">Today&apos;s matches from the padel world</p>
            </div>
            <Link
              href="/scores"
              className="text-sm font-semibold text-[#4ABED9] hover:text-white transition-colors self-start sm:self-auto"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">Latest News</h2>
          <Link
            href="/news"
            className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {latestNews.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Rankings Preview */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1F2E]">Rankings</h2>
            <Link
              href="/rankings"
              className="text-sm font-semibold text-[#4ABED9] hover:text-[#0F1F2E] transition-colors"
            >
              Full Rankings
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Men */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1F2E]">Men&apos;s Top 5</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="py-2 px-3 text-center w-12">#</th>
                      <th className="py-2 px-3 text-left">Player</th>
                      <th className="py-2 px-3 text-right">Pts</th>
                      <th className="py-2 px-3 text-center w-16">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMen.map((p) => (
                      <RankingRow key={p.rank} player={p} compact />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1F2E]">Women&apos;s Top 5</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[320px]">
                  <thead>
                    <tr className="text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      <th className="py-2 px-3 text-center w-12">#</th>
                      <th className="py-2 px-3 text-left">Player</th>
                      <th className="py-2 px-3 text-right">Pts</th>
                      <th className="py-2 px-3 text-center w-16">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topWomen.map((p) => (
                      <RankingRow key={p.rank} player={p} compact />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <NewsletterSignup />
      </section>
    </main>
  );
}
