"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Vamos.net v3 Mobile Tabbar — bottom navigation, 3 items (Favourites dropped for v1).
 *
 * Spec (from Figma /v1/files/nodes → Tabbar 390×72):
 *  - Container: h-72, white bg.
 *  - Items frame: padding 16t / 40r / 12b / 40l, horizontal gap 60.
 *  - Each item: 60×44, vertical stack, gap 4 (icon 24×24, label Inter/500/12/16).
 *
 * For v1 we have 3 items, so we evenly distribute across the bar instead of
 * locking to the original 4-item gap of 60px.
 *
 * Active state: brand orange icon + label. Inactive: ink (#181D27).
 *
 * Visibility: shown only below md breakpoint. Fixed to the bottom of the
 * viewport so the rest of the page can scroll under it.
 */

type TabItem = {
  href: string;
  label: string;
  matchPrefix?: string;
  /** Additional path prefixes that should also activate this tab. */
  extraPrefixes?: string[];
  icon: (props: { active: boolean }) => React.ReactElement;
};

function FlameIcon({ active }: { active: boolean }) {
  // Filled flame when active, stroke flame when inactive.
  if (active) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2.5c.4 2.6 2.2 4 3.6 5.5 1.6 1.7 2.9 3.6 2.9 6.2A6.5 6.5 0 1 1 5.5 14c0-2 1.2-3.4 2.2-4.4.9-.9 1.5-1.7 1.5-3 1.4.8 2.1 2.2 2.2 3.8C12.6 8.4 12 6 12 2.5Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5c.4 2.6 2.2 4 3.6 5.5 1.6 1.7 2.9 3.6 2.9 6.2A6.5 6.5 0 1 1 5.5 14c0-2 1.2-3.4 2.2-4.4.9-.9 1.5-1.7 1.5-3 1.4.8 2.1 2.2 2.2 3.8C12.6 8.4 12 6 12 2.5Z" />
    </svg>
  );
}

function BallIcon({ active }: { active: boolean }) {
  // Padel/tennis ball: circle + curved seam line.
  const fill = active ? "currentColor" : "none";
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5C7 10 10 12.5 10.5 16.5" stroke={active ? "var(--color-bg-white)" : "currentColor"} fill="none" />
      <path d="M20.5 9.5C17 10 14 12.5 13.5 16.5" stroke={active ? "var(--color-bg-white)" : "currentColor"} fill="none" />
    </svg>
  );
}

function ZapIcon({ active }: { active: boolean }) {
  // Classic lightning bolt.
  if (active) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

const TABS: TabItem[] = [
  { href: "/", label: "Spotlight", matchPrefix: "/", icon: FlameIcon },
  { href: "/hub", label: "Hub", matchPrefix: "/hub", icon: BallIcon },
  // Match detail pages live under /matches/[id] — include that prefix so
  // the Scores tab stays active when the user drills into a match.
  { href: "/scores", label: "Scores", matchPrefix: "/scores", extraPrefixes: ["/matches"], icon: ZapIcon },
];

function isActive(pathname: string, item: TabItem) {
  if (item.matchPrefix === "/") return pathname === "/";
  const prefixes = [item.href, ...(item.extraPrefixes ?? [])];
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export default function Tabbar() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-white"
      style={{
        height: 72,
        paddingTop: 16,
        paddingBottom: 12,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <div className="flex items-start justify-between h-full">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-start gap-4 select-none",
                active ? "text-brand" : "text-text-primary",
              ].join(" ")}
              style={{ minWidth: 60 }}
            >
              <span className="inline-flex items-center justify-center" style={{ width: 24, height: 24 }}>
                <Icon active={active} />
              </span>
              <span
                className="font-sans text-12"
                style={{ fontWeight: 500, lineHeight: "16px" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
