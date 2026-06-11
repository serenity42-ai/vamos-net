import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/data/mock";

/**
 * ArticleCardHero — full-bleed featured article card with dark overlay.
 *
 * Spec:
 *  - Image fills card, dark linear gradient overlay
 *  - Orange category eyebrow
 *  - Large title (mobile-heading-l / desktop-heading-l)
 *  - Author + date meta in white/muted
 *  - Rounded radius-32
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

export interface ArticleCardHeroProps {
  article: Article;
  hrefBase?: string;
  /** Override aspect ratio (default 16/9 desktop, square-ish on mobile). */
  aspect?: string;
}

export default function ArticleCardHero({
  article,
  hrefBase = "/news",
  aspect = "16 / 9",
}: ArticleCardHeroProps) {
  const href = `${hrefBase}/${article.slug}`;
  return (
    <Link href={href} className="group block w-full">
      <article
        className="relative w-full overflow-hidden rounded-32 bg-bg-constant text-text-contrast"
        style={{ aspectRatio: aspect, minHeight: 320 }}
      >
        {/* Image fill */}
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority
            className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 80% 50%, rgba(254,76,0,0.35) 0%, rgba(24,29,39,1) 60%)",
            }}
          />
        )}

        {/* Dark gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(24,29,39,0.95) 0%, rgba(24,29,39,0.55) 45%, rgba(24,29,39,0.15) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-[5] flex h-full flex-col justify-end gap-12 p-24 md:p-32 lg:p-40">
          <span className="text-uppercase-eyebrow text-brand">
            {article.category}
          </span>
          <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="hidden text-body-l text-text-contrast/85 md:block line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-8 text-body-s text-text-contrast/80">
            <span className="truncate">{article.author}</span>
            <span aria-hidden>·</span>
            <span>{formatEditorialDate(article.date)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
