import Header from "@/components/v3/Header";
import Footer from "@/components/v3/Footer";
import Tabbar from "@/components/v3/Tabbar";
import MatchModalProvider from "@/components/MatchModalProvider";

/**
 * Layout for the public-facing site. Wraps every user-facing route under
 * `app/(site)/*` with the v3 Header (desktop), Footer, and mobile bottom Tabbar.
 *
 * The soft-launch gate (/coming-soon) lives outside this group so it can
 * render standalone without the chrome — and, importantly, so the root
 * layout doesn't need to read request headers to make that decision.
 * Reading headers() in the root layout would force every page into the
 * dynamic-render path and disable ISR across the whole app.
 *
 * The MatchModalProvider is kept around for legacy components that still
 * rely on the openMatch() context. v3 components don't use it — they wire
 * their own onSelect/onClose handlers — so this can be removed once all
 * legacy components are gone.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MatchModalProvider>
      <Header />
      <div className="flex-1 pb-[72px] md:pb-0">{children}</div>
      <Footer />
      {/* Mobile bottom tab bar (hidden on md+) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Tabbar />
      </div>
    </MatchModalProvider>
  );
}
