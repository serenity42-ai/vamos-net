import Link from "next/link";
import type { Article } from "@/data/mock";

/** Pretty date: '2026-03-30T00:00:00.000Z' -> '30 Mar 2026'. */
function formatEditorialDate(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) {
    // Fallback to the raw string if it's not an ISO date.
    return input;
  }
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Editorial news card — hairline border, eyebrow metadata in mono,
 * tight headline in Archivo 800, body in soft ink.
 */
export default function NewsCard({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block h-full">
      <article
        className="h-full flex flex-col transition-colors"
        style={{ border: "1px solid var(--ink)", background: "var(--paper)" }}
      >
        {/* Article image */}
        <div
          className="aspect-[16/9] relative overflow-hidden"
          style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--ink)" }}
        >
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "skewX(-6deg)" }}>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontStyle: "italic",
                  fontWeight: 900,
                  fontSize: 42,
                  color: "var(--paper)",
                  letterSpacing: "-0.045em",
                }}
              >
                Vamos<span style={{ color: "var(--red)" }}>!</span>
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Eyebrow: category + date */}
          <div
            className="flex items-center gap-3 mb-3"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--red)" }}>■ {article.category}</span>
            <span style={{ color: "var(--mute)" }}>{formatEditorialDate(article.date)}</span>
          </div>

          {/* Title */}
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 800,
              fontSize: 18,
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p
            className="line-clamp-2"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--ink-soft)",
              marginTop: "auto",
            }}
          >
            {article.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
