import Link from "next/link";
import type { Article } from "@/data/mock";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Image placeholder */}
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4ABED9]">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.date}</span>
          </div>
          <h3 className="text-lg font-bold text-[#0F1F2E] leading-snug group-hover:text-[#4ABED9] transition-colors mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
