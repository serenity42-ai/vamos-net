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

  // Permanent redirects: /business has SEO history; preserve it via 301 to
  // the new /hub/business location (Player's Hub section, Apr 27 nav restructure).
  async redirects() {
    return [
      { source: "/business", destination: "/hub/business", permanent: true },
    ];
  },
};
export default nextConfig;
