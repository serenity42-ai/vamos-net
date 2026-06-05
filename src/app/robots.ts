import type { MetadataRoute } from "next";

/**
 * robots.ts (audit M1)
 *
 * Allow everything in production. Disallow the soft-launch gate page so
 * search engines don't index the coming-soon variant, and block /api so
 * route handlers stay out of the crawl. Sitemap reference points at the
 * canonical site URL.
 */

const SITE_URL = "https://vamos.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/coming-soon"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
