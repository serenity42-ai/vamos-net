import HubPlaceholder from "@/components/HubPlaceholder";

export const metadata = {
  title: "Reviews | Player's Hub | VAMOS",
  description:
    "Padel rackets, shoes, apparel and accessories — buyer's guides, editor's picks, and honest reviews.",
};

export default function HubReviewsPage() {
  return (
    <HubPlaceholder
      section="Reviews"
      eyebrow="Cluster 02 · Equipment"
      display="Find your"
      italic="kit"
      intro="Rackets, shoes, apparel, accessories. Buyer's guides for every level, editor's picks for every budget. We pick what we'd actually play with — not what the brand pays for."
      articles={[
        { slug: "best-padel-rackets-2026", title: "The best padel rackets of 2026", status: "coming" },
        { slug: "how-to-choose-padel-racket", title: "How to choose a padel racket: shape, weight, balance", status: "coming" },
        { slug: "best-padel-shoes-2026", title: "The best padel shoes of 2026", status: "coming" },
        { slug: "best-padel-apparel-2026", title: "Padel apparel: tops, shorts, compression", status: "coming" },
        { slug: "padel-grips-overgrips-guide", title: "Grips and overgrips: a complete guide", status: "coming" },
        { slug: "padel-bags-2026", title: "The best padel bags of 2026", status: "coming" },
        { slug: "padel-eyewear-protection", title: "Eyewear: protect your eyes on a glass court", status: "coming" },
        { slug: "diamond-vs-round-vs-teardrop", title: "Diamond vs round vs teardrop: which racket shape suits you?", status: "coming" },
      ]}
    />
  );
}
