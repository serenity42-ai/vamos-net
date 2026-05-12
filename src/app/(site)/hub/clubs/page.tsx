import HubPlaceholder from "@/components/HubPlaceholder";
import { fetchArticlesByPrimaryTag } from "@/lib/ghost";

export const metadata = {
  title: "Clubs | Player's Hub | VAMOS",
  description:
    "Padel club reviews, news, and openings — the places where the game lives.",
};

// Revalidate every 60s so newly published Ghost posts appear quickly.
export const revalidate = 60;

const PLACEHOLDERS = [
  { slug: "best-padel-clubs-paris", title: "The best padel clubs in Paris" },
  { slug: "best-padel-clubs-london", title: "The best padel clubs in London" },
  { slug: "best-padel-clubs-dubai", title: "The best padel clubs in Dubai" },
  { slug: "best-padel-clubs-madrid", title: "The best padel clubs in Madrid" },
  { slug: "best-padel-clubs-barcelona", title: "The best padel clubs in Barcelona" },
  { slug: "padel-club-openings-2026", title: "New padel club openings: 2026 watch list" },
] as const;

export default async function HubClubsPage() {
  const live = await fetchArticlesByPrimaryTag("clubs");
  const liveSlugs = new Set(live.map((a) => a.slug));
  const coming = PLACEHOLDERS.filter((p) => !liveSlugs.has(p.slug));

  const articles = [
    ...live.map((a) => ({ slug: a.slug, title: a.title, status: "live" as const })),
    ...coming.map((c) => ({ slug: c.slug, title: c.title, status: "coming" as const })),
  ];

  return (
    <HubPlaceholder
      section="Clubs"
      eyebrow="Cluster 06 · Venues"
      display="Where the game"
      italic="lives"
      intro="Padel clubs reviewed and ranked, openings tracked city by city, and the venues shaping how the sport is played from Paris to Buenos Aires."
      articles={articles}
    />
  );
}
