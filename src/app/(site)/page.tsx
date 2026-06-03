import Link from "next/link";
import Button from "@/components/Button";
import BannerDesktop, { type BannerSlide } from "@/components/v3/BannerDesktop";
import BannerMobile from "@/components/v3/BannerMobile";
import ArticleCard from "@/components/v3/ArticleCard";
import ArticleCardHero from "@/components/v3/ArticleCardHero";
import ArticleCardHorizontal from "@/components/v3/ArticleCardHorizontal";
import TournamentCard from "@/components/v3/TournamentCard";
import { fetchArticles } from "@/lib/ghost";
import {
  getSeasonTournaments,
  getMatches,
  getLiveMatches,
  type Match,
  type Tournament,
  type LiveMatchData,
} from "@/lib/padel-api";
import { normalizeMatches, buildContext } from "@/lib/normalize-match";
import type { Article } from "@/data/mock";

// Revalidate the homepage every 30s so live scores/tournaments don't go stale
// beyond a half-minute. Individual API fetches keep their own shorter windows
// (15s for /live) inside padel-api.ts.
export const revalidate = 30;

async function fetchHomeData() {
  // Parallel fetch — none of these depend on each other.
  const [s5Res, s6Res, recentMatchesRes, liveRes] = await Promise.allSettled([
    getSeasonTournaments(5, { per_page: "50" }),
    getSeasonTournaments(6, { per_page: "50" }),
    getMatches({
      sort_by: "played_at",
      order_by: "desc",
      per_page: "20",
    }),
    getLiveMatches(),
  ]);

  const tournaments: Tournament[] = [
    ...(s5Res.status === "fulfilled" ? s5Res.value.data : []),
    ...(s6Res.status === "fulfilled" ? s6Res.value.data : []),
  ];
  const recentMatches: Match[] =
    recentMatchesRes.status === "fulfilled" ? recentMatchesRes.value.data : [];
  const liveData: LiveMatchData[] =
    liveRes.status === "fulfilled" ? liveRes.value.data : [];

  const ctx = buildContext(liveData);
  const matches = normalizeMatches(recentMatches, ctx);

  return { tournaments, matches };
}

