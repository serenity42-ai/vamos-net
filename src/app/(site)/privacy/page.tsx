import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Vamos.net",
  description:
    "How Vamos.net collects, uses, and protects personal data. GDPR-compliant policy covering newsletter subscriptions, analytics, and affiliate links.",
  robots: { index: true, follow: true },
};

/**
 * Privacy Policy — DRAFT.
 *
 * Per restructure spec §8.3. This is a starting draft. Before launch, Alex
 * should:
 *  1. Have counsel review (GDPR Article 27 EU representative requirement
 *     may apply since we collect EU users' emails from a UAE-based entity).
 *  2. Confirm data controller details (Arbi Smart Solutions LLC, Abu Dhabi).
 *  3. Confirm analytics provider (currently written for Plausible — replace
 *     "Plausible Analytics" with whatever ships).
 *  4. Confirm Ghost/Mailgun sub-processor language matches what's actually
 *     configured for newsletters.
 *
 * The structure follows ICO / CNIL templates: identity → data → purposes →
 * legal basis → recipients → retention → rights → contact.
 */
export default function PrivacyPage() {
  return (
    <main className="prose prose-stone mx-auto max-w-3xl px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
      <h1 className="text-mobile-heading-l md:text-desktop-heading-l">Privacy Policy</h1>
      <p className="text-text-tertiary">
        <em>Last updated: {formatDate(new Date())}</em>
      </p>
      <p>
        Vamos.net (&ldquo;Vamos&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy.
        This policy explains what personal data we collect when you use vamos.net, why we
        collect it, how we use it, and the rights you have under applicable data-protection
        law including the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>1. Who we are</h2>
      <p>
        The data controller for personal data collected through this website is{" "}
        <strong>Arbi Smart Solutions LLC</strong>, registered in Abu Dhabi, United Arab
        Emirates. Contact:{" "}
        <a href="mailto:hello@vamos.net">hello@vamos.net</a>.
      </p>

      <h2>2. What data we collect</h2>
      <ul>
        <li>
          <strong>Newsletter subscription:</strong> email address, the newsletter(s) you
          subscribed to, and the date of your consent.
        </li>
        <li>
          <strong>Contact and advisory enquiries:</strong> the information you provide in
          forms (name, company, email, message).
        </li>
        <li>
          <strong>Usage analytics:</strong> aggregated, privacy-friendly analytics
          (page views, referring domain, country at country-level granularity, anonymised
          device class). We do not use cookies for analytics and we do not collect IP
          addresses in identifiable form.
        </li>
        <li>
          <strong>Affiliate link clicks:</strong> aggregated counts of which outbound
          retailer links are clicked. No personal identifier is attached.
        </li>
      </ul>

      <h2>3. Why we use it (purposes &amp; legal basis)</h2>
      <ul>
        <li>
          <strong>Send the newsletter you signed up for</strong> — legal basis: your
          explicit consent (Art. 6(1)(a) GDPR).
        </li>
        <li>
          <strong>Reply to your enquiry</strong> — legal basis: pre-contractual measures
          / our legitimate interest in responding (Art. 6(1)(b) and (f) GDPR).
        </li>
        <li>
          <strong>Measure aggregate site usage and improve content</strong> — legal basis:
          legitimate interest in operating the site (Art. 6(1)(f) GDPR), narrowly scoped
          to non-identifying metrics.
        </li>
      </ul>

      <h2>4. Who has access (recipients &amp; sub-processors)</h2>
      <p>
        We share personal data only with the providers strictly necessary to operate the
        site:
      </p>
      <ul>
        <li><strong>Ghost</strong> — content and newsletter delivery platform.</li>
        <li><strong>Vercel</strong> — website hosting and content delivery.</li>
        <li>
          <strong>Plausible Analytics</strong> — privacy-friendly, cookieless web
          analytics (EU-hosted).
        </li>
      </ul>
      <p>
        We do not sell, rent, or otherwise transfer personal data to third parties for
        their own marketing purposes.
      </p>

      <h2>5. International transfers</h2>
      <p>
        As Arbi Smart Solutions LLC is established in the UAE, personal data may be
        transferred outside the European Economic Area. Where this occurs, transfers rely
        on appropriate safeguards (Standard Contractual Clauses or equivalent) and we use
        EU-hosted sub-processors where feasible.
      </p>

      <h2>6. How long we keep it (retention)</h2>
      <ul>
        <li>
          <strong>Newsletter:</strong> until you unsubscribe. Each email includes a
          one-click unsubscribe link.
        </li>
        <li>
          <strong>Enquiry forms:</strong> for up to 24 months after the last meaningful
          contact, then deleted.
        </li>
        <li>
          <strong>Aggregated analytics:</strong> indefinitely, since it contains no
          personal data.
        </li>
      </ul>

      <h2>7. Your rights</h2>
      <p>
        Under GDPR you have the right to access, rectify, erase, restrict, and port your
        personal data, and to object to processing. You can also withdraw consent at any
        time. To exercise any of these rights, email{" "}
        <a href="mailto:privacy@vamos.net">privacy@vamos.net</a>. You also have the right
        to lodge a complaint with your local data-protection authority.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We do not use tracking cookies. We use a single technical cookie required for the
        site to function correctly (e.g. session preferences). Because no consent-based
        cookies are set, no consent banner is shown.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy as the service evolves. Material changes will be
        announced via the newsletter and on this page.
      </p>

      <p className="text-text-tertiary">
        <em>
          This is a starting draft. Subscribers should rely on the version of this policy
          published at the time of their subscription.
        </em>
      </p>
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}
