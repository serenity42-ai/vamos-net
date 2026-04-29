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
import { articles as mockArticles, type Article } from '@/data/mock';

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
]);

export function isHubPost(primarySlug?: string): boolean {
  return primarySlug ? HUB_PRIMARY_TAGS.has(primarySlug) : false;
}

/**
 * Map a Ghost primary tag slug to our News-section category taxonomy.
 *
 * News tags: "tour-news", "rankings", "business", "academy".
 * Hub tags (lifestyle / rules / review / training) are filtered out before
 * this is called, so they never reach this mapper.
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
export async function fetchArticles(): Promise<Article[]> {
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

    // Exclude posts whose primary tag belongs to Player's Hub. They are
    // surfaced on /hub/* pages, not in the News feed.
    const newsPosts = posts.filter(
      (p) => !isHubPost(p.primary_tag?.slug)
    );

    return newsPosts.map(ghostPostToArticle);
  } catch (err) {
    console.error('[ghost] fetchArticles failed, falling back to mock:', err);
    return mockArticles;
  }
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
 * Fetch all published slugs — used for generateStaticParams / sitemap.
 */
export async function fetchAllSlugs(): Promise<string[]> {
  const all = await fetchArticles();
  return all.map((a) => a.slug);
}
