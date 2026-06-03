import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/v3/ArticleCard";
import ArticleCardHorizontal from "@/components/v3/ArticleCardHorizontal";
import PhotoGallery from "@/components/v3/PhotoGallery";
import ReviewSpecTable from "@/components/v3/ReviewSpecTable";
import ShareActions from "@/components/v3/ShareActions";
import TagsRow from "@/components/v3/TagsRow";
import WhereToBuyList from "@/components/v3/WhereToBuyList";
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

/** Slugify any string into a URL-safe handle. Reused for author + tag links. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Detect a YouTube link in an article body and return the iframe src.
 * Returns null if none found. Supports youtu.be and youtube.com/watch?v= forms.
 */
function detectYouTubeEmbed(body: string): string | null {
  if (!body) return null;
  const patterns: RegExp[] = [
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i,
    /https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
  ];
  for (const re of patterns) {
    const m = body.match(re);
    if (m && m[1]) {
      return `https://www.youtube.com/embed/${m[1]}`;
    }
  }
  return null;
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

  // ── Variant detection ─────────────────────────────────────────────────────
  // A1 podcast: YouTube link in body (or future `video` field). Article type
  // has no `video` field today, so we lean on the body scan.
  const youtubeEmbedSrc = detectYouTubeEmbed(article.body);
  const isPodcast = Boolean(youtubeEmbedSrc);

  // A2 review: category === "Reviews" (mock.ts uses plural, A2 spec allows both).
  const isReview =
    article.category === "Reviews" ||
    (article.category as string) === "Review";

  // A8 tags: Article type has no `tags` field yet; derive from category so the
  // chip row never renders empty.
  const tags: string[] = [article.category].filter(Boolean) as string[];

  // A3 author byline → /hub/author/[slug]
  const authorSlug = slugify(article.author);
  const authorHref = `/hub/author/${authorSlug}`;

  // A4 Where-to-Buy placeholder data — only when review.
  const placeholderShops = isReview
    ? [
        {
          name: "Padel Nuestro",
          priceFrom: "€289",
          rating: 4.7,
          url: "https://www.padelnuestro.com/",
        },
        {
          name: "Padel Point",
          priceFrom: "€295",
          rating: 4.5,
          url: "https://www.padel-point.com/",
        },
        {
          name: "Padel Market",
          priceFrom: "€299",
          rating: 4.4,
          url: "https://www.padelmarket.com/",
        },
      ]
    : [];

  // Photo gallery placeholder for review variant — uses the hero image so it
  // always has at least one photo to open.
  const galleryPhotos = isReview && article.imageUrl
    ? [
        { src: article.imageUrl, alt: article.title },
      ]
    : [];

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

              {/* A3 — Author info block. Clickable name + avatar → author page.
                  Save-to-favourites star intentionally omitted (dropped for v1). */}
              <div className="mt-8 flex items-center gap-12 text-body-s text-text-secondary">
                <Link
                  href={authorHref}
                  aria-label={`More articles by ${article.author}`}
                  className="flex h-40 w-40 items-center justify-center rounded-full bg-bg-gray text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
                >
                  <span className="text-body-s-semibold">
                    {article.author.slice(0, 1)}
                  </span>
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={authorHref}
                    className="text-body-s-semibold text-text-primary transition-colors hover:text-brand"
                  >
                    {article.author}
                  </Link>
                  <span>
                    {formatEditorialDate(article.date)} · {mins} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Right: hero — A1 podcast variant renders a YouTube iframe instead
                of (and above) the still image. Default variant keeps the image. */}
            <div className="lg:col-span-6 lg:order-2">
              {isPodcast && youtubeEmbedSrc ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-32 bg-bg-constant">
                  <iframe
                    src={youtubeEmbedSrc}
                    title={article.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Review add-ons — A2 photo gallery + spec table. A4 where-to-buy
          renders below the body. Block hidden entirely for non-reviews. */}
      {isReview && (galleryPhotos.length > 0 || true) && (
        <section className="border-b border-border-primary">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-32 px-16 py-40 sm:px-24 md:py-64 lg:grid-cols-12 lg:gap-48 lg:px-32">
            <div className="lg:col-span-7">
              {galleryPhotos.length > 0 && (
                <PhotoGallery photos={galleryPhotos} title="Gallery" />
              )}
            </div>
            <div className="lg:col-span-5">
              <ReviewSpecTable />
            </div>
          </div>
        </section>
      )}

      {/* Article body — narrow centered column */}
      <section>
        <div className="mx-auto max-w-[720px] px-16 py-40 sm:px-24 md:py-64">
          {/* A5 single-shop "Buy in X" button intentionally hidden for v1
              (no partner-shop data). */}

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

          {/* A7 — Action row: share button (favourites star dropped). */}
          <div className="mt-40 border-t border-border-primary pt-24">
            <ShareActions url={shareUrl} title={article.title} />
          </div>

          {/* A8 — Tags row. */}
          <div className="mt-24">
            <TagsRow tags={tags} hrefBase="/hub" />
          </div>

          {/* A4 — Where to Buy (multi-shop) — review only. v1 placeholder. */}
          {isReview && placeholderShops.length > 0 && (
            <div className="mt-40">
              <WhereToBuyList
                productName={article.title}
                shops={placeholderShops}
                eyebrow="Coming soon"
              />
            </div>
          )}
        </div>
      </section>

      {/* A9 — More by author. Dynamic heading. Horizontal scroll on mobile. */}
      {moreByAuthor.length > 0 && (
        <section className="bg-bg-constant text-text-contrast">
          <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
            <div className="mb-32 flex items-center gap-16">
              <Link
                href={authorHref}
                aria-label={`More articles by ${article.author}`}
                className="flex h-48 w-48 items-center justify-center rounded-full bg-bg-page text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
              >
                <span className="text-title-m">
                  {article.author.slice(0, 1)}
                </span>
              </Link>
              <div>
                <span className="text-uppercase-eyebrow text-brand">
                  ■ More by author
                </span>
                <h2 className="mt-4 text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
                  <Link href={authorHref} className="transition-colors hover:text-brand">
                    More articles by {article.author}
                  </Link>
                </h2>
              </div>
            </div>

            <div className="-mx-16 flex gap-24 overflow-x-auto px-16 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {moreByAuthor.map((a) => (
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
