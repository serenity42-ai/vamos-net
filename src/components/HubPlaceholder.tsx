import Link from "next/link";

type Article = { slug: string; title: string; status: "live" | "coming" };

export default function HubPlaceholder({
  section,
  display,
  italic,
  eyebrow,
  intro,
  articles,
}: {
  section: string;
  /** Two-part display heading; italic word is the swash one. */
  display: string;
  italic: string;
  eyebrow: string;
  intro: string;
  articles: Article[];
}) {
  const live = articles.filter((a) => a.status === "live");
  const coming = articles.filter((a) => a.status === "coming");

  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero band */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div
            className="mb-6"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--mute)",
            }}
          >
            <Link href="/hub" style={{ color: "var(--mute)" }}>
              Hub
            </Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "var(--ink)" }}>{section}</span>
          </div>

          <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
            ■ {eyebrow}
          </div>

          <h1 className="display" style={{ marginBottom: 16 }}>
            {display}{" "}
            <span className="italic-serif">{italic}</span>.
          </h1>

          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--ink-soft)",
              maxWidth: 720,
            }}
          >
            {intro}
          </p>
        </div>
      </section>

      {/* Coming soon band */}
      <section>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {live.length > 0 && (
            <>
              <div
                className="eyebrow"
                style={{ color: "var(--red)", marginBottom: 12 }}
              >
                ■ Reading now
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
                style={{ marginBottom: 56 }}
              >
                {live.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/news/${a.slug}`}
                    className="block group"
                    style={{
                      padding: "24px 0",
                      borderTop: "1px solid var(--ink)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--red)",
                        marginBottom: 8,
                      }}
                    >
                      ● Live
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 800,
                        fontSize: 20,
                        lineHeight: 1.25,
                        letterSpacing: "-0.01em",
                        color: "var(--ink)",
                      }}
                      className="group-hover:opacity-70 transition-opacity"
                    >
                      {a.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </>
          )}

          {coming.length > 0 && (
            <>
              <div
                className="eyebrow"
                style={{ color: "var(--mute)", marginBottom: 12 }}
              >
                ■ Coming next
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8"
                style={{ marginBottom: 40 }}
              >
                {coming.map((a) => (
                  <div
                    key={a.slug}
                    style={{
                      padding: "20px 0",
                      borderTop: "1px solid rgba(0,0,0,0.12)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--mute)",
                        marginBottom: 8,
                      }}
                    >
                      In production
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--sans)",
                        fontWeight: 700,
                        fontSize: 18,
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                        color: "var(--mute)",
                      }}
                    >
                      {a.title}
                    </h3>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Back to Hub */}
          <div style={{ marginTop: 48 }}>
            <Link
              href="/hub"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              ← Back to Player&rsquo;s Hub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
