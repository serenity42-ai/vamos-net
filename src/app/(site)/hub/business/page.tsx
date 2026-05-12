import Link from "next/link";
import { articles } from "@/data/mock";

export const metadata = {
  title: "Business of Padel | VAMOS",
  description:
    "Padel industry insights: market growth, court economics, sponsorships, contracts, and investment opportunities in the world's fastest-growing sport.",
};

/** Pretty date: '2026-03-30T00:00:00.000Z' -> '30 Mar 2026'. */
function formatEditorialDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

export default function BusinessPage() {
  const businessArticles = articles.filter((a) => a.category === "Business");

  const topics = [
    ["Market Growth", "Global padel market size, growth rates, and regional expansion trends."],
    ["Court Economics", "Build costs, revenue models, ROI timelines, and club profitability."],
    ["Sponsorships & Deals", "Brand partnerships, player endorsements, and broadcast rights."],
    ["Player Earnings", "Prize money distribution, contracts, and income breakdown by tier."],
    ["Investment", "Venture capital, franchise models, and where smart money is going."],
    ["Industry News", "Mergers, expansions, new markets, and regulatory developments."],
  ];

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--clay)", marginBottom: 12 }}>■ Section 04 · Business</div>
          <h1 className="display" style={{ marginBottom: 20 }}>
            The <span className="italic-serif">business</span> of padel.
          </h1>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: 680,
            }}
          >
            Market insights, court economics, sponsorship deals, player contracts, and
            investment opportunities in the world&rsquo;s fastest-growing sport.
          </p>
        </div>
      </section>

      {/* Topic grid */}
      <section style={{ borderBottom: "1px solid var(--ink)", background: "var(--paper-2)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--ink)", marginBottom: 20 }}>■ Topics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: "1px solid var(--ink)" }}>
            {topics.map(([title, description], i) => (
              <div
                key={title}
                style={{
                  padding: 28,
                  background: "var(--paper)",
                  borderRight: (i + 1) % 3 !== 0 && i !== topics.length - 1 ? "1px solid rgba(0,0,0,0.12)" : "none",
                  borderBottom: i < topics.length - (topics.length % 3 || 3) ? "1px solid rgba(0,0,0,0.12)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--clay)",
                    marginBottom: 12,
                  }}
                >
                  ■ {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    marginBottom: 10,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: "var(--ink-soft)",
                  }}
                >
                  {description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest business articles */}
      <section>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ Latest</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", marginBottom: 28 }}>
            Business <span className="italic-serif">coverage</span>.
          </h2>

          {businessArticles.length > 0 ? (
            <div style={{ border: "1px solid var(--ink)", background: "var(--paper)" }}>
              {businessArticles.map((article, i) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="block group transition-colors hover:bg-[var(--paper-2)]"
                  style={{
                    padding: "24px 28px",
                    borderBottom: i < businessArticles.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--mute)",
                      marginBottom: 8,
                    }}
                  >
                    {formatEditorialDate(article.date)}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "var(--ink)",
                      marginBottom: 8,
                      lineHeight: 1.2,
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="line-clamp-2"
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
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
              Business articles coming soon.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
