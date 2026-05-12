"use client";

import { useState } from "react";
import AnimatedNetLogo from "@/components/AnimatedNetLogo";
import VamosNetLogo from "@/components/VamosNetLogo";

/**
 * Soft-launch splash for vamos.net — animated edition.
 *
 * Hero is the AnimatedNetLogo: a paper-coloured padel court net rippling
 * in the wind on an ink-coloured ground, with a lime "V." stenciled into
 * the mesh. Animation defaults match the brand motion study (Wind on the
 * Net v0.2): word=V., speed=1.85×, amp=15px, tension=tight, density=low,
 * coverage=42%, accent=lime.
 *
 * Below the animation: the static VamosNetLogo (so the full wordmark is
 * legible regardless of how the V reads in the mesh), italic display
 * headline with a red Instrument Serif accent, body paragraph, email
 * capture, pillar list, and a mono colophon footer.
 *
 * Lives outside the (site) route group so it renders without Header /
 * Footer / MatchModalProvider.
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
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      {/* Top eyebrow row — mono ID stamp on the ink ground. */}
      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(243,238,228,0.55)",
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
              color: "rgba(243,238,228,0.55)",
            }}
          >
            Wind on the Net · Motion Study v0.2
          </span>
        </div>
      </header>

      {/* Hero — animated net occupies the full top band. Renders client-side
          only; on first paint a faint outline of the net is fine, the wave
          kicks in within ~16ms of mount. */}
      <section className="relative z-10 px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="relative w-full"
            style={{
              border: "1px solid rgba(243,238,228,0.12)",
              aspectRatio: "900 / 380",
              maxHeight: "min(60vh, 480px)",
              overflow: "hidden",
            }}
          >
            <AnimatedNetLogo
              width={900}
              height={380}
              responsive
              word="V."
              speed={1.85}
              amplitude={15}
              tension={0.84}
              density="low"
              coverage={0.42}
              netColor="#F3EEE4"
              accent="#D4FF3A"
              background="transparent"
              className="absolute inset-0"
            />
            {/* Overlay row across the bottom of the hero — caption + tiny
                mono note in the spirit of the source motion study. */}
            <div
              className="absolute left-0 right-0 bottom-0 flex items-center justify-between px-4 sm:px-6 py-3"
              style={{ pointerEvents: "none" }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(243,238,228,0.55)",
                }}
              >
                ■ Net → wind waves → wordmark woven into mesh
              </span>
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(243,238,228,0.35)",
                }}
              >
                Rendered live · canvas 2D
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body — wordmark, headline, body copy, email capture, pillars. */}
      <section className="flex-1 relative z-10 px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-16">
        <div className="max-w-[920px] mx-auto">
          {/* Static logo lockup — re-states the brand name explicitly so the
              animated V doesn't have to carry the whole wordmark on its own. */}
          <div className="mb-10 sm:mb-12">
            <VamosNetLogo variant="light" height={56} />
            <div
              className="mt-3 pl-1"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(243,238,228,0.55)",
              }}
            >
              The world of padel
            </div>
          </div>

          {/* Display headline — italic Archivo Black, one Instrument Serif
              red accent (the brand voice signature). */}
          <h1
            className="display"
            style={{
              fontStyle: "italic",
              fontSize: "clamp(44px, 7.5vw, 84px)",
              lineHeight: 0.97,
              letterSpacing: "-0.035em",
              color: "var(--paper)",
              maxWidth: 880,
              textTransform: "none",
              textWrap: "balance",
            }}
          >
            Live scores. Rankings. News.<br />
            Everything happens{" "}
            <span
              className="italic-serif"
              style={{ color: "var(--red)", fontSize: "1em" }}
            >
              at the net.
            </span>
          </h1>

          <p
            className="mt-8"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(243,238,228,0.7)",
              maxWidth: 560,
              textWrap: "pretty",
            }}
          >
            We&rsquo;re building the definitive home for professional padel.
            Live match data, draws, rankings, and the editorial coverage the
            sport has been missing. Drop your email and we&rsquo;ll tell you
            when it&rsquo;s open.
          </p>

          {/* Email capture — square 2px-radius, no shadows. Paper input on
              ink ground so the field reads as a knockout panel. */}
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
                    background: "var(--paper)",
                    color: "var(--ink)",
                    border: "1px solid var(--paper)",
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
                  border: "1px solid rgba(243,238,228,0.25)",
                  borderRadius: 2,
                  background: "rgba(243,238,228,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--lime)",
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
                    color: "var(--paper)",
                    margin: 0,
                  }}
                >
                  We&rsquo;ll write when the site opens. No spam, just padel.
                </p>
              </div>
            )}

            <div
              className="mt-3"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(243,238,228,0.4)",
              }}
            >
              One email at launch. Unsubscribe any time.
            </div>
          </div>

          {/* Pillar list — what's coming. Hairline rules above each entry
              like a magazine table of contents. */}
          <div className="mt-16 sm:mt-20">
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(243,238,228,0.55)",
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
                    color: "var(--paper)",
                    paddingTop: 12,
                    borderTop: "1px solid rgba(243,238,228,0.18)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(243,238,228,0.4)",
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

      {/* Footer — mono colophon. Hairline rule above. */}
      <footer
        className="relative z-10 px-6 sm:px-10 lg:px-16 py-6 sm:py-8"
        style={{ borderTop: "1px solid rgba(243,238,228,0.15)" }}
      >
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(243,238,228,0.45)",
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
              color: "rgba(243,238,228,0.45)",
            }}
          >
            Paris · Dubai
          </span>
        </div>
      </footer>
    </main>
  );
}
