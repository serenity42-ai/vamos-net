import NewsletterSignup from "@/components/NewsletterSignup";

export default function AboutPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ About</div>
          <h1 className="display" style={{ marginBottom: 20 }}>
            Everything happens at the <span className="italic-serif">net</span>.
          </h1>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 18,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: 680,
            }}
          >
            Vamos.net is the definitive platform for the world of padel. Live scores,
            real-time rankings, editorial coverage, and the business of the fastest-growing
            racquet sport on the planet.
          </p>
        </div>
      </section>

      {/* Mission + What we cover */}
      <section>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ Mission</div>
              <h2 className="headline" style={{ marginBottom: 20 }}>
                Make padel accessible to every fan, everywhere.
              </h2>
              <div
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--ink-soft)",
                  maxWidth: 640,
                }}
                className="space-y-5"
              >
                <p>
                  Whether you follow the Premier Padel tour, track your favourite players in the
                  rankings, or read about the sport&rsquo;s explosive global growth, Vamos.net is your home.
                </p>
                <p>
                  We treat every layout like a magazine spread. Strong hierarchy, considered typography,
                  real content. Our editorial mandate: confident, informed, concise.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 16 }}>■ What we cover</div>
              <div style={{ border: "1px solid var(--ink)" }}>
                {[
                  ["Live scores", "Real-time match updates from Premier Padel, WPT, and every major tour."],
                  ["Rankings", "Up-to-date men\u2019s and women\u2019s rankings with proper points-based sorting."],
                  ["News", "Tour coverage, player profiles, business developments, and coaching insights."],
                  ["Analysis", "Deep dives into tactics, form, and the evolution of the sport."],
                ].map(([title, body], i, arr) => (
                  <div
                    key={title}
                    style={{
                      padding: "18px 20px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                        color: "var(--ink)",
                        marginBottom: 6,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ borderTop: "1px solid var(--ink)", background: "var(--paper-2)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>■ Contact</div>
          <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 48px)", marginBottom: 16 }}>
            Get in <span className="italic-serif">touch</span>.
          </h2>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 16,
              color: "var(--ink-soft)",
              marginBottom: 20,
            }}
          >
            Tips, pitches, partnerships, or just to say hello.
          </p>
          <a
            href="mailto:hello@vamos.net"
            className="btn btn-primary"
          >
            hello@vamos.net →
          </a>
        </div>
      </section>

      <NewsletterSignup />
    </main>
  );
}
