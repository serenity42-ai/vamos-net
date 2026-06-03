import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/v3/ArticleCard";
import ArticleCardHorizontal from "@/components/v3/ArticleCardHorizontal";
import { fetchArticleBySlug, fetchArticles } from "@/lib/ghost";

// Revalidate every 60s so article edits in Ghost appear quickly.
export const revalidate = 60;

function formatEditorialDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

function readingTime(html: string): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await fetchArticles();

  const moreByAuthor = allArticles
    .filter((a) => a.slug !== slug && a.author === article.author)
    .slice(0, 6);

  const otherArticles = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .filter((a) => !moreByAuthor.find((m) => m.slug === a.slug))
    .slice(0, 4);

  const shareUrl = `https://vamos.net/hub/${slug}`;
  const mins = readingTime(article.body);

  // Schema.org Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "VAMOS",
      url: "https://vamos.net",
    },
    mainEntityOfPage: shareUrl,
  };

  return (
    <main className="bg-bg-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Article hero — split 2-col on desktop, stacked on mobile */}
      <section className="border-b border-border-primary">
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-24 flex items-center gap-8 text-uppercase-eyebrow"
          >
            <Link href="/hub" className="text-text-secondary hover:text-brand transition-colors">
              Hub
            </Link>
            <span aria-hidden className="text-text-tertiary">
              /
            </span>
            <span className="text-brand">{article.category}</span>
          </nav>

          <div className="grid grid-cols-1 gap-32 lg:grid-cols-12 lg:gap-48">
            {/* Left: eyebrow + title + deck + author row */}
            <div className="flex flex-col gap-20 lg:col-span-6 lg:order-1">
              <span className="text-uppercase-eyebrow text-brand">
                ■ {article.category}
              </span>
              <h1 className="text-mobile-display-l md:text-desktop-display-l text-text-primary">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-body-l text-text-secondary">
                  {article.excerpt}
                </p>
              )}
              <div className="mt-8 flex items-center gap-12 text-body-s text-text-secondary">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-bg-gray text-text-primary">
                  <span className="text-body-s-semibold">
                    {article.author.slice(0, 1)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-body-s-semibold text-text-primary">
                    {article.author}
                  </span>
                  <span>
                    {formatEditorialDate(article.date)} · {mins} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="lg:col-span-6 lg:order-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-32 bg-bg-gray">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-uppercase-eyebrow text-text-tertiary">
                      Vamos
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article body — narrow centered column */}
      <section>
        <div className="mx-auto max-w-[720px] px-16 py-40 sm:px-24 md:py-64">
          <div
            className="prose prose-base sm:prose-lg max-w-none break-words
              prose-headings:font-display prose-headings:font-bold prose-headings:uppercase
              prose-headings:text-text-primary
              prose-h2:text-mobile-heading-l md:prose-h2:text-desktop-heading-l
              prose-h2:mt-40 prose-h2:mb-16
              prose-p:text-body-l prose-p:text-text-primary
              prose-p:mb-20 prose-p:leading-relaxed
              prose-a:text-brand prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary
              prose-blockquote:border-l-4 prose-blockquote:border-brand
              prose-blockquote:bg-bg-gray prose-blockquote:not-italic
              prose-blockquote:py-16 prose-blockquote:px-24 prose-blockquote:rounded-16
              prose-blockquote:my-32
              prose-blockquote:font-display prose-blockquote:font-bold
              prose-img:rounded-16"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* Share row */}
          <div className="mt-40 flex flex-wrap items-center gap-12 border-t border-border-primary pt-24">
            <span className="text-uppercase-eyebrow text-text-secondary">
              Share:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                shareUrl,
              )}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-bg-gray px-16 py-8 text-body-s-semibold text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
            >
              X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-bg-gray px-16 py-8 text-body-s-semibold text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-bg-gray px-16 py-8 text-body-s-semibold text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* More by author — dark band */}
      {moreByAuthor.length > 0 && (
        <section className="bg-bg-constant text-text-contrast">
          <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
            <div className="mb-32 flex items-center gap-16">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-bg-page text-text-primary">
                <span className="text-title-m">
                  {article.author.slice(0, 1)}
                </span>
              </div>
              <div>
                <span className="text-uppercase-eyebrow text-brand">
                  ■ More by author
                </span>
                <h2 className="mt-4 text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
                  {article.author}
                </h2>
              </div>
            </div>

            <div className="-mx-16 flex gap-24 overflow-x-auto px-16 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0">
              {moreByAuthor.slice(0, 3).map((a) => (
                <div
                  key={a.slug}
                  className="w-[320px] shrink-0 rounded-32 bg-bg-page p-20 text-text-primary"
                >
                  <ArticleCardHorizontal article={a} hrefBase="/hub" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other articles — 4-col grid */}
      {otherArticles.length > 0 && (
        <section className="border-t border-border-primary">
          <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
            <div className="mb-32 flex items-end justify-between gap-16">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                Other articles
              </h2>
              <Link
                href={`/hub`}
                className="text-uppercase-eyebrow text-brand hover:opacity-80"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-x-24 gap-y-40 sm:grid-cols-2 lg:grid-cols-4">
              {otherArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/hub" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
