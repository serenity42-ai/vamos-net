import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/data/mock";

/**
 * ArticleCard — image-top news/article card (replaces NewsCard).
 *
 * Spec:
 *  - Image on top (16:9), rounded radius-16
 *  - Orange category eyebrow (text-uppercase-eyebrow color brand)
 *  - Title text-title-m, 2-line clamp
 *  - Meta row: author + date + reading time (text-body-s text-text-secondary)
 *  - No border by default — clean cards on bg-page
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

export interface ArticleCardProps {
  article: Article;
  /** Path prefix for the article link, e.g. "/hub" or "/news". */
  hrefBase?: string;
}

export default function ArticleCard({
  article,
  hrefBase = "/news",
}: ArticleCardProps) {
  const href = `${hrefBase}/${article.slug}`;
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col gap-12">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-16 bg-bg-gray">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-[center_25%] transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-gray text-text-tertiary">
              <span className="text-uppercase-eyebrow">Vamos</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-8">
          <span className="text-uppercase-eyebrow text-brand">
            {article.category}
          </span>
          <h3 className="text-title-l line-clamp-2 text-text-primary group-hover:text-brand transition-colors">
            {article.title}
          </h3>
          <div className="mt-auto flex items-center gap-8 text-body-s text-text-secondary">
            <span className="truncate">{article.author}</span>
            <span aria-hidden>·</span>
            <span>{formatEditorialDate(article.date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
