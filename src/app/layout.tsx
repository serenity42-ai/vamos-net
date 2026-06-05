import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase resolves any relative OG/Twitter image URLs at build.
  // Without it, Next 14 falls back to http://localhost:3000 and shipped
  // previews point at localhost (broken on every social platform).
  metadataBase: new URL("https://vamos.net"),
  title: "VAMOS — Everything Happens at the Net",
  description: "Live padel scores, rankings, player profiles, tournament draws, and news. The definitive platform for professional padel.",
  keywords: ["padel", "padel live scores", "padel rankings", "padel news", "vamos padel", "premier padel", "padel players", "padel tournaments"],
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
    apple: "/brand/vamos-net-mark.svg",
  },
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
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
