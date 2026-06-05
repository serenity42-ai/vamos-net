/**
 * Ghost CMS integration for vamos.net
 *
 * Fetches articles from Ghost Content API.
 * Falls back to mock.ts data if Ghost is unreachable or env vars missing.
 *
 * Env vars required:
 *   GHOST_URL              — e.g. https://vamos-net.ghost.io
 *   GHOST_CONTENT_API_KEY  — read-only content API key
 */

import GhostContentAPI, { type PostOrPage, type PostsOrPages, type Params } from '@tryghost/content-api';
import { unstable_cache } from 'next/cache';
import { articles as mockArticles, type Article } from '@/data/mock';

// Re-validation windows for Ghost content. The CMS isn't latency-critical
// the way live scores are, so we cache aggressively at the data-fetch layer
// in addition to whatever ISR window the page-level revalidate enforces.
// Articles change on editorial cadence (minutes-to-hours), not seconds.
const GHOST_REVALIDATE_LIST = 120; // article index / lists
const GHOST_REVALIDATE_DETAIL = 300; // single article
const GHOST_REVALIDATE_SLUGS = 600; // slug enumeration for sitemap/static gen

const GHOST_URL = process.env.GHOST_URL;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;

let api: ReturnType<typeof GhostContentAPI> | null = null;

function getClient() {
  if (!api) {
    if (!GHOST_URL || !GHOST_CONTENT_API_KEY) {
      throw new Error('Ghost env vars missing: GHOST_URL and GHOST_CONTENT_API_KEY must be set');
    }
    api = GhostContentAPI({
      url: GHOST_URL,
      key: GHOST_CONTENT_API_KEY,
      version: 'v5.0',
    });
  }
  return api;
}

export function isGhostConfigured(): boolean {
  return Boolean(GHOST_URL && GHOST_CONTENT_API_KEY);
}

/**
 * Player's Hub primary tags. Posts with one of these primary tags belong on
 * the corresponding /hub/* page, NOT on /news. They must be filtered out of
 * the news feed.
 */
const HUB_PRIMARY_TAGS = new Set([
  'lifestyle',
  'rules',
  'review',
  'training',
  'clubs',
]);

export function isHubPost(primarySlug?: string): boolean {
  return primarySlug ? HUB_PRIMARY_TAGS.has(primarySlug) : false;
}

/**
 * Map a Ghost primary tag slug to our category taxonomy. Both News-section
 * tags and Player's Hub tags are recognised so each article surfaces with
 * its correct badge regardless of which page renders it.
 *
 * News-section: "tour-news", "rankings", "business", "academy".
 * Player's Hub: "lifestyle", "training", "rules", "review", "clubs".
 * Defaults to "Tour News" for anything unrecognised so the site never
 * renders an empty category.
 */
function mapCategory(primarySlug?: string): Article['category'] {
  switch (primarySlug) {
    case 'rankings':
      return 'Rankings';
    case 'business':
      return 'Business';
    case 'academy':
      return 'Academy';
    case 'lifestyle':
      return 'Lifestyle';
    case 'training':
      return 'Training';
    case 'rules':
      return 'Rules';
    case 'review':
      return 'Reviews';
    case 'clubs':
      return 'Clubs';
    case 'tour-news':
    case 'news':
    case 'recap':
    case 'preview':
    default:
      return 'Tour News';
  }
}

/**
 * Normalise a Ghost post to our internal Article shape so the rest of the
 * site renders without template changes during the transition.
 */
function ghostPostToArticle(post: PostOrPage): Article {
  return {
    slug: post.slug,
    title: post.title ?? 'Untitled',
    excerpt: post.custom_excerpt ?? post.excerpt ?? '',
    category: mapCategory(post.primary_tag?.slug),
    author: post.primary_author?.name ?? 'Vamos',
    // Article model uses `date` as a string — publish date in ISO works fine.
    date: post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString(),
    imageUrl: post.feature_image ?? '',
    body: post.html ?? '',
  };
}

/**
 * Fetch all published articles from Ghost. On any error (network, config,
 * auth), fall back to the hardcoded mock.ts list so the site never breaks.
 */
