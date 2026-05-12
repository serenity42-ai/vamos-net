# VAMOS.NET — Woven Logo Handoff

**Concept:** Woven `.net` — the `.net` half of the wordmark is filled with a horizontal stripe pattern that reads as padel-court netting. `vamos` stays solid italic.

---

## Files

| File | Use |
|---|---|
| `vamos-net-logo.svg` | Primary lockup, dark text on paper/light bg |
| `vamos-net-logo-light.svg` | Reversed lockup, light text on ink/red/photo bg |
| `vamos-net-mark.svg` | Square mark (just the `.net` mesh tag) for avatars, stamps, app icons |
| `vamos-net-favicon.svg` | 32px favicon — falls back to V + red dot (mesh doesn't survive at that size) |

All four are in `/brand`. Open in Illustrator or Figma — **convert all `<text>` to outlines before sending to print** (the SVGs embed Archivo via Google Fonts; that link won't travel with the file).

---

## Construction Specs

### Typeface
- **Family:** Archivo (Google Fonts)
- **Weight:** 900 (Black)
- **Style:** Italic
- **Case:** lowercase
- **Tracking:** `letter-spacing: -0.045em` (≈ −9px at 200px)

### Wordmark Skew
- The entire wordmark group is skewed **−6°** beyond the type's intrinsic italic angle. This is what gives the lockup its forward thrust. Apply via `transform="skewX(-6)"` on the parent group, not on individual letters.

### The Mesh Fill (the move)
- Pattern tile: **14 px square**
- Solid bar: **8 px** tall (≈ 57% of tile)
- Gap: **6 px** transparent
- Direction: horizontal (`0°`)
- Stripe color = whichever foreground color the lockup is using (ink on paper; paper on ink; white on red)
- Applied via SVG `<pattern>` fill to the `<text>net</text>` element
- **Ghost underlay:** behind the mesh `net`, an 18% opacity copy of the same word — preserves silhouette legibility at small sizes when individual stripes drop below sub-pixel

### Color
- `--ink` `#151210` — wordmark on paper
- `--paper` `#F3EEE4` — wordmark on ink/red/photo
- `--red` `#C1443A` — **the dot only**. Never recolor the dot. (Exception: on red itself, the dot drops to ink.)

---

## Sizing & Clear Space

| Context | Min size |
|---|---|
| Full lockup | **120 px wide** at minimum |
| Mark only (`.net` tile) | **32 × 32 px** |
| Favicon (V + dot fallback) | **16 × 16 px** |

**Clear space:** keep at least the height of the lowercase `v` clear on all sides. Never crop into this margin.

---

## Don'ts

- ❌ Don't change the dot color. Red is fixed.
- ❌ Don't apply the mesh to `vamos` — only `.net`.
- ❌ Don't outline, stretch, rotate, or add effects (shadows, glows, bevels).
- ❌ Don't set the wordmark upright. The italic + −6° skew is mandatory.
- ❌ Don't change the stripe ratio. 8 / 6 is calibrated for the type weight; finer stripes turn to noise, heavier stripes lose the mesh read.
- ❌ Don't use the mesh pattern for any other graphic. It belongs to the mark.

---

## In-Code Reference

A live React reference of all 8 explorations sits at `VAMOS Logo - Net.html`. The winning concept lives in `brand/LogoNet.jsx` as the `VNet1` component — use it as a sanity check when reproducing the lockup at new sizes; the stripe period scales as `size * 0.07` (gap) and `size * 0.026` (weight). The SVG files lock in the 200px-canvas values; for runtime React use, the component is the source of truth.

---

## Designer Checklist

- [ ] Open each SVG in Illustrator. Verify `vamos` and `net` read correctly.
- [ ] Convert all `<text>` to outlined paths. Save as `*-outlined.svg`.
- [ ] Export PNG @1x / @2x / @3x for the primary + light variants (1200, 2400, 3600 wide).
- [ ] Produce a horizontal-only and stacked layout for social-card use.
- [ ] Build a 1024 × 1024 app icon from `vamos-net-mark.svg` (paper bg + centered mesh tag, no clipping).
- [ ] Test reverse on the red brand color — the dot must drop to ink, never stay red.
- [ ] Build animated SVG (optional): stripes drawing in from top to bottom on hover / load.

---

## Questions

For anything unclear, refer to the master brand doc at `brand/BRAND_GUIDELINES.md` (typography, color tokens, layout). For brand-use exceptions, email **brand@vamos.net**.

*Last updated: May 2026 · v1.0 (Woven .net direction approved)*
