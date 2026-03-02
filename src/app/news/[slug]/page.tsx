import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import { articles } from "@/data/mock";

function ShareButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#0F1F2E] transition-colors whitespace-nowrap"
    >
      {label}
    </a>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const related = articles
    .filter((a) => a.slug !== slug)
    .filter((a) => a.category === article.category)
    .slice(0, 3);

  const shareUrl = `https://vamos.net/news/${slug}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Main content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 sm:mb-6">
            <Link href="/news" className="hover:text-[#4ABED9] transition-colors">
              News
            </Link>
            <span>/</span>
            <span className="text-[#4ABED9] truncate">{article.category}</span>
          </nav>

          {/* Category badge */}
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#4ABED9] mb-3">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F1F2E] leading-tight mb-4 break-words">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-500 mb-6">
            <span>By {article.author}</span>
            <span className="text-gray-300">|</span>
            <span>{article.date}</span>
          </div>

          {/* Featured image placeholder */}
          <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 sm:mb-8 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          {/* Share buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Share:</span>
            <ShareButton label="X / Twitter" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} />
            <ShareButton label="Facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} />
            <ShareButton label="LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} />
            <ShareButton label="Copy Link" href="#" />
          </div>

          {/* Article body */}
          <div
            className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-relaxed break-words
              prose-headings:text-[#0F1F2E] prose-headings:font-bold
              prose-a:text-[#4ABED9] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 mt-10 lg:mt-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              Related Articles
            </h3>
            <div className="space-y-4">
              {related.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>

            {related.length === 0 && (
              <p className="text-sm text-gray-400">No related articles found.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
