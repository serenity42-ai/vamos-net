/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/fantasypadeltour/**",
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
      { source: "/scores/:path*", headers: shortCache },
      { source: "/tournaments/:id", headers: shortCache },
    ];
  },
};
export default nextConfig;
