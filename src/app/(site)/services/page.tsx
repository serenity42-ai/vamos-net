import type { Metadata } from "next";
import AdvisoryForm from "./AdvisoryForm";

export const metadata: Metadata = {
  title: "Advisory & Services — Vamos.net",
  description:
    "Padel court development, tournament organization, market entry, and deal structuring. Vamos.net advisory bridges CIS, Europe, and the Gulf.",
  robots: { index: true, follow: true },
};

/**
 * Advisory funnel page — per restructure spec §4.3.
 *
 * Funnel endpoint for the consulting business. Copy below is a working draft
 * from Alex's stated positioning (CIS–Europe–Gulf bridge); refine the exact
 * wording before launch. The form delivers via Telegram + Resend when those
 * env vars are configured, and always logs to Vercel stdout as a fallback.
 */
export default function ServicesPage() {
  return (
    <main className="bg-bg text-text-primary">
      <section className="px-16 pt-64 pb-32 md:px-32 md:pt-80 md:pb-48 lg:px-48">
        <div className="mx-auto max-w-3xl">
          <p
            className="font-display font-semibold uppercase tracking-wide text-body-s"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Vamos Advisory
          </p>
          <h1
            className="font-display mt-8 text-mobile-heading-l md:text-desktop-heading-xl"
            style={{ lineHeight: 1.05 }}
          >
            We build the business of padel.
          </h1>
          <p className="mt-16 font-body text-mobile-body-l md:text-desktop-body-l">
            For operators, investors, and federations entering padel from any side of
            the market. We sit between the data, the editorial, and the deals — and we
            put that to work for partners who want to do this seriously.
          </p>
        </div>
      </section>

      <section className="px-16 py-32 md:px-32 md:py-48 lg:px-48">
        <div className="mx-auto max-w-3xl grid gap-24 md:grid-cols-2">
          <ServiceCard
            title="Court development &amp; construction consulting"
            body="Site selection, unit economics, surface and lighting spec, vendor shortlists. We&rsquo;ve modelled the cost-revenue curve on operating courts across three regions."
          />
          <ServiceCard
            title="Tournament &amp; event organization"
            body="Sanctioning paths, draw structure, broadcast partners, sponsor packaging. From a single-club open to a multi-stop circuit."
          />
          <ServiceCard
            title="Market entry &amp; regulatory"
            body="Where to enter, how to set up the entity, what licences you actually need, and which partners to talk to first. Strong in UAE and EU."
          />
          <ServiceCard
            title="Deal structuring"
            body="Sponsorship deals, player and brand partnerships, club roll-ups, JV terms. We have run the negotiations on the buy and the sell side."
          />
          <ServiceCard
            title="CIS \u2013 Europe \u2013 Gulf bridge"
            body="The fastest-growing padel corridors run between these markets. We know the operators on each end and we move at the speed of relationships, not RFPs."
          />
          <ServiceCard
            title="Editorial &amp; data partnerships"
            body="Co-branded research, audience access, white-label data products. If you have a brand and an audience to reach, talk to us first."
          />
        </div>
      </section>

      <section
        className="px-16 py-48 md:px-32 md:py-64 lg:px-48"
        style={{ background: "var(--color-bg-gray, #EBE9E9)" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2
            className="font-display text-mobile-heading-l md:text-desktop-heading-l"
            style={{ lineHeight: 1.1 }}
          >
            Tell us what you&rsquo;re looking at.
          </h2>
          <p className="mt-12 mb-24 font-body text-mobile-body-l">
            One short message is enough. We reply within two business days.
          </p>
          <AdvisoryForm source="advisory_page" />
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <article
      className="rounded-lg p-20 md:p-24"
      style={{
        background: "var(--color-bg-gray, #EBE9E9)",
      }}
    >
      <h3
        className="font-display font-semibold text-mobile-heading-s md:text-desktop-heading-s"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="mt-8 font-body text-body-m" style={{ color: "var(--color-text-secondary)" }}>
        {body}
      </p>
    </article>
  );
}
