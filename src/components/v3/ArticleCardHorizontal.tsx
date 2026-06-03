import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/data/mock";

/**
 * ArticleCardHorizontal — small horizontal article row.
 *
 * Spec:
 *  - Square thumb on left (120×120), text right (eyebrow + 2-line title + meta)
 *  - Used in sidebars and "more like this" lists
 */

function formatEditorialDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export interface ArticleCardHorizontalProps {
  article: Article;
  hrefBase?: string;
  /** Optional smaller thumb (88×88) — defaults to 120×120. */
  size?: "sm" | "md";
}

export default function ArticleCardHorizontal({
  article,
  hrefBase = "/news",
  size = "md",
}: ArticleCardHorizontalProps) {
  const href = `${hrefBase}/${article.slug}`;
  const thumbCls = size === "sm" ? "h-[88px] w-[88px]" : "h-[120px] w-[120px]";

  return (
    <Link href={href} className="group block">
      <article className="flex items-start gap-16">
        <div
          className={`relative shrink-0 overflow-hidden rounded-16 bg-bg-gray ${thumbCls}`}
        >
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-tertiary">
              <span className="text-body-s">Vamos</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <span className="text-uppercase-eyebrow text-brand">
            {article.category}
          </span>
          <h3 className="text-title-m line-clamp-2 text-text-primary group-hover:text-brand transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center gap-8 text-body-s text-text-secondary">
            <span className="truncate">{article.author}</span>
            <span aria-hidden>·</span>
            <span>{formatEditorialDate(article.date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
