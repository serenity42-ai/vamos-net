import type { Metadata } from "next";
import Link from "next/link";
import { fetchArticles } from "@/lib/ghost";
import ArticleCard from "@/components/v3/ArticleCard";

/**
 * Pro Padel pillar landing.
 *
 * One of three core pillars (thesis locked 2026-06-10). Aggregates News,
 * Tournaments, Scores, Rankings. Audience-acquisition surface — NOT the
 * product. Editorial weight target: ~20% of Vamos.net.
 *
 * The sub-pages (/news, /tournaments, /scores, /rankings) keep their own
 * routes. This page is the portal — hero + sub-nav cards + recent Tour News.
 */

export const metadata: Metadata = {
  title: "Pro Padel — News, Tournaments, Scores, Rankings | Vamos.net",
  description:
    "Pro padel coverage: tournament recaps, live scores, rankings, and the pair-formation stories Spanish press doesn't tell. Premier Padel, Cupra FIP Tour, and beyond.",
  robots: { index: true, follow: true },
};

export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vamos.net" },
    { "@type": "ListItem", position: 2, name: "Pro Padel", item: "https://vamos.net/pro" },
  ],
};

const SUB_NAV = [
  {
    href: "/news",
    title: "News & Recaps",
    body: "Tournament recaps, pair-formation breakdowns, transfer rumours — the storylines behind the results.",
  },
  {
    href: "/tournaments",
    title: "Tournaments",
    body: "Premier Padel, Cupra FIP Tour, federation events. Calendar, brackets, and draws.",
  },
  {
    href: "/scores",
    title: "Live Scores",
    body: "Today's matches across all tours. Point-by-point on Premier Padel matches.",
  },
  {
    href: "/rankings",
    title: "Rankings",
    body: "Men's and women's world rankings, updated weekly from the official tour data.",
  },
];

export default async function ProPadelPage() {
  const articles = await fetchArticles();
  const proArticles = articles
    .filter((a) => a.category === "Tour News" || a.category === "Rankings" || a.category === "Academy")
    .slice(0, 6);

  return (
    <main className="bg-bg-page text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero / intro */}
      <section className="px-16 pt-48 pb-32 md:px-32 md:pt-64 md:pb-48 lg:px-48">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-display font-semibold uppercase tracking-wide text-body-s"
            style={{ color: "var(--color-brand, #FE4C00)" }}
          >
            Pro Padel
          </p>
          <h1
            className="font-display mt-8 text-mobile-heading-l md:text-desktop-heading-xl"
            style={{ lineHeight: 1.05 }}
          >
            The pro tour, covered properly.
          </h1>
          <p className="mt-16 font-body text-mobile-body-l md:text-desktop-body-l max-w-3xl">
            News, tournaments, scores, rankings. The pair-formation stories the
            Spanish press doesn&rsquo;t tell. Premier Padel, Cupra FIP Tour, and the
            federation events that are quietly redrawing the map.
          </p>
        </div>
      </section>

      {/* Sub-nav cards */}
      <section className="px-16 pb-48 md:px-32 lg:px-48">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
            {SUB_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-16 border bg-bg-white p-24 transition-colors hover:border-brand"
                style={{ borderColor: "var(--color-border-primary)" }}
              >
                <h2
                  className="font-display font-semibold text-title-m"
                  style={{ lineHeight: 1.2 }}
                >
                  {item.title}
                </h2>
                <p className="mt-8 font-body text-body-s text-text-secondary">
                  {item.body}
                </p>
                <span
                  className="mt-12 inline-block font-display font-semibold text-14"
                  style={{ color: "var(--color-brand, #FE4C00)" }}
                >
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Tour News */}
      {proArticles.length > 0 && (
        <section className="px-16 pb-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-baseline justify-between mb-24">
              <h2
                className="font-display text-mobile-heading-m md:text-desktop-heading-m"
                style={{ lineHeight: 1.1 }}
              >
                Latest from the tour
              </h2>
              <Link
                href="/news"
                className="font-display font-semibold text-14 hover:underline"
                style={{ color: "var(--color-brand, #FE4C00)" }}
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
              {proArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/news" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
