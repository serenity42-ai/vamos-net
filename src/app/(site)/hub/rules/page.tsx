import HubPlaceholder from "@/components/HubPlaceholder";
import { fetchArticlesByPrimaryTag } from "@/lib/ghost";

export const metadata = {
  title: "Rules & Game | Player's Hub | VAMOS",
  description:
    "Padel rules, scoring, court dimensions, history, glossary. The definitive guide to the game for new and returning players.",
};

export const revalidate = 60;

const PLACEHOLDERS = [
  { slug: "what-is-padel", title: "What is padel? The complete beginner's guide" },
  { slug: "padel-rules-explained", title: "Padel rules, explained simply" },
  { slug: "padel-scoring-system", title: "How padel scoring works" },
  { slug: "padel-court-dimensions", title: "Padel court dimensions and layout" },
  { slug: "padel-glossary", title: "Padel glossary: every term you'll hear on court" },
  { slug: "padel-vs-tennis", title: "Padel vs tennis: differences that matter" },
  { slug: "history-of-padel", title: "The history of padel, from Acapulco to today" },
  { slug: "padel-olympics", title: "Padel at the Olympics: what's the path?" },
  { slug: "how-to-play-padel-beginners", title: "How to play padel: a beginner's first session" },
  { slug: "padel-courts-near-me", title: "Where to play: finding padel courts in your city" },
] as const;

export default async function HubRulesPage() {
  const live = await fetchArticlesByPrimaryTag("rules");
  const liveSlugs = new Set(live.map((a) => a.slug));
  const coming = PLACEHOLDERS.filter((p) => !liveSlugs.has(p.slug));

  const articles = [
    ...live.map((a) => ({ slug: a.slug, title: a.title, status: "live" as const })),
    ...coming.map((c) => ({ slug: c.slug, title: c.title, status: "coming" as const })),
  ];

  return (
    <HubPlaceholder
      section="Rules & Game"
      eyebrow="Cluster 01 · Foundations"
      display="Learn the"
      italic="game"
      intro="Padel rules, scoring, court dimensions, history, terminology. The complete guide for new players, occasional players, and anyone who wants to understand the sport behind the spectacle."
      articles={articles}
    />
  );
}
