"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import VamosNetLogo from "@/components/VamosNetLogo";

/**
 * Vamos.net v3 Desktop Header.
 *
 * Spec (from Figma /v1/files/nodes → HeaderDesktop 1440×80):
 *  - Container: h-80, padding 12px vertical / 60px horizontal.
 *  - Left cluster: Logo + vertical divider + nav menu (gap 40px).
 *  - Right: search input pill (white, h-56, rounded-full, leading search icon).
 *
 * Nav items (v1 — Favourites dropped):
 *   Spotlight (/), Padel Hub (/hub), Scores (/scores)
 *
 * Active state: orange (#FE4C00) text, no underline. Inactive: ink (#181D27).
 *
 * Mobile: this component hides on <md (Tabbar takes over at the bottom).
 */

type NavItem = { href: string; label: string; matchPrefix?: string };

const NAV: NavItem[] = [
  { href: "/", label: "Spotlight", matchPrefix: "/" },
  { href: "/hub", label: "Padel Hub", matchPrefix: "/hub" },
  { href: "/scores", label: "Scores", matchPrefix: "/scores" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefix === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

function SearchIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header
      className="hidden md:flex w-full items-center justify-between bg-bg-page"
      style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 60, paddingRight: 60, height: 80 }}
    >
      {/* Left cluster: logo + divider + menu */}
      <div className="flex items-center gap-40">
        <Link href="/" aria-label="Vamos.net home" className="flex items-center">
          <VamosNetLogo variant="ink" height={31} />
        </Link>

        <span
          aria-hidden="true"
          className="block"
          style={{
            width: 1,
            height: 31,
            background: "var(--color-border-primary)",
          }}
        />

        <nav aria-label="Primary" className="flex items-center gap-40">
          {NAV.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "font-display font-semibold text-16 leading-22 transition-colors",
                  active ? "text-brand" : "text-text-primary hover:text-brand",
                ].join(" ")}
                style={{ lineHeight: "22px" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: search pill */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center bg-bg-white rounded-full"
        style={{
          width: 338,
          height: 56,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          gap: 8,
        }}
      >
        <span className="inline-flex items-center justify-center text-text-tertiary" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          type="search"
          aria-label="Search Vamos.net"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-16 text-text-primary placeholder:text-text-tertiary"
        />
      </form>
    </header>
  );
}
