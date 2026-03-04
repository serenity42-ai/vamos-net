import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchModalProvider from "@/components/MatchModalProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAMOS — Everything Happens at the Net",
  description: "Live padel scores, rankings, player profiles, tournament draws, and news. The definitive platform for professional padel.",
  keywords: ["padel", "padel live scores", "padel rankings", "padel news", "vamos padel", "premier padel", "padel players", "padel tournaments"],
  openGraph: {
    title: "VAMOS — Everything Happens at the Net",
    description: "Live padel scores, rankings, player profiles, tournament draws, and news.",
    url: "https://vamos.net",
    siteName: "VAMOS",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const isComingSoon = headersList.get("x-coming-soon") === "1";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VAMOS",
    alternateName: "Vamos.net",
    url: "https://vamos.net",
    description: "Live padel scores, rankings, player profiles, tournament draws, and news. The definitive platform for professional padel.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vamos.net/players?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-white text-[#0F1F2E] min-h-screen flex flex-col overflow-x-hidden">
        <MatchModalProvider>
          {!isComingSoon && <Header />}
          <div className="flex-1">{children}</div>
          {!isComingSoon && <Footer />}
        </MatchModalProvider>
      </body>
    </html>
  );
}
