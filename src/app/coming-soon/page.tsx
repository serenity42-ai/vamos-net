"use client";

import { useState } from "react";
import VamosNetLogo from "@/components/VamosNetLogo";

/**
 * Soft-launch splash for vamos.net.
 *
 * Editorial brand system — paper background, ink type, single red accent.
 * The Woven .net logo is the hero; everything else is mono labels +
 * italic display headline with an Instrument Serif accent word.
 *
 * Lives outside the (site) route group so it renders without Header /
 * Footer / MatchModalProvider. Self-contained: pulls in the brand fonts
 * via the root layout's globals.css and nothing else.
 *
 * Background pattern uses the brand's net-stripes token, kept very faint
 * (≤6% opacity) so it reads as texture, not decoration.
 */
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      {/* Background — faint horizontal net stripes, tiled across the whole
          page. Sits behind the content; opacity kept low so it doesn't
          fight the typography. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--ink) 0 8px, transparent 8px 18px)",
          opacity: 0.04,
        }}
      />

      {/* Top eyebrow — mono ID stamp. Anchors the page as belonging to a
          specific publication, not a marketing landing page. */}
      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            ■ Issue 00 · Pre-launch
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
          >
            Spring 2026
          </span>
        </div>
      </header>

      {/* Hero — logo + tagline + headline + email capture. Centered, single
          column, generous vertical rhythm. Reads top to bottom like a
          magazine cover. */}
      <section className="flex-1 relative z-10 px-6 sm:px-10 lg:px-16 pt-12 sm:pt-20 pb-16">
        <div className="max-w-[920px] mx-auto">
          {/* Logo block */}
          <div className="mb-10 sm:mb-14">
            <VamosNetLogo variant="ink" height={88} className="block" />
            <div
              className="mt-4 pl-1"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
              }}
            >
              The world of padel
            </div>
          </div>

          {/* Display headline — italic Archivo Black with a serif accent.
              One accent word per headline per the brand voice rule. */}
          <h1
            className="display"
            style={{
              fontStyle: "italic",
              fontSize: "clamp(48px, 8vw, 92px)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              color: "var(--ink)",
              maxWidth: 880,
              textTransform: "none",
              textWrap: "balance",
            }}
          >
            Live scores. Rankings. News.<br />
            Everything happens{" "}
            <span
              className="italic-serif"
              style={{
                color: "var(--red)",
                fontSize: "1em",
              }}
            >
              at the net.
            </span>
          </h1>

          {/* Sub-paragraph — sans body, ink-soft. Brief, editorial. */}
          <p
            className="mt-8"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: 560,
              textWrap: "pretty",
            }}
          >
            We&rsquo;re building the definitive home for professional padel.
            Live match data, draws, rankings, and the editorial coverage the
            sport has been missing. Drop your email and we&rsquo;ll tell you
            when it&rsquo;s open.
          </p>

          {/* Email capture — ink-on-paper form, red primary button.
              No rounded corners above 2px per the brand layout rules. */}
          <div className="mt-10 sm:mt-12 max-w-[560px]">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  aria-label="Email address"
                  className="flex-1 outline-none transition-colors"
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    fontWeight: 500,
                    padding: "14px 16px",
                    background: "transparent",
                    color: "var(--ink)",
                    border: "1px solid var(--ink)",
                    borderRadius: 2,
                  }}
                />
                <button
                  type="submit"
                  className="transition-colors"
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "14px 24px",
                    background: "var(--red)",
                    color: "var(--paper)",
                    border: "1px solid var(--red)",
                    borderRadius: 2,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--red-deep)";
                    e.currentTarget.style.borderColor = "var(--red-deep)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--red)";
                    e.currentTarget.style.borderColor = "var(--red)";
                  }}
                >
                  Notify me →
                </button>
              </form>
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  border: "1px solid var(--ink)",
                  borderRadius: 2,
                  background: "var(--paper-2)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--red)",
                    marginBottom: 6,
                  }}
                >
                  ■ You&rsquo;re on the list
                </div>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  We&rsquo;ll write when the site opens. No spam, just padel.
                </p>
              </div>
            )}

            {/* Tiny mono note under the form */}
            <div
              className="mt-3"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--mute)",
              }}
            >
              One email at launch. Unsubscribe any time.
            </div>
          </div>

          {/* Pillar list — what's coming. Mono eyebrows tied with hairline
              rules; reads like a magazine table of contents. */}
          <div className="mt-16 sm:mt-20">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                marginBottom: 16,
              }}
            >
              ■ In the inaugural issue
            </div>
            <ul
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              {[
                "Live Scores",
                "World Rankings",
                "Tournament Draws",
                "Editorial",
              ].map((item, i) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 800,
                    fontSize: 15,
                    color: "var(--ink)",
                    paddingTop: 12,
                    borderTop: "1px solid var(--ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--mute)",
                      letterSpacing: "0.14em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer — mono colophon. Single hairline rule above. */}
      <footer
        className="relative z-10 px-6 sm:px-10 lg:px-16 py-6 sm:py-8"
        style={{ borderTop: "1px solid var(--ink)" }}
      >
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            © {new Date().getFullYear()} Arbi Smart Solutions LLC · Vamos.net
          </span>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            Paris · Dubai
          </span>
        </div>
      </footer>
    </main>
  );
}
