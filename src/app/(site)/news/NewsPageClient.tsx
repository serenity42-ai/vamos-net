"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import type { Article } from "@/data/mock";

interface Props {
  articles: Article[];
  categories: readonly string[];
}

export default function NewsPageClient({ articles, categories }: Props) {
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  // Initialize from ?category= URL param if present and valid; else "All".
  const initial =
    queryCategory && categories.includes(queryCategory) ? queryCategory : "All";
  const [category, setCategory] = useState<string>(initial);

  // Keep state in sync if URL category changes (e.g. user clicks a different
  // News dropdown item without leaving the page).
  useEffect(() => {
    if (queryCategory && categories.includes(queryCategory)) {
      setCategory(queryCategory);
    } else if (!queryCategory) {
      setCategory("All");
    }
  }, [queryCategory, categories]);

  const filtered =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Header band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
            ■ Section 02 · Editorial
          </div>
          <h1 className="display" style={{ marginBottom: 16 }}>
            The <span className="italic-serif">news</span>.
          </h1>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.5,
              color: "var(--ink-soft)",
              maxWidth: 560,
            }}
          >
            Recaps, previews, and the stories that shape the world of professional padel.
          </p>
        </div>
      </section>

      {/* Filter chips */}
      <section style={{ borderBottom: "1px solid var(--ink)", background: "var(--paper-2)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span
              className="eyebrow shrink-0"
              style={{ color: "var(--mute)", paddingRight: 16, borderRight: "1px solid var(--ink)" }}
            >
              ■ Filter
            </span>
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="transition-colors whitespace-nowrap shrink-0"
                  style={{
                    padding: "8px 14px",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    border: `1px solid ${active ? "var(--red)" : "var(--ink)"}`,
                    background: active ? "var(--red)" : "transparent",
                    color: active ? "#fff" : "var(--ink)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {filtered.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: "var(--mute)",
                }}
              >
                No articles found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
