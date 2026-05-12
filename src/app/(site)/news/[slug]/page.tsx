import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import { fetchArticleBySlug, fetchArticles } from "@/lib/ghost";

// Revalidate every 60 seconds so article edits in Ghost appear quickly.
export const revalidate = 60;

/** Pretty date: '2026-03-30T00:00:00.000Z' -> '30 Mar 2026'. */
function formatEditorialDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function ShareButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn"
      style={{ fontSize: 10, letterSpacing: "0.14em" }}
    >
      {label}
    </a>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await fetchArticles();
  const related = allArticles
    .filter((a) => a.slug !== slug)
    .filter((a) => a.category === article.category)
    .slice(0, 3);

  const shareUrl = `https://vamos.net/news/${slug}`;

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
    <main style={{ background: "var(--paper)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main content */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 mb-6"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <Link href="/news" className="transition-colors" style={{ color: "var(--mute)" }}>
                News
              </Link>
              <span style={{ color: "var(--mute)" }}>/</span>
              <span style={{ color: "var(--red)" }}>■ {article.category}</span>
            </nav>

            <h1
              className="display break-words"
              style={{ marginBottom: 20 }}
            >
              {article.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-3 mb-8"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--mute)",
              }}
            >
              <span>By {article.author}</span>
              <span>·</span>
              <span>{formatEditorialDate(article.date)}</span>
            </div>

            <div
              className="aspect-[16/9] mb-10 overflow-hidden relative"
              style={{ border: "1px solid var(--ink)", background: "var(--paper-2)" }}
            >
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: "skewX(-6deg)" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontStyle: "italic",
                      fontWeight: 900,
                      fontSize: 96,
                      color: "var(--paper)",
                      letterSpacing: "-0.045em",
                    }}
                  >
                    Vamos<span style={{ color: "var(--red)" }}>!</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-10">
              <span
                className="eyebrow"
                style={{ color: "var(--mute)", marginRight: 8 }}
              >
                Share:
              </span>
              <ShareButton label="X" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} />
              <ShareButton label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} />
              <ShareButton label="LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} />
              <ShareButton label="Copy" href="#" />
            </div>

            <div
              className="prose prose-base sm:prose-lg max-w-none break-words
                prose-p:mb-5 prose-p:leading-relaxed
                prose-headings:mt-10 prose-headings:mb-4"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="sticky top-24">
              <div
                className="eyebrow"
                style={{ color: "var(--red)", marginBottom: 20 }}
              >
                ■ Related
              </div>
              <div className="space-y-6">
                {related.map((a) => (
                  <NewsCard key={a.slug} article={a} />
                ))}
              </div>
              {related.length === 0 && (
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "var(--mute)",
                  }}
                >
                  No related articles.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
