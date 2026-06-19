import type { Metadata } from "next";
import Link from "next/link";
import NewsletterLandingForm from "./NewsletterLandingForm";

export const metadata: Metadata = {
  title: "The Business of Padel Brief — Vamos.net Newsletter",
  description:
    "A bi-weekly brief for people who want to make money in padel: deals and capital, club economics, market entry, events and sponsorship ROI, and case studies. Free.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "The Business of Padel Brief — Vamos.net",
    description:
      "For club owners, builders, brands, organizers and investors. The deals, the unit economics, and what actually works. Bi-weekly. Free.",
    url: "https://vamos.net/newsletter",
    type: "website",
  },
};

const PILLARS: { title: string; body: string }[] = [
  {
    title: "Deals & capital",
    body: "Who invested in what, valuations, sponsorship numbers, and where the money flows next.",
  },
  {
    title: "Club economics",
    body: "How to get a club out of the red. Costs, court utilization, pricing, staffing, member acquisition — including operators running profitable clubs with almost no staff.",
  },
  {
    title: "Market entry",
    body: "For brands and builders sizing up padel: rackets, shoes, court glass, cameras, apparel, and the supply chain behind them.",
  },
  {
    title: "Events & sponsorship",
    body: "What it costs to organize a tournament, and whether sponsoring an event or a player is actually worth it.",
  },
  {
    title: "Case studies",
    body: "The clubs, tournaments and brands that cracked it — broken into playbooks you can use.",
  },
];

export default function NewsletterPage() {
  return (
    <main className="bg-bg-page text-text-primary">
      {/* === Hero: the promise + the form, side by side on desktop === */}
      <section className="px-16 pt-48 pb-32 md:px-32 md:pt-72 md:pb-48 lg:px-48">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-40 lg:grid-cols-[1fr_440px] lg:gap-64 lg:items-start">
          {/* Left: promise */}
          <div className="flex flex-col">
            <p
              className="font-display font-semibold uppercase tracking-wide text-body-s"
              style={{ color: "var(--color-brand, #FE4C00)" }}
            >
              The Business of Padel Brief
            </p>
            <h1
              className="font-display mt-12 text-mobile-display-l md:text-desktop-display-l"
              style={{ lineHeight: 1.02 }}
            >
              PADEL IS BOOMING.
              <br />
              THE BUSINESS BEHIND IT ISN&rsquo;T UNDERSTOOD YET.
            </h1>
            <p className="mt-20 font-body text-mobile-body-l md:text-desktop-body-l max-w-[560px]">
              Most padel coverage is scores, players and highlights. We cover the part
              that decides who wins off the court: the deals, the unit economics, the
              market moves, and what actually works.
            </p>
            <p
              className="mt-16 font-body text-body-l max-w-[560px]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              For club owners and operators, court builders, equipment and apparel
              brands, event organizers, sponsors, and investors. If you have capital or
              a business and you want to make money in padel, this is written for you.
            </p>
          </div>

          {/* Right: signup card */}
          <div
            className="rounded-32 p-24 md:p-32"
            style={{ background: "var(--color-bg-constant, #181D27)" }}
          >
            <h2 className="text-mobile-heading-m md:text-desktop-heading-m text-text-contrast">
              Get the brief
            </h2>
            <p
              className="mt-8 mb-20 text-body-m"
              style={{ color: "var(--color-text-tertiary, #A4A7AE)" }}
            >
              Bi-weekly. Free to start. Built for people doing this seriously.
            </p>
            <NewsletterLandingForm />
          </div>
        </div>
      </section>

      {/* === What you get: the five pillars === */}
      <section className="px-16 py-48 md:px-32 md:py-64 lg:px-48">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-mobile-heading-l md:text-desktop-heading-l">
            WHAT&rsquo;S IN EVERY ISSUE
          </h2>
          <div className="mt-32 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="rounded-24 p-20 md:p-24"
                style={{ background: "var(--color-bg-gray, #EBE9E9)" }}
              >
                <h3 className="font-display font-semibold text-mobile-heading-s md:text-desktop-heading-s">
                  {p.title}
                </h3>
                <p
                  className="mt-8 text-body-m"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* === Advisory tie-in: the people behind the brief work with you === */}
      <section
        className="px-16 py-48 md:px-32 md:py-64 lg:px-48"
        style={{ background: "var(--color-bg-constant, #181D27)" }}
      >
        <div className="mx-auto max-w-[1100px] text-text-contrast">
          <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
            THE PEOPLE BEHIND THE BRIEF WORK DIRECTLY WITH OPERATORS AND INVESTORS
          </h2>
          <p
            className="mt-16 max-w-[680px] text-body-l"
            style={{ color: "var(--color-text-tertiary, #A4A7AE)" }}
          >
            The brief is the public side of a working padel practice: club launch and
            turnaround economics, event and tournament organization, and sourcing and
            structuring investment deals. If you want this applied to your club, your
            event, or your deal, that&rsquo;s what our advisory is for.
          </p>
          <Link
            href="/services"
            className="mt-24 inline-flex items-center gap-8 rounded-full bg-bg-white px-24 font-display font-semibold text-16 text-text-primary transition-opacity hover:opacity-90"
            style={{ height: 56 }}
          >
            See how we work
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* === Editorial independence: firewall #1, stated publicly as a trust asset === */}
      <section className="px-16 py-40 md:px-32 md:py-56 lg:px-48">
        <div className="mx-auto max-w-[1100px]">
          <div
            className="rounded-24 p-20 md:p-24"
            style={{ border: "1px solid var(--color-border-primary, #E5E2E2)" }}
          >
            <p
              className="font-display font-semibold uppercase tracking-wide text-body-s"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Editorial independence
            </p>
            <p className="mt-8 text-body-m" style={{ color: "var(--color-text-secondary)" }}>
              Our analysis is independent of our advisory and investment activity. We
              tell you what we think is true about the market, not what serves a deal.
              Where a conflict could exist, we disclose it.
            </p>
          </div>
        </div>
      </section>

      {/* === Final CTA === */}
      <section className="px-16 pb-64 md:px-32 md:pb-80 lg:px-48">
        <div
          className="mx-auto max-w-[1100px] rounded-32 p-24 md:p-40 text-center"
          style={{ background: "var(--color-bg-gray, #EBE9E9)" }}
        >
          <h2 className="text-mobile-heading-l md:text-desktop-heading-l">
            START READING THE BUSINESS OF PADEL
          </h2>
          <p className="mt-12 mb-24 text-body-l" style={{ color: "var(--color-text-secondary)" }}>
            Bi-weekly. Free. Unsubscribe anytime.
          </p>
          <div className="mx-auto max-w-[440px] text-left">
            <NewsletterLandingForm />
          </div>
        </div>
      </section>
    </main>
  );
}
