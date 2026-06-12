import type { Metadata } from "next";
import Link from "next/link";
import { fetchArticles } from "@/lib/ghost";
import ArticleCard from "@/components/v3/ArticleCard";

/**
 * Business pillar landing — "Courts & Clubs" hub.
 *
 * One of three core pillars (thesis locked 2026-06-10). This page aggregates
 * editorial tagged Business or Clubs, plus a clear positioning intro and a
 * funnel into /services for advisory inbound.
 *
 * Editorial weight target: ~50% of Vamos.net (Courts & Clubs is the largest
 * pillar — operators, builders, federation deals, club training).
 */

export const metadata: Metadata = {
  title: "Padel Business — Courts, Clubs & Deals | Vamos.net",
  description:
    "The business of padel: courts, clubs, operators, federation deals, and the deals that shape the fastest-growing sport. From single-club opens to multi-stop circuits.",
  robots: { index: true, follow: true },
};

export const revalidate = 60;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vamos.net" },
    { "@type": "ListItem", position: 2, name: "Business", item: "https://vamos.net/business" },
  ],
};

export default async function BusinessPage() {
  const articles = await fetchArticles();
  const pillarArticles = articles.filter(
    (a) => a.category === "Business" || a.category === "Clubs",
  );
  const featured = pillarArticles.slice(0, 1)[0];
  const rest = pillarArticles.slice(1, 13);

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
            Business
          </p>
          <h1
            className="font-display mt-8 text-mobile-heading-l md:text-desktop-heading-xl"
            style={{ lineHeight: 1.05 }}
          >
            The business of padel.
          </h1>
          <p className="mt-16 font-body text-mobile-body-l md:text-desktop-body-l max-w-3xl">
            Courts, clubs, operators, federation deals, court tech, personnel
            training. The pillar that pays the bills in this sport — and the one
            we cover with the most depth. If you build, own, or invest in padel
            infrastructure, you are our reader.
          </p>
          <div className="mt-24 flex flex-wrap gap-12">
            <Link
              href="/services"
              className="inline-flex items-center rounded-full px-24 py-12 font-display font-semibold text-16"
              style={{ background: "var(--color-brand, #FE4C00)", color: "var(--color-bg-white, #fff)" }}
            >
              Talk to advisory →
            </Link>
            <Link
              href="/hub?category=business"
              className="inline-flex items-center rounded-full px-24 py-12 font-display font-semibold text-16 border"
              style={{ borderColor: "var(--color-border-primary)" }}
            >
              All business articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-16 py-32 md:px-32 md:py-48 lg:px-48">
          <div className="mx-auto max-w-6xl">
            <ArticleCard article={featured} hrefBase="/news" />
          </div>
        </section>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <section className="px-16 pb-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-6xl">
            <h2
              className="font-display text-mobile-heading-m md:text-desktop-heading-m mb-24"
              style={{ lineHeight: 1.1 }}
            >
              Latest in business
            </h2>
            <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/news" />
              ))}
            </div>
          </div>
        </section>
      )}

      {pillarArticles.length === 0 && (
        <section className="px-16 py-64 md:px-32 lg:px-48">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-mobile-body-l md:text-desktop-body-l text-text-secondary">
              Editorial coverage launching shortly. In the meantime, see our{" "}
              <Link href="/services" className="underline" style={{ color: "var(--color-brand, #FE4C00)" }}>
                advisory practice
              </Link>
              .
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
