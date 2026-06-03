import Link from "next/link";
import type { Article } from "@/data/mock";

/**
 * MostSearched — homepage right-rail block.
 *
 * Spec (Figma annotation, Homepage / Last News block):
 *   "Блок Most Searched — 4 статьи, которые чаще всего ищут."
 *
 * v1 reality: we don't have a search-analytics pipeline yet, so we surface
 * 4 most-recent articles. When search analytics exist (Plausible / GA / Ghost
 * stats), swap the input to the actual top-searched list.
 */

export interface MostSearchedProps {
  articles: Article[];
  title?: string;
  hrefBase?: string;
}

export default function MostSearched({
  articles,
  title = "Most Searched",
  hrefBase = "/hub",
}: MostSearchedProps) {
  const items = articles.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section
      className="bg-bg-white rounded-24 p-20"
      aria-labelledby="mostsearched-title"
    >
      <h3
        id="mostsearched-title"
        className="text-uppercase-eyebrow text-text-secondary mb-16"
      >
        {title}
      </h3>
      <ol className="flex flex-col gap-12">
        {items.map((article, idx) => (
          <li key={article.slug}>
            <Link
              href={`${hrefBase}/${article.slug}`}
              className="flex items-start gap-12 group"
            >
              <span
                className="font-display text-text-tertiary shrink-0"
                style={{ fontSize: 20, lineHeight: "24px", fontWeight: 700, width: 24 }}
              >
                {idx + 1}
              </span>
              <span className="text-body-m-semibold text-text-primary line-clamp-2 group-hover:text-brand transition-colors">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
