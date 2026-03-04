import Link from "next/link";
import type { Article } from "@/data/mock";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <article className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Article image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-300">VAMOS</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4ABED9]">
              {article.category}
            </span>
            <span className="text-xs text-gray-400">{article.date}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0F1F2E] leading-snug group-hover:text-[#4ABED9] transition-colors mb-2 line-clamp-2">
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
