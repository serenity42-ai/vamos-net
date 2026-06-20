import type { Metadata, Viewport } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  // metadataBase resolves any relative OG/Twitter image URLs at build.
  // Without it, Next 14 falls back to http://localhost:3000 and shipped
  // previews point at localhost (broken on every social platform).
  metadataBase: new URL("https://vamos.net"),
  title: "VAMOS — Everything Happens at the Net",
  description: "Live padel scores, rankings, player profiles, tournament draws, and news. The definitive platform for professional padel.",
  // meta-keywords is an obsolete signal that no major search engine reads.
  // Removed per restructure spec §8.1.

  // PWA: link the web manifest so the browser offers "Add to Home Screen"
  // and treats the site as an installable app.
  manifest: "/manifest.webmanifest",
  // iOS standalone behaviour (no Safari chrome once installed) + status-bar
  // styling + home-screen title. Android reads this from the manifest, but
  // iOS still needs these apple-specific hints.
  appleWebApp: {
    capable: true,
    title: "VAMOS",
    statusBarStyle: "black-translucent",
  },

  openGraph: {
    title: "VAMOS — Everything Happens at the Net",
    description: "Live padel scores, rankings, player profiles, tournament draws, and news.",
    url: "https://vamos.net",
    siteName: "VAMOS",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "VAMOS — Everything Happens at the Net",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VAMOS — Everything Happens at the Net",
    description: "Live padel scores, rankings, player profiles, tournament draws, and news.",
    images: ["/og-default.png"],
  },
  // Brand favicon — the new "Woven .net" lockup ships as an SVG icon.
  // See docs/brand/VAMOS_NET_LOGO_HANDOFF.md for sizing rules. The 32×32
  // fallback drops the mesh and shows just the V + red dot, which is the
  // approved small-size variant.
  icons: {
    icon: [
      { url: "/brand/vamos-net-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    // Apple touch icon must be a non-transparent PNG; the SVG mark won't
    // render on the iOS home screen. This is the brand mark on the dark field.
    apple: "/icons/apple-touch-icon.png",
  },
};

// Viewport-level metadata. themeColor paints the Android status bar / PWA
// title bar in brand dark; the viewport-fit handles iOS notch insets so the
// standalone PWA can draw edge-to-edge.
export const viewport: Viewport = {
  themeColor: "#181D27",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Static JSON-LD block — declared at module scope so the layout stays a
// pure server component with no per-request work. Reading headers() or
// cookies() in here would force every page into the dynamic-render path
// and disable ISR across the entire app.
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VAMOS",
  alternateName: "Vamos.net",
  url: "https://vamos.net",
  description:
    "Live padel scores, rankings, player profiles, tournament draws, and news. The definitive platform for professional padel.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://vamos.net/players?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Organization schema — declares the brand identity + verified social
// profiles (sameAs). Helps search engines connect vamos.net to the LinkedIn
// and Instagram presence, which strengthens the "are these people legit"
// credibility signal that matters for our B2B / industry audience.
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VAMOS",
  alternateName: "Vamos.net",
  url: "https://vamos.net",
  logo: "https://vamos.net/brand/vamos-net-mark.svg",
  sameAs: [
    "https://www.linkedin.com/company/vamos-net/",
    "https://www.instagram.com/vamos_net",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
