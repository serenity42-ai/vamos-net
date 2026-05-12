import HubPlaceholder from "@/components/HubPlaceholder";
import { fetchArticlesByPrimaryTag } from "@/lib/ghost";

export const metadata = {
  title: "Reviews | Player's Hub | VAMOS",
  description:
    "Padel rackets, shoes, apparel and accessories — buyer's guides, editor's picks, and honest reviews.",
};

export const revalidate = 60;

const PLACEHOLDERS = [
  { slug: "best-padel-rackets-2026", title: "The best padel rackets of 2026" },
  { slug: "how-to-choose-padel-racket", title: "How to choose a padel racket: shape, weight, balance" },
  { slug: "best-padel-shoes-2026", title: "The best padel shoes of 2026" },
  { slug: "best-padel-apparel-2026", title: "Padel apparel: tops, shorts, compression" },
  { slug: "padel-grips-overgrips-guide", title: "Grips and overgrips: a complete guide" },
  { slug: "padel-bags-2026", title: "The best padel bags of 2026" },
  { slug: "padel-eyewear-protection", title: "Eyewear: protect your eyes on a glass court" },
  { slug: "diamond-vs-round-vs-teardrop", title: "Diamond vs round vs teardrop: which racket shape suits you?" },
] as const;

export default async function HubReviewsPage() {
  const live = await fetchArticlesByPrimaryTag("review");
  const liveSlugs = new Set(live.map((a) => a.slug));
  const coming = PLACEHOLDERS.filter((p) => !liveSlugs.has(p.slug));

  const articles = [
    ...live.map((a) => ({ slug: a.slug, title: a.title, status: "live" as const })),
    ...coming.map((c) => ({ slug: c.slug, title: c.title, status: "coming" as const })),
  ];

  return (
    <HubPlaceholder
      section="Reviews"
      eyebrow="Cluster 02 · Equipment"
      display="Find your"
      italic="kit"
      intro="Rackets, shoes, apparel, accessories. Buyer's guides for every level, editor's picks for every budget. We pick what we'd actually play with — not what the brand pays for."
      articles={articles}
    />
  );
}
