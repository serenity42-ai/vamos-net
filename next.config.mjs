/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/fantasypadeltour/**",
      },
      // Ghost CDN — hero images for posts come back from here when the CMS
      // is configured (the Hub article reader renders them via next/image).
      {
        protocol: "https",
        hostname: "storage.ghost.io",
      },
      // Legacy preview deployment that mock.ts still references for hero JPGs.
      // Safe to whitelist — read-only image fetches.
      {
        protocol: "https",
        hostname: "vamos-net.vercel.app",
      },
    ],
  },

  // Cache-Control: for score-facing pages we want Vercel's edge to serve from
  // its 30s ISR cache (s-maxage) but prevent the browser from holding stale
  // HTML beyond that. Without this, Chrome/Safari can cache the homepage for
  // hours and show a LIVE match that finished long ago.
  async headers() {
    const shortCache = [
      {
        key: "Cache-Control",
        // no-cache in the browser, 30s at the edge, 60s stale-while-revalidate
        value: "public, max-age=0, must-revalidate, s-maxage=30, stale-while-revalidate=60",
      },
    ];
    return [
      { source: "/", headers: shortCache },
      { source: "/scores", headers: shortCache },
      // L4 (audit): /scores has no sub-routes today, but keep this matcher
      // for future per-tournament or per-date deep links. Cheap to retain.
      { source: "/scores/:path*", headers: shortCache },
      { source: "/tournaments/:id", headers: shortCache },
    ];
  },

  // Permanent redirects.
  //
  // Three-pillar nav restructure (2026-06-11): /business, /gear, /pro are
  // now the canonical pillar landings. Old /hub/* category stubs redirect
  // INTO the new pillars (preserves any SEO juice they accumulated).
  //
  // Note: the previous /business -> /hub/business redirect (Apr 27 iteration)
  // is GONE on purpose. The browser may still have it cached as a 301 — if you
  // see /business landing on the Padel Hub, hard-refresh / clear site data once.
  async redirects() {
    return [
      // Business pillar
      { source: "/hub/business", destination: "/business", permanent: true },
      { source: "/hub/clubs", destination: "/business", permanent: true },
      // Gear & Improve pillar
      { source: "/hub/reviews", destination: "/gear", permanent: true },
      { source: "/hub/training", destination: "/gear", permanent: true },
      { source: "/hub/rules", destination: "/gear", permanent: true },
      { source: "/hub/lifestyle", destination: "/gear", permanent: true },
    ];
  },
};
export default nextConfig;
