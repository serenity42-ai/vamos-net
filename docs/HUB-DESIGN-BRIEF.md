# VAMOS.NET — Player's Hub / Designer Brief

**Author:** Winston (for Alex)
**Date:** 2026-04-22
**Status:** v1 brief, ready for designer
**Related docs:** `docs/VAMOS.NET Brand Guidelines.html`, `CLAUDE.md`

---

## 1. The One-Line Pitch

A **character-inventory page** for the padel player — click any part of the body or any piece of gear to dive into curated content and gear picks. Editorial, tag-driven, affiliate-monetized. Think "ESPN meets a video-game equipment screen."

It replaces nothing (yet). It is an **additive new top-level section** called **Hub** — positioned between `Tournaments` and `Players` in the nav, or as the new rightmost top-level item. Alex will decide final nav position once he sees a comp.

---

## 2. Why this page exists (business case — read before designing)

1. **Affiliate revenue engine.** Every slot surfaces gear with outbound links to Pádel Nuestro / Amazon / Casas Padel / etc. This page is where high-intent buyers land.
2. **SEO magnet.** Long-tail queries — *"best padel racket diamond 2026"*, *"padel shoes for clay court"*, *"padel warm-up drills"* — each map to a tag-based article cluster exposed through one slot.
3. **Return visit hook.** Scores and rankings are daily. Hub is weekly/monthly — "what should I buy next", "how do I train this week." Different visit rhythm.
4. **Brand signal.** It says *vamos.net is for players who want to get better*, not just scoreboards for fans. Positions us against Flashscore/ATP (who don't do this at all).

v1 is strictly **informational** (scope option **a** from the original discussion). No login, no saved inventory, no real stats. **Stats are graphical navigation**, not measurement.

---

## 3. Mental Model

The screen shows a **padel player silhouette in a central frame** with clickable hotspots:

- **Head** → Mindset / psychology cluster
- **Torso / shirt** → Apparel cluster
- **Racket hand** → Rackets cluster
- **Legs / shoes** → Footwear cluster
- **Belt / bag area** → Accessories cluster

Around the silhouette, a **radar/spider diagram** shows stat "axes" — each axis is also clickable and routes to a content cluster:

- **Speed** → articles tagged `#speed`
- **Balance** → `#balance`
- **Power** → `#power`
- **Endurance** → `#endurance`
- **Recovery** → `#recovery`
- **Reaction** → `#reaction`

Below those two, a third cluster: **Fuel** — nutrition + supplements. Can be a separate CTA block under the inventory (see wireframe).

**Nothing is a game mechanic. Every pip, hotspot, and stat point is just a navigational entrypoint to a tag-filtered article list.**

---

## 4. Information Architecture

```
/hub                        ← the interactive page (this brief)
  ├── /hub/rackets          ← tag page: all #rackets articles, sorted by recency, with pinned pillars
  ├── /hub/shoes            ← #shoes
  ├── /hub/apparel          ← #apparel
  ├── /hub/accessories      ← #accessories (grips, bags, eyewear, dampeners…)
  ├── /hub/mindset          ← #mindset
  ├── /hub/nutrition        ← #nutrition
  ├── /hub/speed            ← #speed (training drills)
  ├── /hub/balance          ← #balance
  ├── /hub/power            ← #power
  ├── /hub/endurance        ← #endurance
  ├── /hub/recovery         ← #recovery
  └── /hub/reaction         ← #reaction
```

Tag cluster pages are **simple editorial list pages**, in current brand system (paper + ink + red + mono eyebrows, hairline borders). Designer does NOT need to design all 12 — they should design **one canonical tag cluster template** that all 12 share.

---

## 5. Page Layout — `/hub`

Use the existing editorial grid (`max-w-[1320px]`, editorial hero band, paper background, ink borders).

### 5.1 Hero band (top)

- Eyebrow: `■ The player's hub`
- Display headline (italic swash): **"Equip. Train. *Win.*"** (or designer to propose 2-3 alternates)
- Dek / subhead: one line of mono + sans explaining what this is ("Everything you need to get better at padel. Click any piece of gear, any stat.")
- No image. Editorial, text-forward.

### 5.2 The interactive unit (the centerpiece)

Two columns on desktop, stacked on mobile:

**Left column (~60% width): Player figure**

- Custom illustration of a padel player in editorial line-art style — minimal, hairline strokes, paper/ink/red accents only. NO photo, NO realistic render, NO 3D. Think *Monocle magazine editorial illustration*, not *video game realism*.
- Figure pose: player mid-stance, racket-side arm slightly raised, ready to receive. Silhouette readable at 320px wide and at 800px wide.
- **Hotspot zones** (each clickable, each has a label that appears on hover/focus):
  - Head → `/hub/mindset`
  - Torso → `/hub/apparel`
  - Racket hand → `/hub/rackets`
  - Legs/feet → `/hub/shoes`
  - Waist/bag → `/hub/accessories`
- On hover, hotspot gets a red hairline ring + a mono label pops out ("■ Mindset · 12 articles"). The article count is live — pulled from CMS tag counts.
- Hotspot cursor: pointer.
- Mobile: the illustration stays, but each hotspot ALSO appears as an item in a list below (see 5.4).

**Right column (~40% width): Stat radar**

- A **radar/spider diagram** with 6 axes (Speed, Balance, Power, Endurance, Recovery, Reaction).
- Drawn in editorial style: hairline ink grid, no fill, mono axis labels, red accent on active axis.
- Each axis tip is **clickable**. Hover → label shows tag and article count. Click → go to `/hub/{stat}`.
- **No real values plotted.** Show a stylized "peak performance" envelope filled with a warm paper-2 tone, no numbers. The radar is decorative-plus-navigational, not a measurement.
- Optional flourish: a small live clock/date in mono below the radar, "Updated weekly." (Sells the freshness signal.)

### 5.3 Inventory grid (below the figure + radar)

Below the interactive unit, a **bordered matrix** of 6 or 7 inventory cards — the same clusters as the hotspots, repeated, because:

1. Accessibility — not everyone can parse silhouettes.
2. SEO — crawlers see real text links, not SVG hotspots.
3. Cards can carry thumbnails + short copy, the silhouette can't.

Each card:
- Eyebrow: `■ 01 · Rackets` (numbered 01-06 for editorial rhythm)
- Display-sized category name
- One-line descriptor
- Mono link: "Enter → "
- Bordered, hairline, no shadow. On hover: card background → `--paper-2`, eyebrow → red.

### 5.4 Mobile behavior

- Hero: same.
- Interactive unit: silhouette scales down, stat radar moves below it.
- Silhouette remains tappable (hotspots scale with it), but the **inventory grid becomes the primary nav** — stacked 1-col, full-width cards.

### 5.5 Editorial footer on hub page

A closing editorial block:
- Eyebrow: `■ More incoming`
- "A living hub. New gear picks, drills, and columns added every week."
- Link to newsletter (even if newsletter is disabled for now, Alex said "no newsletter for now" — so **omit signup**, leave placeholder for Alex's call).

---

## 6. Page Layout — `/hub/{cluster}` (tag page template)

Single template, reused by all 12 tag cluster pages. Lives in current brand.

### 6.1 Hero band

- Breadcrumb (mono): `HUB › RACKETS`
- Eyebrow: `■ Cluster · Rackets`
- Display headline: the cluster name, italic swash on a key word — e.g. *"Find your **racket**."*
- Dek: "Reviews, buyer's guides, and our picks for every level."

### 6.2 Pinned editorial picks (up to 3)

Full-bleed bordered cards for pillar articles — e.g., "Best Padel Rackets 2026", "How to Choose a Padel Racket", "Diamond vs Round vs Teardrop".

### 6.3 Affiliate "Our picks" strip (for gear clusters only)

**This is the affiliate revenue moment. Design it carefully.**

- Horizontal strip of 3-5 product cards.
- Each card:
  - Product image (bordered, no shadow, paper-2 bg for transparency)
  - Mono eyebrow: `■ Editor's pick` / `■ Best value` / `■ For beginners`
  - Product name (sans, bold)
  - One-line pro/con (2 short lines mono)
  - Price (mono, optional, may not display if affiliate API doesn't provide it consistently)
  - Outbound CTA button: `Buy at Pádel Nuestro →` (or whichever vendor; per-product)
  - Tiny disclosure: `* We earn a commission. No extra cost to you.`
- Clear visual separation from editorial — give this strip a paper-2 band with ink top/bottom hairline borders to differentiate "this is a product shelf" from "this is editorial."

This strip should ONLY appear on gear clusters: Rackets, Shoes, Apparel, Accessories, Nutrition. It should NOT appear on training/mindset clusters (Mindset, Speed, Balance, Power, Endurance, Recovery, Reaction) — those are editorial-only for now.

### 6.4 Article feed

- Editorial grid. Re-use the homepage/news `NewsCard` component. Gap-x-8 gap-y-12 like `/news`. No bordered matrix.
- Sort: newest first, with "pinned" articles bubbled to top if CMS marks them.
- Filter chips (mono, bordered, red-when-active): if a cluster has sub-tags (e.g., `#rackets` has sub-tags `#diamond`, `#round`, `#teardrop`), expose them as chips. Designer to propose the chip row for racket/shoes/apparel; skip for others.

### 6.5 Related clusters (bottom)

Small strip linking to 3 related clusters (e.g., Rackets → Grips, Power, Bags). Keeps users in Hub.

---

## 7. Design System — non-negotiable rules

**Read `docs/VAMOS.NET Brand Guidelines.html` first. The following are reminders, not replacements.**

- **Colors:** `--ink` #151210, `--paper` #F3EEE4, `--paper-2` slightly darker, `--red` #C1443A (accents/live/primary), `--lime` #D4E85A (LIVE badges only), `--clay` secondary warm accent, `--mute` for de-emphasized text. **Never hardcode hex.** Use CSS variables.
- **Typography:** Archivo (display + body), JetBrains Mono (eyebrows, scores, metadata). `.display` = oversized italic Archivo Black, with occasional `.italic-serif` swash spans.
- **Eyebrows:** mono, 10-11px, 0.14-0.18em tracking, uppercase, usually prefixed with `■` or `●`.
- **NO rounded corners** on blocks (cards, buttons, inputs). Avatars/rings only.
- **NO shadows.** Hairline borders (`1px solid var(--ink)` or `rgba(0,0,0,0.08-0.15)`).
- **NO emojis in UI.** Use `■` / `●` / `→` / typographic marks.
- **Winner/emphasis is weight, not color.**
- **Light theme only.** No dark mode.

---

## 8. Existing components — designer should reuse, not re-invent

These already exist in the codebase and match the brand. Mock them as-is; the developer will wire them up.

- `MatchCard` — match result/preview
- `NewsCard` — article teaser (use for article feeds on cluster pages)
- `StatusBadge` — LIVE / FT / Sched. pills
- `Header` — editorial wordmark + nav
- `Footer`
- `.display`, `.italic-serif`, `.eyebrow`, `.score-mono`, `.badge-live`, `.btn` utility classes

If a new component is truly needed (e.g., `InventorySlot`, `HotspotFigure`, `StatRadar`, `AffiliateProductCard`), designer should propose it and name it.

---

## 9. Deliverables from designer

In **Figma** (or the tool you prefer, Figma strongly preferred):

1. **Hub landing page `/hub`** — desktop (1440 wide) and mobile (390 wide). Both states: default + hover on one hotspot + hover on one radar axis.
2. **Cluster template — gear version (e.g. `/hub/rackets`)** — desktop + mobile. Includes the affiliate "Our picks" strip.
3. **Cluster template — training/mindset version (e.g. `/hub/speed`)** — desktop + mobile. No affiliate strip.
4. **Hotspot illustration** — SVG-friendly line-art padel player figure, exported as SVG so the dev can slice hotspots in code.
5. **Stat radar** — SVG, editorial style.
6. **Inventory card component** — one canonical card, annotated with token names (`var(--paper-2)`, `var(--mono)` etc.).
7. **Affiliate product card** — canonical, annotated, with placeholder product image slot.
8. **Filter chip** — active / inactive / disabled states.
9. **Nav update** — show where "Hub" sits in the existing header (between `Tournaments` and `Players` is my suggestion; designer may propose).

**Please annotate each screen with:**
- Which CSS variable each color references
- Which utility class each text element uses
- Which existing component is being reused

Turnaround: aim for first pass within **1 week**. Alex will review and iterate.

---

## 10. Content requirements (so designer can ground the mockups in realism, not lorem)

Designer should use **real copy stubs** in the mockups, not lorem ipsum. Here's starter copy for each cluster so designer has something realistic to place:

### Rackets
- Pillar articles: "Best Padel Rackets 2026", "How to Choose a Padel Racket", "Diamond vs Round vs Teardrop: Which Shape Fits You"
- Affiliate picks example: Bullpadel Vertex 04, Babolat Technical Viper, Nox AT10 Genius, Head Delta Pro

### Shoes
- Pillar: "Best Padel Shoes 2026", "Clay vs Hard: Choosing Your Outsole"
- Affiliate: Asics Gel-Padel Pro, Bullpadel Vertex, Adidas Adizero Ubersonic

### Apparel
- Editorial-style: "What the pros wear on tour", "The case for compression"

### Accessories
- Grips, overgrips, dampeners, bags, eyewear, elbow sleeves

### Mindset
- "Pre-match ritual of a top-100 player", "How to communicate with your partner when you're losing", "Dealing with a bad call"

### Nutrition
- "What to eat 90 minutes before a match", "Recovery post-tournament: the 3-day protocol"

### Speed / Balance / Power / Endurance / Recovery / Reaction
- Short drill articles, ~300 words each, with one key image. "5-minute warm-up for lateral speed", "Single-leg balance drills you can do at home", etc.

Winston will produce 6-10 pillar articles for v1 launch. The designer should treat article counts as real (e.g., ~40-60 articles total over time).

---

## 11. Success criteria

The page ships if, on launch:

1. Every hotspot and every radar axis routes to a real `/hub/{cluster}` page with at least 3 real articles on it.
2. Gear clusters have a working affiliate "Our picks" strip with tracking links (even if only 1-2 vendors are live at launch).
3. The page passes `npx next build` cleanly and all 12 cluster pages return 200.
4. The page passes `npx playwright test` — tests to be added: hub loads, silhouette and radar render, hotspot hover labels work, cluster pages load, affiliate outbound link has `rel="sponsored nofollow"`.
5. The page reads as editorial and on-brand when viewed side-by-side with `/scores` and `/news`.
6. Accessibility: every hotspot has a text equivalent in the inventory grid below; radar axes are keyboard-navigable.

---

## 12. Explicitly out of scope for v1

- Login / user accounts
- Personal inventory persistence
- Real stat measurement or self-reported stats
- XP, challenges, badges, gamification
- Video content
- Premium / paid tier (backlogged — coming soon per Alex)
- Newsletter signup on hub (per Alex, no newsletter for now on this page)
- Translation to other languages

---

## 13. Brand safety checklist for designer

- [ ] No emojis in UI copy
- [ ] No rounded corners on layout blocks
- [ ] No shadows
- [ ] All colors via CSS variable names, never raw hex
- [ ] Archivo + JetBrains Mono only
- [ ] Affiliate disclosure visible on every product card
- [ ] Red dot on any "live" element pulses (match existing `.live-dot` rule)
- [ ] Works at 390px wide
- [ ] All touch targets ≥ 40px on mobile

---

## 14. Questions still open for Alex (not blocking design, but flag)

1. Exact nav label — "Hub" / "Player's Hub" / "Gear & Train" / other?
2. Icon set for inventory cards (if any). Current brand avoids icons — confirm we stay text-first, or designer proposes 6 line-icons that match brand.
3. Is Dima co-authoring the technique/training content? If yes, content bylines need a design treatment (portrait + name in editorial style).
4. Mobile hotspot behavior — hotspots on a small silhouette are tiny. Acceptable for designer to make silhouette a decorative illustration on mobile and push all navigation to the card grid? I'd prefer this for usability.

---

*End of brief. Designer: please confirm receipt, ask any clarifying questions, and propose first-pass timeline.*
