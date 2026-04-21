"use client";

import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import type { Article } from "@/data/mock";

interface Props {
  articles: Article[];
  categories: readonly string[];
}

export default function NewsPageClient({ articles, categories }: Props) {
  const [category, setCategory] = useState<string>("All");

  const filtered = category === "All"
    ? articles
    : articles.filter((a) => a.category === category);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1F2E] mb-2">News</h1>
        <p className="text-sm sm:text-base text-gray-500">The latest from the world of padel</p>
      </div>

      {/* Category filter — horizontally scrollable on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto mb-6 sm:mb-8">
        <div className="flex gap-2 pb-2 sm:pb-0 sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                category === cat
                  ? "bg-[#4ABED9] text-white"
                  : "bg-gray-100 text-[#0F1F2E] hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 sm:py-16 text-gray-400">
          <p className="text-base sm:text-lg">No articles found in this category.</p>
        </div>
      )}
    </main>
  );
}
