import HubPlaceholder from "@/components/HubPlaceholder";

export const metadata = {
  title: "Rules & Game | Player's Hub | VAMOS",
  description:
    "Padel rules, scoring, court dimensions, history, glossary. The definitive guide to the game for new and returning players.",
};

export default function HubRulesPage() {
  return (
    <HubPlaceholder
      section="Rules & Game"
      eyebrow="Cluster 01 · Foundations"
      display="Learn the"
      italic="game"
      intro="Padel rules, scoring, court dimensions, history, terminology. The complete guide for new players, occasional players, and anyone who wants to understand the sport behind the spectacle."
      articles={[
        { slug: "what-is-padel", title: "What is padel? The complete beginner's guide", status: "coming" },
        { slug: "padel-rules-explained", title: "Padel rules, explained simply", status: "coming" },
        { slug: "padel-scoring-system", title: "How padel scoring works", status: "coming" },
        { slug: "padel-court-dimensions", title: "Padel court dimensions and layout", status: "coming" },
        { slug: "padel-glossary", title: "Padel glossary: every term you'll hear on court", status: "coming" },
        { slug: "padel-vs-tennis", title: "Padel vs tennis: differences that matter", status: "coming" },
        { slug: "history-of-padel", title: "The history of padel, from Acapulco to today", status: "coming" },
        { slug: "padel-olympics", title: "Padel at the Olympics: what's the path?", status: "coming" },
        { slug: "how-to-play-padel-beginners", title: "How to play padel: a beginner's first session", status: "coming" },
        { slug: "padel-courts-near-me", title: "Where to play: finding padel courts in your city", status: "coming" },
      ]}
    />
  );
}
