# VAMOS.NET — Brand & Design Guidelines

> **The World of Padel.** Live scores, rankings, news. Everything happens at the net.

This document is the source of truth for VAMOS.NET's visual identity. Follow it when designing any new screen, article template, social post, or product surface. When in doubt, look at `VAMOS.NET Redesign Proposal.html` for reference implementation.

---

## 1. Brand Voice & Principles

**Editorial, not promotional.** We cover padel as a sport AND as an industry. Writing is confident, informed, concise. Design supports that: serious typography, restrained color, generous whitespace, with sharp bursts of red energy at moments of meaning.

**Five design principles:**

1. **Editorial first.** Treat every layout like a magazine spread. Strong hierarchy, considered typography, real content — never lorem-ipsum padding.
2. **The net is the center.** The court's net is our metaphor for the moment that matters. Live, decisive, charged. Use red only where that energy lives — scores, CTAs, taglines, accents.
3. **Scoreboard energy.** Monospace numbers. Tabular scores. Data is design. Never hide stats — elevate them.
4. **Don't decorate, compose.** Use typography, color, and whitespace. Avoid drop shadows, 3D, generic gradients, and emoji.
5. **Italic where it matters.** The italic Archivo Black display + Instrument Serif italic accent is our signature move. Use it for moments of voice and punch — not decoration.

---

## 2. Logo

The primary mark is **"Vamos!"** — italic Archivo Black with a red exclamation, locked up with a monospace tagline block reading `THE WORLD / OF PADEL`.

### Files

| Variant | File | Use |
| --- | --- | --- |
| Primary (dark text) | `brand/vamos-logo.svg` | Paper/light backgrounds |
| Reversed (light text) | `brand/vamos-logo-light.svg` | Ink/photo/red backgrounds |
| Mark only (square) | `brand/vamos-mark.svg` | Avatars, stamps, corners |
| Favicon | `brand/favicon.svg` | Browser tab, PWA |

### Construction

- Wordmark: **Archivo Black, italic, 900 weight**, letter-spacing `-0.045em`, skewed an additional **−6°** beyond italic
- Exclamation mark: **red `#C1443A`**, same skew and weight
- Tagline block: **JetBrains Mono 700**, 10px at 30px logo size, letter-spacing `0.18em`, uppercase, 65% opacity, separated from wordmark by a **1px vertical rule** at current color

### Clear space

Minimum clear space on all sides = **height of the "V"**. Never crop into this.

### Minimum sizes

- Full lockup: **min 120px wide** (24px cap-height)
- Mark-only (V!): **min 24×24px** (use for favicons, avatars, very tight nav)

### Don'ts

- Don't recolor the exclamation (red is fixed — except on red itself, where it becomes ink)
- Don't stretch, outline, or add effects
- Don't set the wordmark upright (italic is mandatory)
- Don't swap the tagline for marketing copy — it is a structural part of the mark

---

## 3. Color

### Core palette

| Token | Hex | Role |
| --- | --- | --- |
| `--paper` | `#F3EEE4` | Default background (warm off-white) |
| `--paper-2` | `#EAE3D5` | Secondary surfaces, alt rows |
| `--ink` | `#151210` | Text, rules, dark surfaces |
| `--ink-soft` | `#3A312B` | Secondary text |
| `--mute` | `#8A7D71` | Eyebrows, metadata, disabled |
| `--red` | `#C1443A` | **Primary accent** — CTAs, accents, "!" |
| `--red-deep` | `#8B2E26` | Hover state on primary |
| `--clay` | `#D8825C` | Business section secondary |
| `--lime` | `#D4FF3A` | **LIVE only** — scoreboard tag, never decoration |
| `--court` | `#1F4D3F` | Padel-court green, rare use |

### Color rules

- **Red is for meaning, not decoration.** Use on: scores in progress, primary CTAs, cover-story labels, italic serif accents, the "!" in the logo. Never as a button background on cards, never as a section fill except for the marquee band.
- **Lime is reserved for LIVE.** If it appears anywhere else, live-match signaling loses impact.
- **Dark mode is a full variant**, not inverted. Use `html[data-variant="night"]` (`--paper: #0F0E0D`, `--ink: #F3EEE4`, `--red: #E0574C` — a warmer red that holds saturation on dark).
- **Accessibility:** all text must meet WCAG AA. `--ink` on `--paper` passes at 13px+. `--mute` on `--paper` fails for body copy — use for eyebrows/captions only.