// Wrapped in unstable_cache because the Ghost SDK uses its own HTTP client
// and bypasses Next's fetch cache. Without this, every SSR call would hit
// Ghost over the wire — ~150ms per render on the home page alone.
const fetchArticlesRaw = unstable_cache(
  async (): Promise<Article[]> => {
    if (!isGhostConfigured()) {
      return mockArticles;
    }

    try {
      const client = getClient();
      const posts: PostsOrPages = await client.posts.browse({
        limit: 'all',
        include: ['tags', 'authors'],
        filter: 'status:published',
        order: 'published_at DESC',
      } as Params);

      if (!Array.isArray(posts) || posts.length === 0) {
        // Ghost is empty — return mock data until migration completes.
        return mockArticles;
      }

      // All published posts are returned, including Hub-tagged ones, so
      // they appear in the global news feed with their correct category
      // badge (Lifestyle / Training / Rules / Reviews). The /news category
      // filter still narrows to News-only categories.
      return posts.map(ghostPostToArticle);
    } catch (err) {
      console.error('[ghost] fetchArticles failed, falling back to mock:', err);
      return mockArticles;
    }
  },
  ['ghost-articles-list'],
  { revalidate: GHOST_REVALIDATE_LIST, tags: ['ghost', 'ghost:articles'] }
);

export async function fetchArticles(): Promise<Article[]> {
  return fetchArticlesRaw();
}

/**
 * Fetch a single article by slug. Falls back to mock.ts if not found in Ghost.
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!isGhostConfigured()) {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  }

  try {
    const client = getClient();
    const post = await client.posts.read(
      { slug },
      { include: ['tags', 'authors'] } as Params
    );
    return ghostPostToArticle(post);
  } catch (err) {
    // Ghost returns 404 as a thrown error. Fall back to mock.
    const fallback = mockArticles.find((a) => a.slug === slug);
    if (!fallback) {
      console.error('[ghost] fetchArticleBySlug failed:', err);
    }
    return fallback ?? null;
  }
}

/**
 * Fetch N most recent articles — used for homepage news section, related
 * articles, etc.
 */
export async function fetchRecentArticles(limit = 4): Promise<Article[]> {
  const all = await fetchArticles();
  return all.slice(0, limit);
}

/**
 * Fetch all published articles for a given primary tag (Hub section).
 * Used by /hub/* pages.
 */
export async function fetchArticlesByPrimaryTag(
  tagSlug: string
): Promise<Article[]> {
  if (!isGhostConfigured()) {
    return [];
  }

  try {
    const client = getClient();
    const posts: PostsOrPages = await client.posts.browse({
      limit: 'all',
      include: ['tags', 'authors'],
      filter: `status:published+primary_tag:${tagSlug}`,
      order: 'published_at DESC',
    } as Params);

    if (!Array.isArray(posts)) return [];
    return posts.map(ghostPostToArticle);
  } catch (err) {
    console.error(
      `[ghost] fetchArticlesByPrimaryTag(${tagSlug}) failed:`,
      err
    );
    return [];
  }
}

/**
 * Slug + updated_at pair, used by app/sitemap.ts so search engines pick up
 * edits to existing Ghost posts.
 */
export interface ArticleSitemapEntry {
  slug: string;
  updatedAt: string;
}

/**
 * Like fetchAllSlugs but also returns the post's updated_at timestamp. Cheap
 * to keep separate — only sitemap.ts cares about the timestamps.
 */
export async function fetchAllSlugsWithDates(): Promise<ArticleSitemapEntry[]> {
  if (!isGhostConfigured()) {
    return mockArticles.map((a) => ({ slug: a.slug, updatedAt: a.date }));
  }
  try {
    const client = getClient();
    const posts: PostsOrPages = await client.posts.browse({
      limit: "all",
      include: ["tags"],
      filter: "status:published",
      order: "updated_at DESC",
    } as Params);
    if (!Array.isArray(posts)) {
      return mockArticles.map((a) => ({ slug: a.slug, updatedAt: a.date }));
    }
    return posts
      .filter((p) => Boolean(p.slug))
      .map((p) => ({
        slug: p.slug as string,
        updatedAt:
          (p.updated_at as string | null) ??
          (p.published_at as string | null) ??
          new Date().toISOString(),
      }));
  } catch (err) {
    console.error("[ghost] fetchAllSlugsWithDates failed, falling back:", err);
    return mockArticles.map((a) => ({ slug: a.slug, updatedAt: a.date }));
  }
}

/**
 * Fetch all published slugs (News + Hub) — used for generateStaticParams /
 * sitemap. Hub posts are excluded from /news listings but their detail pages
 * must still be statically generated and indexed.
 */
export async function fetchAllSlugs(): Promise<string[]> {
  if (!isGhostConfigured()) {
    return mockArticles.map((a) => a.slug);
  }
  try {
    const client = getClient();
    const posts: PostsOrPages = await client.posts.browse({
      limit: 'all',
      include: ['tags'],
      filter: 'status:published',
      order: 'published_at DESC',
    } as Params);
    if (!Array.isArray(posts)) return mockArticles.map((a) => a.slug);
    return posts.map((p) => p.slug).filter((s): s is string => Boolean(s));
  } catch (err) {
    console.error('[ghost] fetchAllSlugs failed, falling back to mock:', err);
    return mockArticles.map((a) => a.slug);
  }
}
