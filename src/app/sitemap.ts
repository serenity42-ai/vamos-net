import type { MetadataRoute } from "next";
import { fetchAllSlugsWithDates } from "@/lib/ghost";

/**
 * sitemap.ts (audit M1)
 *
 * Lists every indexable URL on vamos.net with sane priority + change
 * frequency hints. Static routes are hardcoded; Ghost articles come from
 * the Content API.
 *
 * Revalidates with the global ISR cache so newly published articles show
 * up within the same window as the homepage feed.
 */

const SITE_URL = "https://vamos.net";

export const revalidate = 600; // 10 min — matches our slug-enumeration cache

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1.0 },
    { url: `${SITE_URL}/scores`, lastModified: now, changeFrequency: "always", priority: 0.9 },
    { url: `${SITE_URL}/matches`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/schedule`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/tournaments`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/rankings`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/players`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/hub`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/hub/business`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hub/clubs`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hub/lifestyle`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hub/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hub/rules`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hub/training`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Ghost articles — pulled with updated_at so search engines re-crawl when
  // an article is edited. fetchAllSlugsWithDates falls back to mock data on
  // any Ghost error so a CMS outage doesn't break the sitemap.
  const articleEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await fetchAllSlugsWithDates();
    for (const a of articles) {
      articleEntries.push({
        url: `${SITE_URL}/hub/${a.slug}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    // Sitemap should always render; skip article entries on failure.
  }

  return [...staticEntries, ...articleEntries];
}
