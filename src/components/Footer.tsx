import Link from "next/link";

/**
 * Editorial footer — dark ink surface, mono eyebrows, italic wordmark.
 * Follows the brand guidelines "ink full-bleed" pattern for Business/Footer.
 */
export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Wordmark + tagline */}
          <div className="col-span-2 lg:col-span-5">
            <div style={{ transform: "skewX(-6deg)", display: "inline-block" }}>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                  color: "var(--paper)",
                }}
              >
                Vamos
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                  color: "var(--red)",
                }}
              >
                !
              </span>
            </div>
            <p
              style={{
                marginTop: 24,
                maxWidth: 360,
                fontFamily: "var(--sans)",
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(243,238,228,0.7)",
              }}
            >
              The padel feed. Live scores, rankings, editorial, and the business of the world&rsquo;s fastest-growing racket sport.
            </p>
          </div>

          {/* Sections */}
          <div className="lg:col-span-3">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red)",
                marginBottom: 16,
              }}
            >
              ■ Sections
            </div>
            <ul className="space-y-2.5">
              {[
                ["/scores", "Live Scores"],
                ["/rankings", "Rankings"],
                ["/tournaments", "Tournaments"],
                ["/players", "Players"],
                ["/news", "News"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: "var(--paper)" }}
                    className="hover:opacity-60 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div className="lg:col-span-2">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red)",
                marginBottom: 16,
              }}
            >
              ■ More
            </div>
            <ul className="space-y-2.5">
              {[
                ["/business", "Business"],
                ["/about", "About"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: "var(--paper)" }}
                    className="hover:opacity-60 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div className="col-span-2 lg:col-span-2">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--red)",
                marginBottom: 16,
              }}
            >
              ■ Follow
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter / X"
                style={{ color: "var(--paper)" }}
                className="hover:text-[var(--red)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                style={{ color: "var(--paper)" }}
                className="hover:text-[var(--red)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                style={{ color: "var(--paper)" }}
                className="hover:text-[var(--red)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-16 pt-6"
          style={{
            borderTop: "1px solid rgba(243,238,228,0.18)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "rgba(243,238,228,0.5)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>© {new Date().getFullYear()} Arbi Smart Solutions LLC · Vamos.net</span>
            <span>Everything happens at the net.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