### Themes

Three provided in `brand/tokens.css`:

- `data-variant="editorial"` — default (paper/ink/red)
- `data-variant="night"` — full dark mode
- `data-variant="court"` — green-tinted paper, for Business-of-Padel landing pages

---

## 4. Typography

Three families. No others.

### Families

| Family | Use | Google Fonts |
| --- | --- | --- |
| **Archivo / Archivo Black** | Display, headlines, UI | `Archivo:ital,wght@0,400;0,700;0,800;0,900;1,800;1,900` |
| **Instrument Serif** | Italic accents, editorial phrases | `Instrument+Serif:ital@0;1` |
| **JetBrains Mono** | Scores, data, eyebrows, metadata | `JetBrains+Mono:wght@400;500;700;800` |

### Type scale (1320px canvas)

| Class | Font | Weight | Size | Letter-spacing | Use |
| --- | --- | --- | --- | --- | --- |
| `.display` | Archivo | 900 italic | 56–92px | `-0.035em` | Hero, section headers |
| `.headline` | Archivo | 800 | 22–30px | `-0.02em` | Article titles, card heads |
| Body | Archivo | 400 | 15–17px | `0` | Paragraph copy |
| `.italic-serif` | Instrument Serif | 400 italic | matches context | `-0.015em` | Accent words inside a display |
| `.eyebrow` | JetBrains Mono | 700 | 11px | `0.14em` uppercase | Labels, categories, dates |
| `.mono` score | JetBrains Mono | 700–800 | 12–14px | `0.02em` | Scores, rankings, stats |

### Signature move: the italic-serif accent

Our display voice is **Archivo Black italic** with **one italic-serif word** inside it, often in red:

> **"The number ones *fell* in Miami."**

The serif italic word is the emotional beat. Use one per display headline — never two. Never apply to eyebrow or body.

### Typography rules

- **Lead with hierarchy.** One display per screen. Everything else supports it.
- **Never center body copy.** Left-aligned only. Short line-length (~60ch) for readability.
- **Numbers are monospace.** Scores, rankings, dates, prize money — always JetBrains Mono, always tabular.
- **Eyebrows carry category.** Precede every major block (news card, section) with a mono eyebrow: `■ Cover Story · Miami P1` or `■ Business of Padel`.
- **`text-wrap: balance`** on all headlines. `text-wrap: pretty` on body copy.

---

## 5. Layout & Grid

### Canvas

- **Desktop:** 1320px max-width, 32px horizontal padding
- **Grid:** 12 columns, 24px gutter
- **Breakpoints:** 1320 / 1024 / 768 / 480

### Vertical rhythm

- **Section padding:** 56–80px top/bottom on desktop
- **Card gap:** 32px
- **Inline element gap:** 16px (sm), 24px (md), 40px (lg)
- **Block spacing within a card:** 14px between eyebrow / title / body / meta

### Rules & borders

- Single `1px solid var(--ink)` borders on major containers
- Internal rules drop to `rgba(0,0,0,0.12)` on paper, `rgba(255,255,255,0.15)` on ink
- **No rounded corners** above 2px. Radii: `--r-sm: 2px` (buttons, pills), `--r-md: 6px` (rare), `--r-lg: 14px` (avoid)
- **No drop shadows.** Use hairline borders and background contrast instead.

### Composition patterns

- **Asymmetric grids** preferred (1.5fr 1fr; 1.3fr 1fr 1fr). Symmetric only for indexes and tables.
- **Full-bleed imagery** on hero and section leads. Cropped imagery on cards.
- **Marquee bands** in red every 2–3 sections to break rhythm and carry tagline energy.

---

## 6. Components

Reference implementations in `brand/*.jsx`. Full tokens in `brand/tokens.css`.

### Buttons

- `.btn` — outlined ink (default)
- `.btn-primary` — red fill, white text
- Padding `10px 16px`, radius `2px`, uppercase, letter-spacing `0.04em`, weight 700

### Badges & pills

- `.badge-live` — lime background, ink dot pulsing, uppercase mono. **LIVE only.**
- Category pills: 1px border, mono uppercase, padding `3px 8px`, no background

### Cards

