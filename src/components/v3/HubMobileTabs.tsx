import Link from "next/link";

/**
 * HubMobileTabs — the Hub top-tab strip rendered on mobile only.
 *
 * Shown above Hub content pages and on /tournaments (where "Tour Calendar" is
 * marked active) so mobile users can navigate between Hub sections without
 * returning to the bottom tab first.
 *
 * Desktop: hidden (md:hidden). Desktop has the full header nav.
 *
 * activeSlug values:
 *   null        → "All" is active (Hub home with no filter)
 *   "news"      → News tab active
 *   "reviews"   → Reviews tab active
 *   "guides"    → Guides tab active
 *   "tour-calendar" → Tour Calendar tab active (user is on /tournaments)
 */

type HubTab = {
  label: string;
  slug: string | null;
  href: string;
};

const HUB_TABS: HubTab[] = [
  { label: "All", slug: null, href: "/hub" },
  { label: "News", slug: "news", href: "/hub?type=news" },
  { label: "Reviews", slug: "reviews", href: "/hub?type=reviews" },
  { label: "Guides", slug: "guides", href: "/hub?type=guides" },
  { label: "Tour Calendar", slug: "tour-calendar", href: "/tournaments" },
];

interface Props {
  activeSlug: string | null; // null = "All"
}

export default function HubMobileTabs({ activeSlug }: Props) {
  return (
    <nav
      aria-label="Hub sections"
      className={[
        "md:hidden flex items-center gap-24 overflow-x-auto",
        "border-b border-border-primary px-12 pt-12",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      ].join(" ")}
      role="tablist"
    >
      {HUB_TABS.map((tab) => {
        const active = tab.slug === activeSlug;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active ? "true" : "false"}
            className={[
              "relative inline-flex shrink-0 items-center pb-8 pt-0",
              "font-sans text-16 leading-[24px] transition-colors",
              active
                ? "font-semibold text-brand"
                : "font-normal text-text-secondary hover:text-text-primary",
            ].join(" ")}
          >
            {tab.label}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-brand"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
