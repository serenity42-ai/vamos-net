/**
 * VAMOS.NET — primary lockup ("Woven .net" direction, v1.0).
 *
 * The wordmark is rendered as an inline SVG so the Archivo Black italic font
 * loaded by the app's <head> applies. Shipping the SVG file as an <img> would
 * fall back to the system serif and lose the typeface entirely.
 *
 * Concept: `vamos` is solid italic, the dot is brand-red, `.net` is filled
 * with a horizontal stripe pattern that reads as padel-court netting. A
 * faint underlay of the same word preserves silhouette legibility when
 * individual stripes drop below sub-pixel at small sizes.
 *
 * Construction rules — see docs/brand/VAMOS_NET_LOGO_HANDOFF.md:
 *  - Wordmark is skewed -6° beyond the type's intrinsic italic angle.
 *  - Tile is 14px; bar is 8px (57%); gap is 6px (transparent).
 *  - Stripe colour = current foreground (ink on paper / paper on ink).
 *  - The red dot is fixed — never recolour (except on red itself, where
 *    it drops to ink — handled by passing variant="reverse-on-red").
 *  - Never apply the mesh to `vamos`. Only to `.net`.
 */

export type VamosNetLogoVariant = "ink" | "light" | "on-red";

interface Props {
  /**
   * - "ink"      → dark wordmark on paper / light backgrounds (default).
   * - "light"    → light wordmark on ink / photo / dark backgrounds.
   * - "on-red"   → reversed on the brand red marquee. Dot drops to ink.
   */
  variant?: VamosNetLogoVariant;
  /** Rendered height in px. SVG viewBox is fixed; this controls the size. */
  height?: number;
  /** Optional aria-label override. Defaults to "vamos.net". */
  ariaLabel?: string;
  /** Optional extra className for layout positioning. */
  className?: string;
}

export default function VamosNetLogo({
  variant = "ink",
  height = 40,
  ariaLabel = "vamos.net",
  className,
}: Props) {
  // Foreground colour for the wordmark (and the mesh stripes — they inherit).
  const fg =
    variant === "ink" ? "var(--ink)" : "var(--paper)"; // light + on-red share paper fg

  // Dot colour. On the red marquee the dot collapses to ink so it doesn't
  // disappear into the background.
  const dot = variant === "on-red" ? "var(--ink)" : "var(--red)";

  // Unique pattern id per variant so multiple instances on the same page
  // (header + footer + meta) don't collide and overwrite each other's defs.
  const patternId = `vn-mesh-${variant}`;

  // Aspect ratio of the SVG (880×220 from the brand handoff) → width derived
  // from requested height. Lock the height to the request, let width scale.
  const aspect = 880 / 220;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox="0 0 880 220"
      width={Math.round(height * aspect)}
      height={height}
      className={className}
      style={{ display: "inline-block", overflow: "visible" }}
    >
      <defs>
        {/* 14×14 tile, 8px solid bar, 6px gap — calibrated for the 200px
            canvas in the brand handoff. The bar uses the same fg colour as
            the wordmark so the mesh reads as cut-out net, not as decoration. */}
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="14"
          height="14"
        >
          <rect x="0" y="0" width="14" height="8" fill={fg} />
        </pattern>
      </defs>
      <g transform="skewX(-6)">
        {/* `vamos` — solid italic in the foreground colour */}
        <text
          x="30"
          y="170"
          fill={fg}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 200,
            letterSpacing: "-9px",
            textTransform: "lowercase",
          }}
        >
          vamos
        </text>
        {/* The dot — brand-red (or ink on red). Never recolour. */}
        <text
          x="540"
          y="170"
          fill={dot}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 200,
            letterSpacing: "-9px",
            textTransform: "lowercase",
          }}
        >
          .
        </text>
        {/* `.net` ghost underlay — 18% opacity copy of the word so the
            silhouette stays legible at small sizes when stripes drop
            below sub-pixel. */}
        <text
          x="580"
          y="170"
          fill={fg}
          opacity="0.18"
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 200,
            letterSpacing: "-9px",
            textTransform: "lowercase",
          }}
        >
          net
        </text>
        {/* `.net` mesh fill — same word, filled with the stripe pattern */}
        <text
          x="580"
          y="170"
          fill={`url(#${patternId})`}
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: 200,
            letterSpacing: "-9px",
            textTransform: "lowercase",
          }}
        >
          net
        </text>
      </g>
    </svg>
  );
}
