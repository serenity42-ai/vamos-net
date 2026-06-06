"use client";

import { useState, useEffect, useMemo, useRef, Fragment } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Tabs from "@/components/v3/Tabs";
import ArticleCardHero from "@/components/v3/ArticleCardHero";
import ArticleCard from "@/components/v3/ArticleCard";
import CategoryPill, {
  type CategoryOption,
} from "@/components/v3/CategoryPill";
import WriteForUsBlock from "@/components/v3/WriteForUsBlock";
import SpecialBlock from "@/components/v3/SpecialBlock";
import type { Article } from "@/data/mock";

/**
 * Padel Hub home — client component for the category filter (Figma PH1–PH7).
 *
 * Layout:
 *  1. Page title
 *  2. Top tabs (sticky on scroll) — filter by CONTENT TYPE (?type=)
 *      All / News / Reviews / Guides
 *  3. Secondary "Category:" pill — only shown when a non-All type is active;
 *      filters by sub-category (?category=) via a radio-style dropdown.
 *  4. Article feed in alternating chunks (1 hero, then 2 cards, repeat).
 *  5. Mid-feed injections: WriteForUsBlock every 6 cards, SpecialBlock every
 *      12 cards (full-row).
 *  6. Infinite scroll via IntersectionObserver, fallback "Load more" button.
 */

type TypeFilter = {
  label: string;
  slug: string | null; // null = "All"
  categories: Article["category"][]; // article.category values that belong here
  /** Sub-category options exposed via the CategoryPill, if any. */
  subcategories?: CategoryOption[];
};

const TYPE_FILTERS: TypeFilter[] = [
  { label: "All", slug: null, categories: [] },
  {
    label: "News",
    slug: "news",
    categories: ["Tour News", "Rankings", "Academy", "Business"],
    subcategories: [
      { label: "All", value: "all" },
      { label: "Industry", value: "industry" },
      { label: "Interviews", value: "interviews" },
      { label: "Players", value: "players" },
      { label: "Tournaments", value: "tournaments" },
      { label: "Highlights", value: "highlights" },
    ],
  },
  {
    label: "Reviews",
    slug: "reviews",
    categories: ["Reviews"],
    subcategories: [
      { label: "All", value: "all" },
      { label: "Rackets", value: "rackets" },
      { label: "Shoes", value: "shoes" },
      { label: "Clothes", value: "clothes" },
      { label: "Locations", value: "locations" },
    ],
  },
  {
    label: "Guides",
    slug: "guides",
    categories: ["Training", "Rules", "Lifestyle", "Clubs"],
    subcategories: [
      { label: "All", value: "all" },
      { label: "Training", value: "training" },
      { label: "Rules", value: "rules" },
      { label: "Lifestyle", value: "lifestyle" },
      { label: "Clubs", value: "clubs" },
    ],
  },
];

/**
 * Map a Hub sub-category slug to the article.category values that match it.
 * Most slugs match a single category 1:1, but some news subcategories like
 * "industry" / "interviews" don't yet exist in the data taxonomy and are
 * intentionally permissive (return null → no extra filter applied) so the
 * UI doesn't render empty states for content the CMS hasn't produced yet.
 */
function subcategoryMatcher(
  typeSlug: string,
  subSlug: string,
): ((a: Article) => boolean) | null {
  if (subSlug === "all") return null;

  // Reviews
  if (typeSlug === "reviews") {
    // Sub-categories like Rackets/Shoes/Clothes/Locations aren't in the
    // current Article schema. Until the CMS adds tags, match against the
    // article title/excerpt as a best-effort fallback.
    return (a) => {
      const haystack = `${a.title} ${a.excerpt}`.toLowerCase();
      return haystack.includes(subSlug);
    };
  }

  // Guides — sub categories ARE first-class Article.category values.
  if (typeSlug === "guides") {
    const map: Record<string, Article["category"]> = {
      training: "Training",
      rules: "Rules",
      lifestyle: "Lifestyle",
      clubs: "Clubs",
    };
    const target = map[subSlug];
    if (!target) return null;
    return (a) => a.category === target;
  }

  // News — current data doesn't carry industry/interviews/players/tournaments
  // sub-tags. Fall back to title/excerpt substring match so the filter UI
  // works against existing copy without forcing a CMS schema change.
  if (typeSlug === "news") {
    return (a) => {
      const haystack = `${a.title} ${a.excerpt}`.toLowerCase();
      return haystack.includes(subSlug);
    };
  }

  return null;
}

