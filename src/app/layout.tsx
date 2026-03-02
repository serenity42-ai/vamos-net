import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAMOS — The World of Padel",
  description: "Live scores, rankings, news, and everything padel. Your padel. Elevated.",
  keywords: ["padel", "padel live scores", "padel rankings", "padel news", "vamos padel"],
  openGraph: {
    title: "VAMOS — The World of Padel",
    description: "Live scores, rankings, news, and everything padel.",
    url: "https://vamos.net",
    siteName: "VAMOS",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Check if this is the coming-soon page via a custom header set by middleware
  const headersList = headers();
  const isComingSoon = headersList.get("x-coming-soon") === "1";

  return (
    <html lang="en">
      <body className="bg-white text-[#0F1F2E] min-h-screen flex flex-col overflow-x-hidden">
        {!isComingSoon && <Header />}
        <div className="flex-1">{children}</div>
        {!isComingSoon && <Footer />}
      </body>
    </html>
  );
}
