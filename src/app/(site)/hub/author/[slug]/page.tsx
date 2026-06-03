import Link from "next/link";
import ArticleCard from "@/components/v3/ArticleCard";
import { fetchArticles } from "@/lib/ghost";
import { authorSlug } from "../../author-slug";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await fetchArticles();
  const match = all.find((a) => authorSlug(a.author) === slug);
  const name = match?.author ?? "Author";
  return {
    title: `${name} | Padel Hub | VAMOS`,
    description: `Articles by ${name} on Vamos.net.`,
  };
}

/**
 * Author landing page (PH8). Shows the author's name + (placeholder) bio
 * and a grid of every article they have written. The Article schema does
 * not yet carry author bios, so we synthesize a neutral placeholder line —
 * this lets the page render cleanly today and the wording becomes the
 * obvious thing to update once Ghost exposes structured author objects.
 */
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await fetchArticles();
  const articles = all.filter((a) => authorSlug(a.author) === slug);

  // Resolve the canonical author name from any matching article. Empty
  // state still renders the page — we just show a friendly "no articles"
  // pane with a back link, per spec.
  const authorName =
    articles[0]?.author ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const initial = authorName.slice(0, 1).toUpperCase();

  return (
    <main className="bg-bg-page">
      {/* Author header */}
      <section className="border-b border-border-primary">
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          <nav
            aria-label="Breadcrumb"
            className="mb-24 flex items-center gap-8 text-uppercase-eyebrow"
          >
            <Link
              href="/hub"
              className="text-text-secondary hover:text-brand transition-colors"
            >
              Hub
            </Link>
            <span aria-hidden className="text-text-tertiary">
              /
            </span>
            <span className="text-brand">Author</span>
          </nav>

          <div className="flex flex-col items-start gap-20 md:flex-row md:items-center md:gap-32">
            <div className="flex h-72 w-72 shrink-0 items-center justify-center rounded-full bg-bg-gray text-text-primary md:h-96 md:w-96">
              <span className="text-mobile-heading-l md:text-desktop-heading-l">
                {initial}
              </span>
            </div>
            <div className="flex flex-col gap-12">
              <span className="text-uppercase-eyebrow text-brand">
                ■ Author
              </span>
              <h1 className="text-mobile-display-l md:text-desktop-display-l text-text-primary">
                {authorName}
              </h1>
              <p className="max-w-[640px] text-body-l text-text-secondary">
                Editorial contributor at Vamos.net covering the world of
                padel — tournaments, players, gear, and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <section>
          <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-16 px-16 py-80 sm:px-24 lg:px-32">
            <p className="text-body-l text-text-secondary">
              No articles found for this author yet.
            </p>
            <Link
              href="/hub"
              className="inline-flex w-fit items-center justify-center rounded-full bg-brand px-20 py-12 text-body-s-semibold text-text-contrast transition-opacity hover:opacity-90"
            >
              Back to the Hub
            </Link>
          </div>
        </section>
      ) : (
        <section>
          <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
            <h2 className="mb-32 text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
              All articles by {authorName}
            </h2>
            <div className="grid grid-cols-1 gap-x-24 gap-y-40 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/hub" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
