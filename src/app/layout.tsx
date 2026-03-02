import type { Metadata } from "next";
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
  return (
    <html lang="en">
      <body className="bg-[#0F1923] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
