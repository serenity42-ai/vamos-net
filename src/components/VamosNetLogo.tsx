/**
 * VAMOS.NET — primary lockup ("Woven .net" direction, v1.0).
 *
 * Renders the wordmark as inline SVG so the Archivo Black italic font loaded
 * by the app's <head> applies. Shipping the original SVG file as an <img>
 * would fall back to the system serif and lose the typeface.
 *
 * Concept: `vamos` is solid italic, the dot is brand-red, `.net` is filled
 * with a horizontal stripe pattern that reads as padel-court netting. A
 * faint ghost underlay of `.net` preserves silhouette legibility when
 * individual stripes drop below sub-pixel at small sizes.
 *
 * Layout note: rather than hardcoding x positions per glyph (which only work
 * with the exact font metrics the SVG was built against), the wordmark and
 * its ghost copy use a single <text> element with <tspan> siblings so the
 * browser flows them based on actual glyph widths. The mesh-filled `.net`
 * sits in a sibling group offset by the measured width of `vamos.` via
 * `textLength`+`lengthAdjust`… but in practice the simplest robust solution
 * is to draw the whole lockup once with the dot + mesh applied per-tspan.
 *
 * Construction rules — see docs/brand/VAMOS_NET_LOGO_HANDOFF.md:
 *  - Wordmark is skewed -6° beyond the type's intrinsic italic angle.
 *  - Mesh tile is 14px; bar is 8px (57%); gap is 6px (transparent).
 *  - Stripe colour = current foreground (ink on paper / paper on ink).
 *  - The red dot is fixed — never recolour. Exception: on the brand red
 *    marquee the dot drops to ink (variant="on-red").
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
  /** Rendered height in px. Width is derived from aspect ratio. */
  height?: number;
  /** Optional aria-label override. Defaults to "vamos.net". */
  ariaLabel?: string;
  /** Optional extra className for layout positioning. */
  className?: string;
}

// SVG viewBox dimensions. Width is generous to give the wordmark room
// regardless of how Archivo's actual glyph widths shake out — the viewBox
// is sized to the type at fontSize=200, and we let overflow be visible.
const VIEW_W = 880;
const VIEW_H = 220;
const FONT_PX = 200;
const BASELINE_Y = 170;
const START_X = 30;

// Variant-specific colours. The mesh stripes inherit the wordmark fg so the
// net reads as a cut-out from the same colour as `vamos`, not as decoration.
function paletteFor(variant: VamosNetLogoVariant) {
  // `fg` is the wordmark + mesh-stripe colour.
  // `dot` is the brand red, except on the red marquee where it drops to ink.
  if (variant === "ink") {
    return { fg: "var(--ink)", dot: "var(--red)" };
  }
  if (variant === "light") {
    return { fg: "var(--paper)", dot: "var(--red)" };
  }
  // on-red
  return { fg: "var(--paper)", dot: "var(--ink)" };
}

export default function VamosNetLogo({
  variant = "ink",
  height = 40,
  ariaLabel = "vamos.net",
  className,
}: Props) {
  const { fg, dot } = paletteFor(variant);
  // Pattern ids must be unique per instance so multiple logos on the same
  // page (e.g. header + footer) don't collide on the same <defs> id.
  const patternId = `vn-mesh-${variant}`;

  const aspect = VIEW_W / VIEW_H;

  // Shared text styling — Archivo Black italic, lowercase, tight tracking.
  // letterSpacing -9px at fontSize=200 matches the -0.045em spec from the
  // brand handoff.
  const textStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: FONT_PX,
    letterSpacing: "-9px",
    textTransform: "lowercase",
  };

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={Math.round(height * aspect)}
      height={height}
      className={className}
      style={{ display: "inline-block", overflow: "visible" }}
    >
      <defs>
        {/* 14×14 tile, 8px solid bar, 6px transparent gap. Calibrated for
            the type at fontSize=200 — finer turns to noise, heavier loses
            the mesh read. */}
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
        {/* Ghost underlay — 18% opacity full wordmark, kept behind the live
            wordmark so `net`'s silhouette stays legible when individual
            mesh stripes drop below sub-pixel at small sizes. */}
        <text x={START_X} y={BASELINE_Y} style={textStyle} fill={fg} opacity={0.18}>
          vamos.net
        </text>

        {/* Live wordmark — one continuous <text> so the browser flows the
            tspans by actual glyph widths. The mesh-fill is applied directly
            to the `net` tspan via fill="url(#pattern)", so there is no mask
            and therefore no alignment drift between layers. */}
        <text x={START_X} y={BASELINE_Y} style={textStyle}>
          <tspan fill={fg}>vamos</tspan>
          <tspan fill={dot}>.</tspan>
          <tspan fill={`url(#${patternId})`}>net</tspan>
        </text>
      </g>
    </svg>
  );
}
