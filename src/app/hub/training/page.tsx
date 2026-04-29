import HubPlaceholder from "@/components/HubPlaceholder";
import { fetchArticlesByPrimaryTag } from "@/lib/ghost";

export const metadata = {
  title: "Training | Player's Hub | VAMOS",
  description:
    "Padel technique, drills, mindset, fuel and recovery. Everything that makes you better between matches.",
};

export const revalidate = 60;

const PLACEHOLDERS = [
  { slug: "the-six-shots-every-beginner-needs", title: "The six shots every beginner needs" },
  { slug: "wall-play-guide", title: "Wall play: the shot that decides matches" },
  { slug: "padel-positioning-net-vs-baseline", title: "Positioning: net vs baseline, when and why" },
  { slug: "communicating-with-your-partner", title: "How to communicate with your partner when you're losing" },
  { slug: "padel-warm-up-routine", title: "A 5-minute padel warm-up routine that actually works" },
  { slug: "speed-and-reaction-drills", title: "Speed and reaction drills you can do at home" },
  { slug: "what-to-eat-before-a-match", title: "What to eat 90 minutes before a match" },
  { slug: "post-match-recovery-protocol", title: "The 3-day recovery protocol after a tournament" },
  { slug: "pre-match-mental-prep", title: "Pre-match mental prep of a top-100 player" },
  { slug: "common-padel-injuries", title: "Common padel injuries and how to prevent them" },
] as const;

export default async function HubTrainingPage() {
  const live = await fetchArticlesByPrimaryTag("training");
  const liveSlugs = new Set(live.map((a) => a.slug));
  const coming = PLACEHOLDERS.filter((p) => !liveSlugs.has(p.slug));

  const articles = [
    ...live.map((a) => ({ slug: a.slug, title: a.title, status: "live" as const })),
    ...coming.map((c) => ({ slug: c.slug, title: c.title, status: "coming" as const })),
  ];

  return (
    <HubPlaceholder
      section="Training"
      eyebrow="Cluster 05 · Get Better"
      display="Train to"
      italic="win"
      intro="Technique, drills, strategy, mindset, fuel and recovery. Original content from coaches and players who actually compete — not generic advice."
      articles={articles}
    />
  );
}
