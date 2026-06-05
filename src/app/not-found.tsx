import Link from "next/link";

/**
 * Root 404 page (audit M2). Previously any unmatched URL fell through to
 * Next.js' default screen, which looks unbranded.
 *
 * Server component — no client JS shipped for a static page.
 */
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl text-center">
        <p
          className="mb-4"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-brand-primary, #FE4C00)",
          }}
        >
          404 — Out of bounds
        </p>
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(32px, 6vw, 56px)",
            lineHeight: 1,
            textTransform: "uppercase",
            color: "var(--color-text-primary, #181D27)",
          }}
        >
          Long ball, no return
        </h1>
        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            lineHeight: "24px",
            color: "var(--color-text-secondary, #535862)",
          }}
        >
          The page you&rsquo;re looking for isn&rsquo;t here. It may have moved, or the link is wrong.
        </p>
        <div className="flex flex-wrap justify-center gap-12">
          <Link
            href="/"
            className="inline-flex items-center rounded-full px-20 py-12 font-sans text-14 font-semibold"
            style={{
              background: "var(--color-brand-primary, #FE4C00)",
              color: "#ffffff",
            }}
          >
            Back to homepage
          </Link>
          <Link
            href="/scores"
            className="inline-flex items-center rounded-full px-20 py-12 font-sans text-14 font-semibold border"
            style={{
              borderColor: "var(--color-border-primary, #E9EAEB)",
              color: "var(--color-text-primary, #181D27)",
            }}
          >
            Live scores
          </Link>
        </div>
      </div>
    </main>
  );
}