const PAGE_SIZE = 12;

interface Props {
  articles: Article[];
}

export default function HubPageClient({ articles }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const queryType = searchParams.get("type");
  const queryCategory = searchParams.get("category");
  const preview = searchParams.get("preview");

  const validTypeSlugs = TYPE_FILTERS.map((f) => f.slug);

  const initialType =
    queryType && validTypeSlugs.includes(queryType) ? queryType : null;
  const [activeType, setActiveType] = useState<string | null>(initialType);
  const [activeCategory, setActiveCategory] = useState<string>(
    queryCategory ?? "all",
  );

  // Reset the loaded count whenever the filters change so the feed doesn't
  // jump back to a stale scroll position with the wrong content.
  const [loadedCount, setLoadedCount] = useState<number>(PAGE_SIZE);

  // Keep state in sync when the URL changes (e.g. header link, back button).
  useEffect(() => {
    if (queryType && validTypeSlugs.includes(queryType)) {
      setActiveType(queryType);
    } else if (!queryType) {
      setActiveType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryType]);

  useEffect(() => {
    setActiveCategory(queryCategory ?? "all");
  }, [queryCategory]);

  // Push filter changes into the URL so the page is shareable / browser
  // history works. Preserve the `preview` query so editor previews don't
  // get stripped by client-side navigation.
  function pushFilters(nextType: string | null, nextCategory: string) {
    const params = new URLSearchParams();
    if (nextType) params.set("type", nextType);
    if (nextCategory && nextCategory !== "all")
      params.set("category", nextCategory);
    if (preview) params.set("preview", preview);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleTypeChange(slug: string | null) {
    setActiveType(slug);
    setActiveCategory("all");
    setLoadedCount(PAGE_SIZE);
    pushFilters(slug, "all");
  }

  function handleCategoryChange(value: string) {
    setActiveCategory(value);
    setLoadedCount(PAGE_SIZE);
    pushFilters(activeType, value);
  }

  // Compute the filtered list.
  const filtered = useMemo(() => {
    let list = articles;
    if (activeType) {
      const tf = TYPE_FILTERS.find((f) => f.slug === activeType);
      if (tf && tf.categories.length > 0) {
        list = list.filter((a) => tf.categories.includes(a.category));
      }
      const matcher = subcategoryMatcher(activeType, activeCategory);
      if (matcher) list = list.filter(matcher);
    }
    return list;
  }, [articles, activeType, activeCategory]);

  const visible = useMemo(
    () => filtered.slice(0, loadedCount),
    [filtered, loadedCount],
  );

  // Infinite scroll: observe a sentinel near the bottom; when it enters the
  // viewport, request the next page. Falls back to a "Load more" button so
  // keyboard users (and tests) can still reach the deeper feed.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (loadedCount >= filtered.length) return;
    const node = sentinelRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoadedCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
          }
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadedCount, filtered.length]);

  const tabItems = [
    ...TYPE_FILTERS.map((f) => ({
      label: f.label,
      active: (activeType ?? null) === f.slug,
      onClick: () => handleTypeChange(f.slug),
    })),
    // Tour Calendar: navigation link to /tournaments — not a content-type filter.
    // Rendered as an href tab so it navigates rather than filters the Hub feed.
    {
      label: "Tour Calendar",
      href: "/tournaments",
      active: false, // never active while on /hub
    },
  ];

  const activeTypeFilter = TYPE_FILTERS.find((f) => f.slug === activeType);
  const subOptions = activeTypeFilter?.subcategories;

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

      {/* Tabs filter row — sticky under the global header (PH4).
          The header sits at ~80px so we pin tabs just under it. */}
      {/* top-[56px] on mobile accounts for the 56px MobileHeader; on md+ the desktop Header is 80px */}
      <section className="sticky top-[56px] md:top-[80px] z-30 border-b border-border-primary bg-bg-page">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-12">
          <Tabs items={tabItems} ariaLabel="Hub content type filter" />
        </div>
      </section>

      {/* Secondary CategoryPill — only when a non-All type is active */}
      {subOptions && subOptions.length > 0 && (
        <section className="bg-bg-page">
          <div className="mx-auto max-w-[1320px] px-16 pt-24 sm:px-24 lg:px-32">
            <CategoryPill
              options={subOptions}
              value={activeCategory}
              onChange={handleCategoryChange}
              label="Category"
            />
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <section>
          <div className="mx-auto max-w-[1320px] px-16 py-80 sm:px-24 lg:px-32">
            <p className="text-body-l text-text-secondary">
              No articles in this category yet — check back soon.
            </p>
          </div>
        </section>
      ) : (
        <section>
          <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
            <FeedRenderer articles={visible} />

            {loadedCount < filtered.length && (
              <div className="mt-40 flex flex-col items-center gap-16">
                {/* Sentinel for the IntersectionObserver — invisible but
                    occupies a slim row so the observer can fire. */}
                <div ref={sentinelRef} aria-hidden className="h-1 w-1" />
                <button
                  type="button"
                  onClick={() =>
                    setLoadedCount((c) =>
                      Math.min(c + PAGE_SIZE, filtered.length),
                    )
                  }
                  className="inline-flex items-center justify-center rounded-full border border-border-primary bg-bg-white px-24 py-12 text-body-s-semibold text-text-primary transition-colors hover:bg-bg-gray"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * FeedRenderer — turns an article list into the alternating hero/2-card
 * pattern (PH1) and injects WriteForUsBlock (every 6 articles) and
 * SpecialBlock (every 12, full row) into the stream.
 *
 * Chunking rule:
 *   Block of 3 = [hero, card, card]
 *   Renders the hero full-width, then the next 2 in a 2-col grid.
 *
 * Injections are positioned at article boundaries (after N articles)
 * rather than inside a row, so the alternating rhythm stays clean.
 */
function FeedRenderer({ articles }: { articles: Article[] }) {
  // Build a "stream" of section-level chunks: each chunk is either a "hero"
  // chunk (1 article), a "pair" chunk (2 articles), an "injection" chunk
  // (WriteForUs or Special), in the right order.
  type Chunk =
    | { kind: "hero"; article: Article }
    | { kind: "pair"; articles: Article[] }
    | { kind: "writeForUs" }
    | { kind: "special" };

  const chunks: Chunk[] = [];
  let consumed = 0;
  let block = 0; // counts blocks-of-3 we've emitted

  while (consumed < articles.length) {
    // Hero (1 card)
    chunks.push({ kind: "hero", article: articles[consumed] });
    consumed += 1;

    // Pair (up to 2 cards)
    const pair = articles.slice(consumed, consumed + 2);
    if (pair.length > 0) {
      chunks.push({ kind: "pair", articles: pair });
      consumed += pair.length;
    }

    block += 1;

    // After every 4th block (= 12 articles) inject a SpecialBlock; after
    // every 2nd block (= 6 articles) inject a WriteForUs. The SpecialBlock
    // takes priority on the 4th-block boundary so we don't double-inject.
    if (block > 0 && block % 4 === 0) {
      chunks.push({ kind: "special" });
    } else if (block > 0 && block % 2 === 0) {
      chunks.push({ kind: "writeForUs" });
    }
  }

  return (
    <div className="flex flex-col gap-32 md:gap-48">
      {chunks.map((chunk, idx) => {
        switch (chunk.kind) {
          case "hero":
            return (
              <Fragment key={`hero-${idx}`}>
                <ArticleCardHero article={chunk.article} hrefBase="/hub" />
              </Fragment>
            );
          case "pair":
            return (
              <div
                key={`pair-${idx}`}
                className="grid grid-cols-1 gap-x-24 gap-y-40 sm:grid-cols-2"
              >
                {chunk.articles.map((a) => (
                  <ArticleCard key={a.slug} article={a} hrefBase="/hub" />
                ))}
              </div>
            );
          case "writeForUs":
            return (
              <Fragment key={`wfu-${idx}`}>
                <WriteForUsBlock />
              </Fragment>
            );
          case "special":
            return (
              <Fragment key={`special-${idx}`}>
                <SpecialBlock />
              </Fragment>
            );
        }
      })}
    </div>
  );
}
