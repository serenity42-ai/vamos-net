import HubPlaceholder from "@/components/HubPlaceholder";
import { fetchArticlesByPrimaryTag } from "@/lib/ghost";

export const metadata = {
  title: "Lifestyle | Player's Hub | VAMOS",
  description:
    "Padel beyond the court — culture, travel, food, fashion, the people who make the sport.",
};

// Revalidate every 60s so newly published Ghost posts appear quickly.
export const revalidate = 60;

const PLACEHOLDERS = [
  { slug: "padel-travel-guide-marbella", title: "The padel traveller's guide to Marbella" },
  { slug: "padel-travel-guide-buenos-aires", title: "Buenos Aires: where padel was born" },
  { slug: "what-pros-eat-on-tour", title: "What the pros eat on tour" },
  { slug: "padel-style-on-court-and-off", title: "Padel style: on court and off" },
  { slug: "padel-clubs-paris", title: "The best padel clubs in Paris" },
  { slug: "padel-clubs-london", title: "The best padel clubs in London" },
  { slug: "padel-clubs-dubai", title: "The best padel clubs in Dubai" },
] as const;

export default async function HubLifestylePage() {
  const live = await fetchArticlesByPrimaryTag("lifestyle");
  const liveSlugs = new Set(live.map((a) => a.slug));
  const coming = PLACEHOLDERS.filter((p) => !liveSlugs.has(p.slug));

  const articles = [
    ...live.map((a) => ({ slug: a.slug, title: a.title, status: "live" as const })),
    ...coming.map((c) => ({ slug: c.slug, title: c.title, status: "coming" as const })),
  ];

  return (
    <HubPlaceholder
      section="Lifestyle"
      eyebrow="Cluster 04 · Culture"
      display="Padel"
      italic="off-court"
      intro="The sport beyond the glass walls. Travel guides for padel destinations, food and recovery, the fashion of the tour, and the people who shape the culture."
      articles={articles}
    />
  );
}
