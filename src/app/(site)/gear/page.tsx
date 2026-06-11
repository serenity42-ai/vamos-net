import type { Metadata } from "next";
import Link from "next/link";
import { fetchArticles } from "@/lib/ghost";
import ArticleCard from "@/components/v3/ArticleCard";

/**
 * Gear & Improve pillar landing — Equipment + Training.
 *
 * One of three core pillars (thesis locked 2026-06-10). Aggregates Reviews,
 * Training, Rules, and Lifestyle (player-improvement content). Affiliate
 * revenue surface — every review should funnel into /go/[slug] redirects.
 *
 * Editorial weight target: ~30% of Vamos.net.
 */

export const metadata: Metadata = {
  title: "Gear & Improve — Reviews, Training, Guides | Vamos.net",
  description:
    "Padel equipment reviews, training guides, technique deep-dives, and the kit that actually performs. From rackets and shoes to AI cameras and training tech.",
  robots: { index: true, follow: true },
};

export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vamos.net" },
    { "@type": "ListItem", position: 2, name: "Gear & Improve", item: "https://vamos.net/gear" },
  ],
};

const GEAR_CATEGORIES = new Set(["Reviews", "Training", "Rules", "Lifestyle"]);

export default async function GearPage() {
  const articles = await fetchArticles();
  const pillarArticles = articles.filter((a) => GEAR_CATEGORIES.has(a.category));

  const reviews = pillarArticles.filter((a) => a.category === "Reviews");
  const training = pillarArticles.filter((a) => a.category === "Training");
  const rules = pillarArticles.filter((a) => a.category === "Rules");
  const lifestyle = pillarArticles.filter((a) => a.category === "Lifestyle");

  const Section = ({ title, items, href }: { title: string; items: typeof pillarArticles; href: string }) =>
    items.length > 0 ? (
      <section className="px-16 pb-48 md:px-32 lg:px-48">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between mb-24">
            <h2
              className="font-display text-mobile-heading-m md:text-desktop-heading-m"
              style={{ lineHeight: 1.1 }}
            >
              {title}
            </h2>
            <Link
              href={href}
              className="font-display font-semibold text-14 hover:underline"
              style={{ color: "var(--color-brand, #FE4C00)" }}
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={a} hrefBase="/news" />
            ))}
          </div>
        </div>
      </section>
    ) : null;

  return (
    <main className="bg-bg-page text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero / intro */}
      <section className="px-16 pt-48 pb-32 md:px-32 md:pt-64 md:pb-48 lg:px-48">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-display font-semibold uppercase tracking-wide text-body-s"
            style={{ color: "var(--color-brand, #FE4C00)" }}
          >
            Gear &amp; Improve
          </p>
          <h1
            className="font-display mt-8 text-mobile-heading-l md:text-desktop-heading-xl"
            style={{ lineHeight: 1.05 }}
          >
            Play better. Buy smarter.
          </h1>
          <p className="mt-16 font-body text-mobile-body-l md:text-desktop-body-l max-w-3xl">
            Honest reviews, training that actually works, and the kit worth your
            money. From rackets and shoes to AI cameras, court tech, and the
            drills that separate club players from podium players.
          </p>
        </div>
      </section>

      <Section title="Reviews" items={reviews} href="/hub?category=reviews" />
      <Section title="Training" items={training} href="/hub?category=training" />
      <Section title="Rules & Game" items={rules} href="/hub?category=rules" />
      <Section title="Lifestyle" items={lifestyle} href="/hub?category=lifestyle" />

      {pillarArticles.length === 0 && (
        <section className="px-16 py-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-mobile-body-l md:text-desktop-body-l text-text-secondary">
              Reviews and training content launching shortly. Bookmark this page.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
