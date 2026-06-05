# OG image source

`og-default.html` is the source template for `public/og-default.png` (1200×630).

## Regenerate

Render with headless Chrome:

```bash
# from anywhere; serve the file over http so Google Fonts resolves
python3 -m http.server 8765 --directory scripts/og &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=public/og-default.png \
  http://127.0.0.1:8765/og-default.html
kill %1
```

Then commit the updated `public/og-default.png`.

## Why HTML and not SVG/Figma export?

- We want the real Archivo Black via Google Fonts, not a font-substituted
  rasterization.
- The brand logo SVG (`public/brand/vamos-net-logo-light.svg`) uses a CSS
  class for typography (`vn-word`) so rsvg-convert can't render it
  faithfully.
- Future tweaks (tagline copy, accent colors, layout) take 30 seconds in
  a browser; no Figma round-trip needed.

## Design tokens used

- Background: `#0A0A0A`
- Wordmark cream: `#F3EEE4`
- Dot red: `#C1443A`
- Accent orange: `#FE4C00`
- Court line opacity: `0.06` over dark
- Font: Archivo 900 (wordmark + tagline), JetBrains Mono 600 (eyebrow + meta)
