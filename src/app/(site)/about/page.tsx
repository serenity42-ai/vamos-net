import Link from "next/link";

export const metadata = {
  title: "About | VAMOS",
  description:
    "Vamos.net is the definitive platform for the world of padel — live scores, rankings, editorial coverage, and the business of the fastest-growing racquet sport.",
};

const COVERAGE = [
  [
    "Live scores",
    "Real-time match updates from Premier Padel, FIP Tour, and every major circuit.",
  ],
  [
    "Rankings",
    "Up-to-date men’s and women’s rankings with proper points-based sorting.",
  ],
  [
    "News",
    "Tour coverage, player profiles, business developments, and coaching insights.",
  ],
  [
    "Analysis",
    "Deep dives into tactics, form, and the evolution of the sport.",
  ],
] as const;

export default function AboutPage() {
  return (
    <main className="bg-bg-page">
      {/* Hero band */}
      <section className="border-b border-border-primary">
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          <span className="text-uppercase-eyebrow text-brand">■ About</span>
          <h1 className="mt-12 text-mobile-display-l md:text-desktop-display-l text-text-primary">
            About Vamos
          </h1>
          <p className="mt-20 max-w-[680px] text-body-l text-text-secondary">
            Vamos.net is the definitive platform for the world of padel. Live
            scores, real-time rankings, editorial coverage, and the business of
            the fastest-growing racquet sport on the planet.
          </p>
        </div>
      </section>

      {/* Mission + What we cover */}
      <section>
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          <div className="grid grid-cols-1 gap-40 lg:grid-cols-12 lg:gap-48">
            <div className="lg:col-span-7">
              <span className="text-uppercase-eyebrow text-brand">
                ■ Mission
              </span>
              <h2 className="mt-12 text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                Make padel accessible to every fan, everywhere.
              </h2>
              <div className="mt-24 flex max-w-[640px] flex-col gap-20 text-body-l text-text-secondary">
                <p>
                  Whether you follow the Premier Padel tour, track your
                  favourite players in the rankings, or read about the
                  sport&rsquo;s explosive global growth, Vamos.net is your
                  home.
                </p>
                <p>
                  We treat every layout like a magazine spread. Strong
                  hierarchy, considered typography, real content. Our editorial
                  mandate: confident, informed, concise.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <span className="text-uppercase-eyebrow text-brand">
                ■ What we cover
              </span>
              <div className="mt-16 overflow-hidden rounded-32 bg-bg-gray">
                {COVERAGE.map(([title, body], i) => (
                  <div
                    key={title}
                    className={
                      "flex flex-col gap-8 px-24 py-20" +
                      (i < COVERAGE.length - 1
                        ? " border-b border-border-primary"
                        : "")
                    }
                  >
                    <div className="text-title-m text-text-primary">
                      {title}
                    </div>
                    <p className="text-body-s text-text-secondary">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border-primary bg-bg-gray">
        <div className="mx-auto max-w-[1320px] px-16 py-40 sm:px-24 md:py-64 lg:px-32">
          <span className="text-uppercase-eyebrow text-brand">■ Contact</span>
          <h2 className="mt-12 text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
            Get in touch
          </h2>
          <p className="mt-16 max-w-[560px] text-body-l text-text-secondary">
            Tips, pitches, partnerships, or just to say hello.
          </p>
          <Link
            href="mailto:hello@vamos.net"
            className="mt-24 inline-flex items-center justify-center rounded-full bg-brand px-24 py-12 text-body-s-semibold text-text-contrast transition-opacity hover:opacity-90"
          >
            hello@vamos.net →
          </Link>
        </div>
      </section>
    </main>
  );
}