- News card: `ph` image block (4:3) + eyebrow + headline + body + author
- Ranking row: rank / flag / name / points, 1px bottom rule
- Match result row: tournament / winner (bold) / loser (soft) / score (red mono) / division (mute)

### Live ticker

- Black band, 10px top/bottom padding
- "● LIVE" prefix in mono with right divider
- Infinite marquee of matches, duplicated track for seamless loop
- LIVE matches get a lime chip; finished matches get a mute tournament label

### Eyebrow label

```
■ Cover Story · Miami P1
```

Filled square (■) in red, mono, uppercase, `0.14em` tracking, 11px.

### Placeholder image

Use `.ph` class — paper-2 background, 135° hatched overlay, centered mono label. Never ship a placeholder to production, but use it throughout drafts.

---

## 7. Imagery

### Photography

- **Editorial, in-action.** Prefer decisive moments — smashes, wins, glove-clasps — over posed portraits.
- **Warm, high-contrast.** Slight warm tint sits well on paper. Avoid cool blue/green casts.
- **Crops are punchy.** Don't be afraid to crop tight on a face or a paddle.
- **Attribution is visible.** Credit in mono, 10px, `--mute` color, always under the image.

### Captions

```
■ PHOTO · Premier Padel / Getty Images
```

Mono, uppercase, with the same `■` eyebrow treatment as labels.

### Avoid

- Stock-photo clichés (businesspeople shaking hands, clipart courts)
- AI-generated imagery for editorial content
- Emoji in any editorial context (the sport has flags — those are fine in rankings)
- Over-filtered / Instagram-preset looks

---

## 8. Iconography

Use **Lucide** icons (`lucide-static` SVG set). Stroke-only, 2.2px weight, no fills.

- Nav: Search, Bell, User
- UI: ChevronRight (`→`), Play, Pause, ExternalLink
- Data: TrendingUp, Trophy, Calendar

Never mix icon libraries. Never use emoji as icons. When in doubt, prefer a typographic `→` over a chevron icon.

---

## 9. Motion

Subtle and purposeful. Motion carries meaning — not attention.

- **Ticker marquee:** `transform: translateX` linear, 40s loop
- **LIVE dot blink:** 1.1s, opacity 1 → 0.2
- **Hover transitions:** 150ms ease
- **Score updates:** 300ms fade + 2px vertical shift
- **Page transitions:** none (crossfade only in article views)

No spring animations. No parallax. No auto-play video in feed.

---

## 10. File & Asset Structure

```
brand/
├── tokens.css            ← Design tokens (CSS custom properties)
├── Logo.jsx              ← React logo component
├── vamos-logo.svg        ← Primary lockup (dark on paper)
├── vamos-logo-light.svg  ← Reversed (light on dark/red)
├── vamos-mark.svg        ← Square V! mark
└── favicon.svg           ← 32px favicon
```

Add new primitives as individual `.jsx` files in `brand/`. Keep one component per file. Export components to `window` at the end of each file for cross-script availability.

---

## 11. Writing & Tone

Design without copy is scaffolding. Write in-product text like an editor, not a marketer.

- **Eyebrows:** category · context. `Tour News · Mar 28`
- **Headlines:** specific, active, sometimes italic-accented. Avoid vague ("Big news from the tour") — be concrete ("Galán & Chingotto end the Golden Boys' reign").
- **CTAs:** verbs, not nouns. `Read the analysis →` not `Learn more`. `Join the Brief →` not `Subscribe`.
- **Metadata:** mono uppercase. `5 min read · March 30`
- **No exclamations in copy.** The logo owns the only "!". Enthusiasm comes from content, not punctuation.

---

## 12. Section Checklist

When designing a new section, verify:

- [ ] Mono eyebrow labels the section
- [ ] Italic display headline with serif accent word
- [ ] 1px borders define containers (no shadows)
- [ ] Red used only on meaningful accents
- [ ] Numbers are monospace
- [ ] Real content, no lorem ipsum
- [ ] Hairline rules between rows
- [ ] Generous vertical padding (56–80px)
- [ ] Hover states defined for every interactive element

---

## 13. Contact

For brand-use questions, email **brand@vamos.net**. For asset requests beyond what ships here, ask before creating — we'd rather extend the system than fork it.

*Last updated: April 2026 · Version 1.0*
