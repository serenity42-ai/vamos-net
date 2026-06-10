/**
 * Affiliate link registry — per restructure spec §5.
 *
 * Every outbound affiliate link goes through /go/{slug}. The slug -> URL
 * mapping lives here so retailers can be swapped without editing posts.
 *
 * Conventions:
 *  - Slug is lowercase, kebab-case, scoped by product/retailer:
 *      bullpadel-vertex-04-padeluk
 *      adidas-metalbone-fanatik
 *  - destinationUrl includes the affiliate tag / sub-id when the program
 *    requires it; no client-side URL construction.
 *  - retailer is shown in the UI ("Buy at PadelNuestro").
 *  - priceGbp / priceEur are display hints only — the retailer is the source
 *    of truth at checkout. Update opportunistically.
 *  - program is the affiliate network (Awin, Skimlinks, direct, etc.) so we
 *    can audit revenue by program later.
 *  - addedAt helps us spot stale entries.
 *
 * Empty registry at launch is fine — links render nothing rather than 404
 * to /go/<unknown>.
 */

export type AffiliateLink = {
  slug: string;
  destinationUrl: string;
  retailer: string;
  program?: string;
  priceGbp?: number;
  priceEur?: number;
  addedAt: string; // ISO date
  note?: string;
};

const REGISTRY: Record<string, AffiliateLink> = {
  // Example entry, left in as a template. Replace or delete before launch.
  "example-bullpadel-vertex-04": {
    slug: "example-bullpadel-vertex-04",
    destinationUrl: "https://www.padelnuestro.com/", // replace with real affiliate URL
    retailer: "PadelNuestro",
    program: "direct",
    priceEur: 219,
    addedAt: "2026-06-10",
    note: "EXAMPLE — replace with real Bullpadel Vertex 04 affiliate URL before the first review ships.",
  },
};

export function getAffiliateLink(slug: string): AffiliateLink | undefined {
  return REGISTRY[slug];
}

export function listAffiliateLinks(): AffiliateLink[] {
  return Object.values(REGISTRY).sort((a, b) =>
    a.addedAt < b.addedAt ? 1 : a.addedAt > b.addedAt ? -1 : 0
  );
}
