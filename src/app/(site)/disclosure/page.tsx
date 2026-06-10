import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Vamos.net",
  description:
    "How Vamos.net uses affiliate links in gear reviews and buying guides, and how that relationship affects (or doesn't affect) our editorial.",
  robots: { index: true, follow: true },
};

/**
 * Affiliate Disclosure — DRAFT.
 *
 * Per restructure spec §2.1 and §8.3. Auto-inserted by the gear review template
 * (a single sentence) and linked from there to this fuller page. This page also
 * appears in the footer.
 *
 * The legal trigger is the FTC Endorsement Guides in the US and, for EU users,
 * the Unfair Commercial Practices Directive — both require clear disclosure of
 * material connections. The standard sentence below satisfies both.
 */
export default function AffiliateDisclosurePage() {
  return (
    <main className="prose prose-stone mx-auto max-w-3xl px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
      <h1 className="text-mobile-heading-l md:text-desktop-heading-l">
        Affiliate Disclosure
      </h1>
      <p className="text-text-tertiary">
        <em>Last updated: {formatDate(new Date())}</em>
      </p>

      <h2>The short version</h2>
      <p>
        Some links to retailers on Vamos.net are affiliate links. When you click one and
        complete a purchase, we may earn a commission. The price you pay is the same.
      </p>

      <h2>Why we do it</h2>
      <p>
        Affiliate commissions fund independent editorial work — testing rackets, building
        the academies directory, traveling to tournaments, writing about court economics.
        Without them, the alternative would be intrusive display advertising or a hard
        paywall. We prefer this model.
      </p>

      <h2>How it affects coverage</h2>
      <p>
        It doesn&rsquo;t. We do not let retailers, manufacturers, or affiliate programs
        influence what we review, what we recommend, or what we say. If a product is bad,
        we say it&rsquo;s bad. If we change a recommendation, we say why and we
        re-test &mdash; not because a retailer asked us to.
      </p>

      <h2>How we test gear</h2>
      <p>
        Every gear review on Vamos.net describes the testing setup: how long we played
        with the product, on what surface, against what level, and what we compared it
        to. Our reviewers are real padel players, not press-release rewriters.
      </p>

      <h2>What we never do</h2>
      <ul>
        <li>Promise positive coverage in exchange for affiliate commission.</li>
        <li>Hide an affiliate link or fail to label it.</li>
        <li>Accept payment to remove a negative review.</li>
        <li>Republish a manufacturer&rsquo;s marketing copy as a review.</li>
      </ul>

      <h2>Sponsored content</h2>
      <p>
        Separately from affiliate links, we sometimes publish sponsored content (for
        example, a brand-funded long-form profile, or a &ldquo;presented by&rdquo; slot
        on a tournament recap). Sponsored content is always clearly labelled at the top
        of the page and at the affected component. Sponsored content is never disguised
        as editorial.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href="mailto:hello@vamos.net">hello@vamos.net</a>. Brands and PR
        agencies should email <a href="mailto:partners@vamos.net">partners@vamos.net</a>.
      </p>
    </main>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}
