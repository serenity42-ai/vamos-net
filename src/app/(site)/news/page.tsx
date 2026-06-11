import type { Metadata } from "next";
import Link from "next/link";
import { fetchArticles } from "@/lib/ghost";
import ArticleCard from "@/components/v3/ArticleCard";

/**
 * News & Recaps — Pro Padel sub-page.
 *
 * Replaces the previous /news → /hub redirect (three-pillar pivot,
 * 2026-06-11). Tab name = content name: this page is titled "News".
 */

export const metadata: Metadata = {
  title: "Padel News & Tour Recaps | Vamos.net",
  description:
    "Tournament recaps, pair-formation breakdowns, transfer stories, and tour news from Premier Padel, Cupra FIP Tour, and federation events.",
  robots: { index: true, follow: true },
};

export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vamos.net" },
    { "@type": "ListItem", position: 2, name: "Pro Padel", item: "https://vamos.net/pro" },
    { "@type": "ListItem", position: 3, name: "News", item: "https://vamos.net/news" },
  ],
};

const NEWS_CATEGORIES = new Set(["Tour News", "Rankings", "Academy"]);

export default async function NewsPage() {
  const articles = await fetchArticles();
  const newsArticles = articles.filter((a) => NEWS_CATEGORIES.has(a.category));
  const lead = newsArticles[0];
  const rest = newsArticles.slice(1);

  return (
    <main className="bg-bg-page text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="px-16 pt-48 pb-32 md:px-32 md:pt-64 md:pb-48 lg:px-48">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-display font-semibold uppercase tracking-wide text-body-s"
            style={{ color: "var(--color-brand, #FE4C00)" }}
          >
            <Link href="/pro" className="hover:underline">Pro Padel</Link>
            <span aria-hidden="true"> / </span>
            <span>News</span>
          </p>
          <h1
            className="font-display mt-8 text-mobile-heading-l md:text-desktop-heading-xl"
            style={{ lineHeight: 1.05 }}
          >
            News &amp; Recaps
          </h1>
          <p className="mt-16 font-body text-mobile-body-l md:text-desktop-body-l max-w-3xl">
            Tournament recaps, pair-formation breakdowns, transfer stories. The
            storylines behind the results.
          </p>
        </div>
      </section>

      {lead && (
        <section className="px-16 py-32 md:px-32 md:py-48 lg:px-48">
          <div className="mx-auto max-w-6xl">
            <ArticleCard article={lead} hrefBase="/news" />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="px-16 pb-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/news" />
              ))}
            </div>
          </div>
        </section>
      )}

      {newsArticles.length === 0 && (
        <section className="px-16 py-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-mobile-body-l md:text-desktop-body-l text-text-secondary">
              No news articles published yet. Check back shortly.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
