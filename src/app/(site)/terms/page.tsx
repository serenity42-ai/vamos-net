import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Vamos.net",
  description:
    "Terms governing access to and use of vamos.net, including content licensing, user conduct, and limitation of liability.",
  robots: { index: true, follow: true },
};

/**
 * Terms of Use — DRAFT.
 *
 * Per restructure spec §8.3. This is a working draft; have counsel review
 * before launch. UAE jurisdiction selected to match Arbi Smart Solutions LLC.
 */
export default function TermsPage() {
  return (
    <main className="prose prose-stone mx-auto max-w-3xl px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
      <h1 className="text-mobile-heading-l md:text-desktop-heading-l">Terms of Use</h1>
      <p className="text-text-tertiary">
        <em>Last updated: {formatDate(new Date())}</em>
      </p>

      <p>
        These Terms of Use (the &ldquo;Terms&rdquo;) govern your access to and use of
        vamos.net (the &ldquo;Service&rdquo;), operated by{" "}
        <strong>Arbi Smart Solutions LLC</strong>, Abu Dhabi, United Arab Emirates
        (&ldquo;Vamos&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the Service
        you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        Vamos.net provides editorial content on the sport of padel, live and historical
        match data from licensed third-party feeds, newsletter subscriptions, and links
        to third-party retailers and partners. Match data is provided &ldquo;as is&rdquo;
        and we do not guarantee its real-time accuracy or completeness.
      </p>

      <h2>2. Content &amp; intellectual property</h2>
      <p>
        Editorial content, design, brand marks, and proprietary code are owned by Vamos
        or its licensors. You may read, link to, and quote content for personal,
        non-commercial use. Republication or commercial use requires prior written
        permission. Match data is licensed from third parties and subject to the terms
        of those licences.
      </p>

      <h2>3. Newsletter subscriptions</h2>
      <p>
        Subscriptions are voluntary and you can unsubscribe at any time from the link in
        every email. We will not share your email with third parties for their own
        marketing.
      </p>

      <h2>4. Affiliate links</h2>
      <p>
        Some links on Vamos.net are affiliate links, meaning we may earn a commission
        when you click through and complete a purchase, at no additional cost to you. See
        our <a href="/disclosure">Affiliate Disclosure</a>. Affiliate relationships do
        not influence editorial coverage.
      </p>

      <h2>5. User conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Scrape or systematically extract match data or content.</li>
        <li>Bypass or interfere with security or rate-limiting mechanisms.</li>
        <li>Use the Service to transmit unlawful, harassing, or harmful material.</li>
        <li>Misrepresent your identity in advisory enquiries or other forms.</li>
      </ul>

      <h2>6. Third-party links and services</h2>
      <p>
        The Service contains links to third-party websites (including retailers and
        partner brands). We are not responsible for the content or practices of those
        sites; your use of them is governed by their own terms.
      </p>

      <h2>7. Disclaimer</h2>
      <p>
        The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        basis. To the maximum extent permitted by law, Vamos disclaims all warranties,
        express or implied, including merchantability, fitness for a particular purpose,
        and non-infringement.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Vamos will not be liable for
        indirect, incidental, special, consequential, or punitive damages, or loss of
        profits or revenues, whether incurred directly or indirectly, arising from your
        use of the Service.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may modify these Terms. Material changes will be announced on this page.
        Continued use after a change constitutes acceptance of the updated Terms.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of the United Arab Emirates. The courts of
        Abu Dhabi have exclusive jurisdiction over disputes arising under these Terms,
        subject to any non-waivable consumer-protection rights in your country of
        residence.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:hello@vamos.net">hello@vamos.net</a>.
      </p>
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}