function pickTournaments(tournaments: Tournament[], limit = 4): Tournament[] {
  // Priority: live → pending (closest start date) → finished (most recent end_date)
  const live = tournaments.filter((t) => t.status === "live");
  const pending = tournaments
    .filter((t) => t.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  const finished = tournaments
    .filter((t) => t.status === "finished")
    .sort(
      (a, b) =>
        new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
    );
  return [...live, ...pending, ...finished].slice(0, limit);
}

function pickTopAuthor(articles: Article[]): {
  name: string;
  articles: Article[];
} | null {
  const counts = new Map<string, number>();
  for (const a of articles) {
    if (!a.author) continue;
    counts.set(a.author, (counts.get(a.author) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  const [topName] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  const byAuthor = articles.filter((a) => a.author === topName);
  return { name: topName, articles: byAuthor };
}

export default async function Home() {
  // Kick off Ghost articles in parallel with the PadelAPI fetches so CMS
  // latency doesn't stack on top of the data layer.
  const [{ tournaments }, articles] = await Promise.all([
    fetchHomeData(),
    fetchArticles(),
  ]);

  // === Hero carousel: 3 most recent articles ===
  const heroArticles = articles.slice(0, 3);
  const bannerSlides: BannerSlide[] = heroArticles.map((a) => ({
    image: a.imageUrl || "/og-default.png",
    eyebrow: "FEATURED",
    title: a.title,
    body: a.excerpt,
    ctaText: "Read article",
    ctaHref: `/news/${a.slug}`,
  }));

  // === Last news: 1 hero + 3 horizontal sidebar ===
  const lastNewsHero = articles[3] ?? articles[0];
  const lastNewsSidebar = articles.slice(4, 7);

  // === Tournaments band ===
  const featuredTournaments = pickTournaments(tournaments, 4);

  // === Best Reviews — articles in "Reviews" category, else hide ===
  const reviewArticles = articles
    .filter((a) => a.category === "Reviews")
    .slice(0, 4);

  // === Premier Padel content row — "Tour News" else fallback to recent ===
  const tourNews = articles.filter((a) => a.category === "Tour News");
  const premierPadelArticles = (tourNews.length >= 4
    ? tourNews
    : articles
  ).slice(0, 4);

  // === Author block ===
  const topAuthor = pickTopAuthor(articles);
  const authorArticles = topAuthor?.articles.slice(0, 6) ?? [];

  return (
    <main className="bg-bg-page">
      {/* === Section 1: Hero carousel === */}
      {bannerSlides.length > 0 && (
        <section className="px-16 pt-24 md:px-32 md:pt-32 lg:px-48">
          <div className="mx-auto max-w-[1440px]">
            <div className="hidden md:block">
              <BannerDesktop slides={bannerSlides} />
            </div>
            <div className="md:hidden">
              <BannerMobile slides={bannerSlides} />
            </div>
          </div>
        </section>
      )}

      {/* === Section 2: LAST NEWS === */}
      {lastNewsHero && (
        <section className="px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                LAST NEWS
              </h2>
              <Button
                as={Link}
                href="/hub"
                variant="ghost"
                size="sm"
                trailingIcon="arrow"
                className="hidden sm:inline-flex"
              >
                All news
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-24 lg:grid-cols-12 lg:gap-32">
              <div className="lg:col-span-8">
                <ArticleCardHero article={lastNewsHero} />
              </div>
              <div className="flex flex-col gap-20 lg:col-span-4">
                {lastNewsSidebar.map((a) => (
                  <ArticleCardHorizontal key={a.slug} article={a} />
                ))}
              </div>
            </div>

            <div className="mt-32 sm:hidden">
              <Button
                as={Link}
                href="/hub"
                variant="ghost"
                trailingIcon="arrow"
                className="w-full justify-between"
              >
                All news
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* === Section 3: TOURNAMENTS dark band === */}
      {featuredTournaments.length > 0 && (
        <section className="bg-bg-constant text-text-contrast">
          <div className="mx-auto max-w-[1440px] px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
            <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
                ON THE TOUR
              </h2>
              <Button
                as={Link}
                href="/tournaments"
                variant="outline"
                size="sm"
                trailingIcon="arrow"
                className="hidden sm:inline-flex"
              >
                View calendar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  tournament={t}
                  variant="dark"
                />
              ))}
            </div>

            <div className="mt-32 sm:hidden">
              <Button
                as={Link}
                href="/tournaments"
                variant="outline"
                trailingIcon="arrow"
                className="w-full justify-between"
              >
                View calendar
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* === Section 4: BEST REVIEWS — hidden when empty === */}
      {reviewArticles.length > 0 && (
        <section className="px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                BEST REVIEWS
              </h2>
              <Button
                as={Link}
                href="/hub/review"
                variant="ghost"
                size="sm"
                trailingIcon="arrow"
                className="hidden sm:inline-flex"
              >
                All reviews
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 lg:grid-cols-4">
              {reviewArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} hrefBase="/hub" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Section 5: PADELSPOTS / LIVE FROM PREMIER PADEL placeholder === */}
      <section className="bg-bg-constant text-text-contrast">
        <div className="mx-auto max-w-[1440px] px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
          <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
            <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-contrast">
              PADELSPOTS
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-32 bg-bg-gray">
            <div
              className="relative flex flex-col justify-end gap-20 p-24 md:p-40 lg:p-48"
              style={{ aspectRatio: "16 / 7", minHeight: 320 }}
            >
              {/* Decorative gradient stand-in for video */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(24,29,39,0.95) 0%, rgba(24,29,39,0.7) 40%, rgba(254,76,0,0.55) 100%)",
                }}
              />
              <div className="relative z-[5] flex max-w-[640px] flex-col gap-16">
                <span className="text-uppercase-eyebrow text-brand">
                  LIVE STREAM
                </span>
                <h3 className="text-mobile-heading-l md:text-desktop-heading-m text-text-contrast">
                  Live from the Premier Padel circuit
                </h3>
                <p className="text-body-l text-text-contrast/85">
                  Catch every point as it happens — match feeds, highlights and
                  on-court interviews.
                </p>
                <div>
                  <Button
                    as={Link}
                    href="/scores"
                    variant="primary"
                    trailingIcon="arrow"
                  >
                    Watch live
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Section 6: PREMIER PADEL content row === */}
      {premierPadelArticles.length > 0 && (
        <section className="px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                PREMIER PADEL
              </h2>
              <Button
                as={Link}
                href="/hub"
                variant="ghost"
                size="sm"
                trailingIcon="arrow"
                className="hidden sm:inline-flex"
              >
                More stories
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-24 sm:grid-cols-2 lg:grid-cols-4">
              {premierPadelArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === Section 7: AUTHOR articles === */}
      {topAuthor && authorArticles.length > 0 && (
        <section className="bg-bg-gray">
          <div className="mx-auto max-w-[1440px] px-16 py-48 md:px-32 md:py-64 lg:px-48 lg:py-80">
            <div className="mb-32 flex items-end justify-between gap-16 md:mb-40">
              <h2 className="text-mobile-heading-l md:text-desktop-heading-l text-text-primary">
                {topAuthor.name.toUpperCase()}&rsquo;S ARTICLES
              </h2>
              <Button
                as={Link}
                href="/hub"
                variant="ghost"
                size="sm"
                trailingIcon="arrow"
                className="hidden sm:inline-flex"
              >
                All articles
              </Button>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="-mx-16 overflow-x-auto px-16 pb-8 md:hidden">
              <div className="flex w-max gap-16">
                {authorArticles.map((a) => (
                  <div key={a.slug} className="w-[300px] shrink-0">
                    <ArticleCardHorizontal article={a} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden gap-24 md:grid md:grid-cols-2 lg:grid-cols-3">
              {authorArticles.slice(0, 6).map((a) => (
                <ArticleCardHorizontal key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
