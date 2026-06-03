"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tabs from "@/components/v3/Tabs";
import ArticleCardHero from "@/components/v3/ArticleCardHero";
import ArticleCard from "@/components/v3/ArticleCard";
import ArticleCardHorizontal from "@/components/v3/ArticleCardHorizontal";
import type { Article } from "@/data/mock";

/**
 * Padel Hub home — client component for the category filter.
 *
 * Layout:
 *  1. Page title
 *  2. Tabs filter row (All / News / Reviews / Guides / Lifestyle / Business / Clubs / Training / Rules)
 *  3. Hero featured article (first article in filtered set)
 *  4. Editorial 2-column grid (1 large + 3 horizontal sidebar)
 *  5. Full-width grid of ArticleCard
 *  6. "Write for us" CTA injected every 6 articles in the grid
 */

type CategoryFilter = {
  label: string;
  slug: string | null; // null = "All"
  categories: Article["category"][]; // which Article.category values map here
};

// Tabs row. "All" shows everything. Other tabs filter by category buckets.
// We keep the tab labels short to fit the Figma row.
const FILTERS: CategoryFilter[] = [
  { label: "All", slug: null, categories: [] },
  {
    label: "News",
    slug: "news",
    categories: ["Tour News", "Rankings", "Academy"],
  },
  { label: "Reviews", slug: "reviews", categories: ["Reviews"] },
  { label: "Training", slug: "training", categories: ["Training"] },
  { label: "Lifestyle", slug: "lifestyle", categories: ["Lifestyle"] },
  { label: "Business", slug: "business", categories: ["Business"] },
  { label: "Clubs", slug: "clubs", categories: ["Clubs"] },
  { label: "Rules", slug: "rules", categories: ["Rules"] },
];

interface Props {
  articles: Article[];
}

export default function HubPageClient({ articles }: Props) {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  const validSlugs = FILTERS.map((f) => f.slug);

  const initial =
    queryCategory && validSlugs.includes(queryCategory) ? queryCategory : null;
  const [activeSlug, setActiveSlug] = useState<string | null>(initial);

  // Keep state in sync when the URL changes (e.g. header dropdown link).
  useEffect(() => {
    if (queryCategory && validSlugs.includes(queryCategory)) {
      setActiveSlug(queryCategory);
    } else if (!queryCategory) {
      setActiveSlug(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCategory]);

  const filtered = useMemo(() => {
    if (!activeSlug) return articles;
    const filter = FILTERS.find((f) => f.slug === activeSlug);
    if (!filter || filter.categories.length === 0) return articles;
    return articles.filter((a) => filter.categories.includes(a.category));
  }, [articles, activeSlug]);

  // Split: hero (1) + editorial main+sidebar (1 main + up to 4 horizontal) + grid (rest)
  const hero = filtered[0];
  const editorialMain = filtered[1];
  const editorialSidebar = filtered.slice(2, 6);
  const gridArticles = filtered.slice(6);

  const tabItems = FILTERS.map((f) => ({
    label: f.label,
    active: (activeSlug ?? null) === f.slug,
    onClick: () => setActiveSlug(f.slug),
  }));

  return (
    <main className="bg-bg-page">
      {/* Page title */}
      <section className="border-b border-border-primary">
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          <span className="text-uppercase-eyebrow text-brand">
            ■ Padel Hub
          </span>
          <h1 className="mt-12 text-mobile-display-l md:text-desktop-display-l text-text-primary">
            Padel Hub
          </h1>
          <p className="mt-16 max-w-[640px] text-body-l text-text-secondary">
            Stories, reviews, training, and everything else that makes padel
            the world&rsquo;s fastest-growing sport.
          </p>
        </div>
      </section>

      {/* Tabs filter row */}
      <section className="border-b border-border-primary bg-bg-page">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-12">
          <Tabs items={tabItems} ariaLabel="Hub category filter" />
        </div>
      </section>

      {filtered.length === 0 ? (
        <section>
          <div className="mx-auto max-w-[1320px] px-16 py-80 sm:px-24 lg:px-32">
            <p className="text-body-l text-text-secondary">
              No articles in this category yet — check back soon.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Hero featured article */}
          {hero && (
            <section>
              <div className="mx-auto max-w-[1320px] px-16 pt-32 sm:px-24 md:pt-48 lg:px-32">
                <ArticleCardHero article={hero} hrefBase="/hub" />
              </div>
            </section>
          )}

          {/* Editorial 2-column grid: 1 large + sidebar */}
          {editorialMain && (
            <section>
              <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
                <div className="grid grid-cols-1 gap-32 lg:grid-cols-12 lg:gap-40">
                  <div className="lg:col-span-7">
                    <ArticleCardHero
                      article={editorialMain}
                      hrefBase="/hub"
                      aspect="4 / 3"
                    />
                  </div>
                  <div className="flex flex-col gap-24 lg:col-span-5">
                    {editorialSidebar.map((a) => (
                      <ArticleCardHorizontal
                        key={a.slug}
                        article={a}
                        hrefBase="/hub"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Full-width 2-col grid with CTA injection every 6 */}
          {gridArticles.length > 0 && (
            <section className="border-t border-border-primary">
              <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
                <h2 className="mb-32 text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                  More from the Hub
                </h2>
                <div className="grid grid-cols-1 gap-x-24 gap-y-40 sm:grid-cols-2 lg:grid-cols-3">
                  {gridArticles.map((a, idx) => {
                    const showCta = (idx + 1) % 6 === 0;
                    return (
                      <div
                        key={a.slug}
                        className="contents"
                      >
                        <ArticleCard article={a} hrefBase="/hub" />
                        {showCta && (
                          <div className="flex flex-col gap-12 rounded-32 bg-bg-gray p-24">
                            <span className="text-uppercase-eyebrow text-brand">
                              ■ Write for us
                            </span>
                            <h3 className="text-title-l text-text-primary">
                              Have a padel story to tell?
                            </h3>
                            <p className="text-body-s text-text-secondary">
                              Pitch us your feature, review, or guide. We pay
                              for great editorial.
                            </p>
                            <Link
                              href="/contact"
                              className="mt-auto inline-flex w-fit items-center justify-center rounded-full bg-brand px-20 py-12 text-body-s-semibold text-text-contrast transition-opacity hover:opacity-90"
                            >
                              Get in touch →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
