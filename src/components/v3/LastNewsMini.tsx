import Link from "next/link";
import type { Article } from "@/data/mock";

/**
 * LastNewsMini — homepage right-rail block.
 *
 * Spec (Figma annotation, Homepage / Last News):
 *   "Last News — В блоке "Best News" отображаем послежние новости из всех
 *    разделов кроме "Review"."
 *
 * Simple list of titles with hover affordance. Excludes Reviews upstream.
 */

export interface LastNewsMiniProps {
  articles: Article[];
  title?: string;
  hrefBase?: string;
  limit?: number;
}

export default function LastNewsMini({
  articles,
  title = "Last News",
  hrefBase = "/hub",
  limit = 5,
}: LastNewsMiniProps) {
  const items = articles.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section
      className="bg-bg-white rounded-24 p-20"
      aria-labelledby="lastnewsmini-title"
    >
      <h3
        id="lastnewsmini-title"
        className="text-uppercase-eyebrow text-text-secondary mb-16"
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-12 divide-y divide-border-primary">
        {items.map((article, idx) => (
          <li key={article.slug} className={idx === 0 ? "" : "pt-12"}>
            <Link
              href={`${hrefBase}/${article.slug}`}
              className="block group"
            >
              <p className="text-body-m-semibold text-text-primary line-clamp-2 group-hover:text-brand transition-colors">
                {article.title}
              </p>
              {article.category && (
                <p className="text-uppercase-eyebrow text-brand mt-4">
                  {article.category}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
