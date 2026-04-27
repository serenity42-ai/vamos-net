import Link from "next/link";

export const metadata = {
  title: "Player's Hub | VAMOS",
  description:
    "Everything you need to play better padel. Rules, reviews, training, lifestyle, business — the complete reader's hub.",
};

const SECTIONS = [
  {
    eyebrow: "01",
    href: "/hub/rules",
    title: "Rules & Game",
    description:
      "What padel is, how it's scored, where it's played, where it came from. The foundation.",
  },
  {
    eyebrow: "02",
    href: "/hub/reviews",
    title: "Reviews",
    description:
      "Rackets, shoes, apparel, accessories. Editor's picks and buyer's guides without the affiliate noise.",
  },
  {
    eyebrow: "03",
    href: "/hub/business",
    title: "Padel Business",
    description:
      "Market size, club economics, player earnings, the numbers behind the world's fastest-growing sport.",
  },
  {
    eyebrow: "04",
    href: "/hub/lifestyle",
    title: "Lifestyle",
    description:
      "Padel beyond the court — culture, travel, food, fashion, the people who make this sport what it is.",
  },
  {
    eyebrow: "05",
    href: "/hub/training",
    title: "Training",
    description:
      "Technique, drills, mindset, fuel. Everything that makes you better between matches.",
  },
] as const;

export default function HubPage() {
  return (
    <main style={{ background: "var(--paper)" }}>
      {/* Hero */}
      <section style={{ borderBottom: "1px solid var(--ink)" }}>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div
            className="eyebrow"
            style={{ color: "var(--red)", marginBottom: 14 }}
          >
            ■ The Player&rsquo;s Hub
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(40px, 6vw, 84px)", marginBottom: 18 }}
          >
            Equip. Train. <span className="italic-serif">Win.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 18,
              lineHeight: 1.5,
              color: "var(--ink-soft)",
              maxWidth: 720,
            }}
          >
            Everything you need to get better at padel — from the rules to the
            recovery protocol. Pick a section.
          </p>
        </div>
      </section>

      {/* Sections grid */}
      <section>
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ borderTop: "1px solid var(--ink)" }}
          >
            {SECTIONS.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="block group"
                style={{
                  padding: "32px 28px",
                  borderRight: "1px solid var(--ink)",
                  borderBottom: "1px solid var(--ink)",
                  background: "var(--paper)",
                  minHeight: 220,
                }}
              >
                <div
                  className="eyebrow"
                  style={{ color: "var(--red)", marginBottom: 12 }}
                >
                  ■ {s.eyebrow}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--sans)",
                    fontWeight: 900,
                    fontStyle: "italic",
                    fontSize: 32,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    marginBottom: 14,
                  }}
                  className="group-hover:opacity-70 transition-opacity"
                >
                  {s.title}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                    marginBottom: 20,
                  }}
                >
                  {s.description}
                </p>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                  }}
                  className="group-hover:text-[var(--red)] transition-colors"
                >
                  Enter →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
