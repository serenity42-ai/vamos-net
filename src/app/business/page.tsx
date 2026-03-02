import Link from "next/link";
import { articles } from "@/data/mock";

export const metadata = {
  title: "Business of Padel | VAMOS",
  description:
    "Padel industry insights: market growth, court economics, sponsorships, contracts, and investment opportunities in the world's fastest-growing sport.",
};

export default function BusinessPage() {
  const businessArticles = articles.filter(
    (a) => a.category === "Business"
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">
          Business of Padel
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl">
          Market insights, court economics, sponsorship deals, player contracts,
          and investment opportunities in the world&apos;s fastest-growing sport.
        </p>
      </div>

      {/* Topic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
        {[
          {
            title: "Market Growth",
            description: "Global padel market size, growth rates, and regional expansion trends.",
            color: "bg-[#4ABED9]/10 text-[#4ABED9]",
          },
          {
            title: "Court Economics",
            description: "Build costs, revenue models, ROI timelines, and club profitability.",
            color: "bg-[#3CB371]/10 text-[#3CB371]",
          },
          {
            title: "Sponsorships & Deals",
            description: "Brand partnerships, player endorsements, and broadcast rights.",
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Player Earnings",
            description: "Prize money distribution, contracts, and income breakdown by tier.",
            color: "bg-orange-100 text-orange-600",
          },
          {
            title: "Investment",
            description: "Venture capital, franchise models, and where smart money is going.",
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Industry News",
            description: "Mergers, expansions, new markets, and regulatory developments.",
            color: "bg-red-100 text-red-600",
          },
        ].map((topic) => (
          <div
            key={topic.title}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${topic.color}`}
            >
              {topic.title}
            </span>
            <p className="text-sm text-gray-500 mt-3">{topic.description}</p>
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F1F2E] mb-6">
          Latest Business Articles
        </h2>

        {businessArticles.length > 0 ? (
          <div className="space-y-4">
            {businessArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0F1F2E] group-hover:text-[#4ABED9] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{article.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base">Business articles coming soon.</p>
            <p className="text-sm mt-1">
              Subscribe to our newsletter to get notified.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
