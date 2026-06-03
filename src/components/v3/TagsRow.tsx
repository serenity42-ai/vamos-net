/**
 * TagsRow (v3) — chip-style tag links at the bottom of an article.
 *
 * Annotation A8: each tag links to /hub?tag=[slug]. Server component — pure
 * presentational; no client state needed.
 */

import Link from "next/link";

export interface TagsRowProps {
  tags: string[];
  hrefBase?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TagsRow({ tags, hrefBase = "/hub" }: TagsRowProps) {
  const cleaned = Array.from(
    new Set(
      (tags || [])
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter(Boolean),
    ),
  );

  if (cleaned.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-8">
      <span className="text-uppercase-eyebrow text-text-secondary">Tags:</span>
      {cleaned.map((tag) => (
        <Link
          key={tag}
          href={`${hrefBase}?tag=${encodeURIComponent(slugify(tag))}`}
          className="inline-flex items-center rounded-full bg-bg-gray px-12 py-6 text-body-s-semibold text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
