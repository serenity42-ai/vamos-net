"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Site navigation. Four top-level entries; three are dropdowns.
 *
 * - Live Scores      → /scores (no children)
 * - Pro Padel        → tournaments / schedule / players / rankings
 * - Player's Hub     → rules & game / reviews / padel business / lifestyle / training
 * - News             → category filters on /news
 *
 * Active-state rule: a top-level entry shows the red underline when the current
 * route matches its href OR any of its children's hrefs (or query category).
 */

type NavLink = { kind: "link"; href: string; label: string };
type NavDropdown = {
  kind: "dropdown";
  label: string;
  items: { href: string; label: string }[];
};
type NavEntry = NavLink | NavDropdown;

const NAV: NavEntry[] = [
  { kind: "link", href: "/scores", label: "Live Scores" },
  {
    kind: "dropdown",
    label: "Pro Padel",
    items: [
      { href: "/tournaments", label: "Tournaments" },
      { href: "/calendar", label: "Schedule" },
      { href: "/players", label: "Players" },
      { href: "/rankings", label: "Rankings" },
    ],
  },
  {
    kind: "dropdown",
    label: "Player's Hub",
    items: [
      { href: "/hub/rules", label: "Rules & Game" },
      { href: "/hub/reviews", label: "Reviews" },
      { href: "/hub/business", label: "Padel Business" },
      { href: "/hub/lifestyle", label: "Lifestyle" },
      { href: "/hub/training", label: "Training" },
    ],
  },
  {
    kind: "dropdown",
    label: "News",
    items: [
      { href: "/news", label: "All News" },
      { href: "/news?category=Tour+News", label: "Tour News" },
      { href: "/news?category=Rankings", label: "Rankings" },
      { href: "/news?category=Academy", label: "Academy" },
    ],
  },
];

/* ---------- Wordmark ---------- */

function Wordmark({ size = 36 }: { size?: number }) {
  return (
    <div
      aria-label="VAMOS.NET"
      style={{ display: "inline-flex", alignItems: "baseline", transform: "skewX(-6deg)" }}
    >
      <span
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          color: "var(--ink)",
        }}
      >
        Vamos
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          color: "var(--red)",
          marginLeft: -2,
        }}
      >
        !
      </span>
    </div>
  );
}

/* ---------- Active-state helpers ---------- */

function pathMatches(pathname: string, href: string): boolean {
  // Strip query for path comparison
  const targetPath = href.split("?")[0];
  if (pathname === targetPath) return true;
  if (targetPath !== "/" && pathname.startsWith(targetPath + "/")) return true;
  return false;
}

function entryActive(pathname: string, entry: NavEntry): boolean {
  if (entry.kind === "link") return pathMatches(pathname, entry.href);
  return entry.items.some((it) => pathMatches(pathname, it.href));
}

/* ---------- Desktop dropdown ---------- */

function DesktopDropdown({
  entry,
  active,
}: {
  entry: NavDropdown;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click (for click-to-open accessibility)
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="whitespace-nowrap transition-colors flex items-center gap-1.5"
        style={{
          padding: "8px 12px",
          fontFamily: "var(--sans)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: active ? "var(--red)" : "var(--ink)",
          borderBottom: active
            ? "2px solid var(--red)"
            : "2px solid transparent",
          background: "transparent",
        }}
      >
        {entry.label}
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          aria-hidden
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path d="M1 3l3.5 3L8 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--red)",
            borderTop: "none",
            minWidth: 220,
            zIndex: 60,
          }}
        >
          {entry.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block transition-colors"
              style={{
                padding: "10px 16px",
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink)",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "var(--paper-2)";
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--red)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Mobile accordion section ---------- */

function MobileSection({
  entry,
  pathname,
  onClose,
}: {
  entry: NavEntry;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = entryActive(pathname, entry);

  if (entry.kind === "link") {
    return (
      <Link
        href={entry.href}
        onClick={onClose}
        className="block transition-colors"
        style={{
          padding: "14px 4px",
          fontFamily: "var(--sans)",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: active ? "var(--red)" : "var(--ink)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {entry.label}
      </Link>
    );
  }

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center justify-between w-full"
        style={{
          padding: "14px 4px",
          fontFamily: "var(--sans)",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: active ? "var(--red)" : "var(--ink)",
          background: "transparent",
        }}
      >
        {entry.label}
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          aria-hidden
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path d="M1.5 3.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: 8 }}>
          {entry.items.map((item) => {
            const itemActive = pathMatches(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="block transition-colors"
                style={{
                  padding: "10px 16px",
                  marginLeft: 4,
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: itemActive ? "var(--red)" : "var(--ink-soft)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Header ---------- */

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--ink)" }}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Wordmark + eyebrow */}
          <Link
            href="/"
            className="flex items-center gap-4 flex-shrink-0"
            aria-label="Vamos.net home"
          >
            <Wordmark size={34} />
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--mute)",
                paddingLeft: 16,
                borderLeft: "1px solid var(--ink)",
              }}
            >
              The padel feed
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV.map((entry, i) => {
              const active = entryActive(pathname, entry);
              if (entry.kind === "link") {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="whitespace-nowrap transition-colors"
                    style={{
                      padding: "8px 12px",
                      fontFamily: "var(--sans)",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.01em",
                      color: active ? "var(--red)" : "var(--ink)",
                      borderBottom: active
                        ? "2px solid var(--red)"
                        : "2px solid transparent",
                    }}
                  >
                    {entry.label}
                  </Link>
                );
              }
              return (
                <DesktopDropdown
                  key={entry.label}
                  entry={entry}
                  active={active}
                />
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--ink)" }}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{ background: "var(--paper)", borderTop: "1px solid var(--ink)" }}
        >
          <nav className="px-4 py-2">
            {NAV.map((entry, i) => (
              <MobileSection
                key={entry.kind === "link" ? entry.href : entry.label}
                entry={entry}
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
