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
  const maskId = `vn-mask-${variant}`;

  const aspect = VIEW_W / VIEW_H;

  // Shared text styling — Archivo Black italic, lowercase, tight tracking.
  // letterSpacing as a unitless value at this fontSize ≈ -9px (matches the
  // -0.045em spec from the brand handoff at 200px).
  const textStyle: React.CSSProperties = {
    fontFamily: "var(--sans)",
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: FONT_PX,
    letterSpacing: "-9px",
    textTransform: "lowercase",
    // dominantBaseline is set via attribute on the element for SVG support.
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

        {/* Mask: paints only the `net` glyphs in white so we can punch the
            mesh through that portion of the wordmark. The dot stays black
            in the mask so the red `.` from Layer 1 remains untouched by
            the mesh pattern. The wordmark order is recreated exactly so
            the `net` glyphs sit at the same x positions as Layer 1. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
          <text
            x={START_X}
            y={BASELINE_Y}
            style={textStyle}
          >
            <tspan fill="black">vamos.</tspan>
            <tspan fill="white">net</tspan>
          </text>
        </mask>
      </defs>

      <g transform="skewX(-6)">
        {/* Layer 1 — full wordmark, drawn left-to-right by the browser so we
            don't have to know glyph widths. `vamos` in fg, the dot in red,
            `net` in 18% ghost underlay (so the silhouette stays legible
            when mesh stripes drop below sub-pixel at very small sizes). */}
        <text
          x={START_X}
          y={BASELINE_Y}
          style={textStyle}
        >
          <tspan fill={fg}>vamos</tspan>
          <tspan fill={dot}>.</tspan>
          <tspan fill={fg} opacity={0.18}>net</tspan>
        </text>

        {/* Layer 2 — the mesh pattern, masked to just the `.net` glyphs so
            it reads as netting woven through those letterforms only. A
            single rectangle is enough; the mask isolates the portion. */}
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill={`url(#${patternId})`}
          mask={`url(#${maskId})`}
        />
      </g>
    </svg>
  );
}
