import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint — Vamos.net",
  description:
    "Company information and legal contact details for Vamos.net, operated by Arbi Smart Solutions LLC, Abu Dhabi, UAE.",
  robots: { index: true, follow: true },
};

/**
 * Imprint — DRAFT.
 *
 * Per restructure spec §8.3 (imprint / company info). Required as a separate
 * page in some EU jurisdictions (Germany's Impressumspflicht, Austria, etc.).
 * Even where not strictly required, having it removes ambiguity about who
 * operates the site.
 */
export default function ImprintPage() {
  return (
    <main className="prose prose-stone mx-auto max-w-3xl px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
      <h1 className="text-mobile-heading-l md:text-desktop-heading-l">Imprint</h1>
      <p className="text-text-tertiary">
        <em>Last updated: {formatDate(new Date())}</em>
      </p>

      <h2>Site operator</h2>
      <p>
        <strong>Arbi Smart Solutions LLC</strong>
        <br />
        Abu Dhabi, United Arab Emirates
      </p>

      <h2>Contact</h2>
      <p>
        General: <a href="mailto:hello@vamos.net">hello@vamos.net</a>
        <br />
        Editorial: <a href="mailto:editorial@vamos.net">editorial@vamos.net</a>
        <br />
        Partnerships and press: <a href="mailto:partners@vamos.net">partners@vamos.net</a>
        <br />
        Privacy / data requests: <a href="mailto:privacy@vamos.net">privacy@vamos.net</a>
      </p>

      <h2>Responsible for content</h2>
      <p>
        The editorial team at Vamos.net is responsible for the content of this site under
        applicable press and media law. Specific responsibility per article is assigned
        to the named author on the article&rsquo;s byline.
      </p>

      <h2>Hosting</h2>
      <p>
        This website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        USA. Content delivery is provided through Vercel&rsquo;s global edge network.
      </p>

      <h2>Match data</h2>
      <p>
        Live and historical match data is licensed from <a href="https://padelapi.org">padelapi.org</a>{" "}
        under a commercial licence.
      </p>

      <h2>Disputes</h2>
      <p>
        The European Commission provides a platform for online dispute resolution at{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . We are willing to engage in dispute resolution before a consumer arbitration
        board only where required by law.
      </p>
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}
