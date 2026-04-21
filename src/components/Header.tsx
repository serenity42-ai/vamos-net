"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/scores",      label: "Live Scores" },
  { href: "/rankings",    label: "Rankings" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/players",     label: "Players" },
  { href: "/news",        label: "News" },
  { href: "/business",    label: "Business" },
];

/**
 * Editorial wordmark: "Vamos" in Archivo Black 900 italic with red "!"
 * Set in-component rather than as an SVG so we can keep it pixel-perfect
 * with the brand's -6deg skew + tight tracking rules.
 */
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50" style={{ background: "var(--paper)", borderBottom: "1px solid var(--ink)" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Wordmark + eyebrow */}
          <Link href="/" className="flex items-center gap-4 flex-shrink-0" aria-label="Vamos.net home">
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
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap transition-colors"
                  style={{
                    padding: "8px 12px",
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    color: isActive ? "var(--red)" : "var(--ink)",
                    borderBottom: isActive
                      ? "2px solid var(--red)"
                      : "2px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            style={{ color: "var(--ink)" }}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="md:hidden" style={{ background: "var(--paper)", borderTop: "1px solid var(--ink)" }}>
          <nav className="px-4 py-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block transition-colors"
                  style={{
                    padding: "14px 4px",
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    color: isActive ? "var(--red)" : "var(--ink)",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
