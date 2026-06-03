"use client";

/**
 * ButtonLive (v3) — 56×56 circular LIVE indicator.
 *
 * Figma: ButtonLive component set (id=917:35787).
 *  - Default: bg-brand-light (#FFE6DB), 2px brand border, orange LIVE icon
 *  - Active:  bg-brand (orange), 2px brand border, white LIVE icon
 *
 * Use as a hotspot to indicate "this match has live coverage / is live now".
 * It's both a visual badge and an actionable button — pass onClick for a tap target.
 */

import { forwardRef, type ButtonHTMLAttributes } from "react";

type LiveState = "default" | "active";

interface ButtonLiveProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  state?: LiveState;
  /** Accessible label, defaults to "Live". */
  label?: string;
}

function LiveIcon({ tone }: { tone: "brand" | "contrast" }) {
  // Stylised "LIVE" wordmark glyph; using currentColor lets variants flip color.
  const color = tone === "brand" ? "var(--color-brand-primary)" : "var(--color-text-contrast)";
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      style={{ color }}
    >
      <g fill="currentColor">
        {/* L */}
        <path d="M5 12h2v6h3v2H5z" />
        {/* I */}
        <path d="M11.5 12h2v8h-2z" />
        {/* V */}
        <path d="M15 12h2.1l1.4 4.6L20 12h2.1l-2.6 8h-2z" />
        {/* E */}
        <path d="M23 12h5v2h-3v1.2h2.6v1.8H25V18h3v2h-5z" />
      </g>
    </svg>
  );
}

const ButtonLive = forwardRef<HTMLButtonElement, ButtonLiveProps>(
  function ButtonLive(
    { state = "default", label = "Live", className = "", ...rest },
    ref,
  ) {
    const isActive = state === "active";
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={[
          "inline-flex items-center justify-center rounded-full select-none",
          "transition-colors duration-150",
          "border-2 border-brand",
          isActive
            ? "bg-brand hover:bg-brand-dark"
            : "bg-brand-light hover:bg-brand hover:[&_svg]:!text-text-contrast",
          className,
        ].join(" ")}
        style={{ width: 56, height: 56 }}
        {...rest}
      >
        <LiveIcon tone={isActive ? "contrast" : "brand"} />
      </button>
    );
  },
);

export default ButtonLive;
