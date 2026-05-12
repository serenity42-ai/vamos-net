import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MatchModalProvider from "@/components/MatchModalProvider";

/**
 * Layout for the public-facing site. Wraps every user-facing route under
 * `app/(site)/*` with the Header, Footer, and modal provider.
 *
 * The soft-launch gate (/coming-soon) lives outside this group so it can
 * render standalone without the chrome — and, importantly, so the root
 * layout doesn't need to read request headers to make that decision.
 * Reading headers() in the root layout would force every page into the
 * dynamic-render path and disable ISR across the whole app.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MatchModalProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </MatchModalProvider>
  );
}
