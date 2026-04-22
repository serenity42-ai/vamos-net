# CLAUDE.md — Vamos.net Project Context

## What This Is
Vamos.net is a professional padel sports media platform — live scores, rankings, player profiles, tournament data, and news. Think "ESPN for padel."

## Tech Stack
- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Data:** PadelAPI.org (Pro tier, Bearer token auth)
- **Deployment:** Vercel (auto-deploy from `main` branch)
- **Repo:** github.com/serenity42-ai/vamos-net

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (server component)
│   ├── scores/page.tsx    # Live scores page (server component)
│   ├── rankings/page.tsx  # Rankings page
│   ├── players/           # Player list + [id] detail
│   ├── tournaments/       # Tournament list + [id] detail
│   ├── news/              # News list + [slug] detail
│   ├── calendar/          # Tournament calendar
│   ├── business/          # Business of padel
│   ├── about/             # About page
│   ├── coming-soon/       # Coming soon landing
│   └── api/               # API routes (proxy for client-side fetching)
│       ├── players/[id]/  # Player details proxy
│       └── matches/[id]/live/  # Live match score proxy
├── components/
│   ├── Header.tsx         # Site navigation
│   ├── Footer.tsx         # Site footer
│   ├── MatchCard.tsx      # Match card (homepage, clickable → modal)
│   ├── MatchModal.tsx     # Match detail modal (client component)
│   ├── MatchModalProvider.tsx  # Modal context provider (client component)
│   ├── ScoresTicker.tsx   # Ribbon ticker (client component)
│   └── ClickableMatchRow.tsx   # Scores page match row (client component)
├── lib/
│   └── padel-api.ts       # All PadelAPI types, helpers, fetch functions
└── middleware.ts           # Coming-soon gate (?preview=vamos2026 bypass)
```

## Key Patterns

### Server vs Client Components
- Pages are **server components** — they fetch data directly via `padel-api.ts`
- Interactive components use `"use client"` — MatchModal, ScoresTicker, MatchCard, ClickableMatchRow
- Client components that need API data use `/api/` proxy routes

### Data Flow
- `padel-api.ts` has all API functions with ISR revalidation (matches: 300s, players: 900s)
- API token is in `.env.local` as `PADEL_API_TOKEN`
- The `Match` type has `players.team_1[]` and `players.team_2[]` with `{id, name, side}`
- Live scores come from `/matches/{id}/live` endpoint (separate from match data)

### Design System — Brand v2 Editorial (current)

**Reference docs (read first, always):**
- `docs/VAMOS.NET Brand Guidelines.html` (self-contained standalone HTML from the designer) — open in a browser to view. Canonical source for tokens, type, components, and voice. Read before designing anything.
- `src/app/globals.css` — CSS variables are the runtime source of truth. Anything visible in the browser ultimately reads from here.

**Tokens — pull from CSS variables, never hardcode hex:**
```css
--ink       /* near-black (body copy, borders) */
--paper     /* warm cream page background */
--paper-2   /* slightly darker paper, cards/hover */
--red       /* primary accent (live, eyebrows, emphasis) */
--lime      /* LIVE badges on ink backgrounds */
--clay      /* secondary warm accent (section 04-ish) */
--mute      /* muted text, de-emphasized */
--ink-soft  /* body copy secondary */
--sans      /* Archivo — body + display */
--mono      /* JetBrains Mono / mono stack — eyebrows, scores, metadata */
```
Use `var(--ink)` etc. in inline `style` or Tailwind arbitrary values (`bg-[var(--paper)]`). NEVER write `#151210`, `#F3EEE4`, `#C1443A`, or any hex from memory.

**Typography:**
- `.display` class — oversized editorial headline, Archivo Black italic
- `.italic-serif` — swash italic span inside display heads
- `.eyebrow` — mono 10–11px, 0.14–0.18em tracking, uppercase, often prefixed with `■`
- `.score-mono` — tabular mono for numerics and scores
- `.badge-live` — the lime LIVE pill
- `.btn` — bordered editorial button

**Hard brand rules:**
- NO rounded corners on layout blocks (cards, buttons, inputs). Rings/avatars only.
- NO shadows. Use hairline borders (`1px solid var(--ink)` or `rgba(0,0,0,0.08–0.15)`).
- NO emojis in UI. Use `■` / `●` / typographic marks instead.
- Winner emphasis is **font-weight**, not color.
- `#` in scores stays mono.

**Existing components — check these before building new ones:**
- `MatchCard` — match result/preview card with winner emphasis
- `MatchModal` — detailed match view, ink header band, paper body
- `NewsCard` — article teaser with red eyebrow + date
- `RankingRow` — table row for rankings (top-3 red, mono points)
- `ClickableMatchRow` — dense match row for /scores groupings
- `StatusBadge` — single source for LIVE / FT / Sched. / Cancelled / W/O
- `ScoresTicker` — ink band ticker with pulsing red Live feed dot
- `NewsletterSignup` — ink full-bleed signup band
- `Header` / `Footer` — editorial wordmark + nav

If a new pattern is needed, extend one of these or propose a new component in /components — don't duplicate layout logic inline.

**Tech debt (to be paid down as pages migrate):**
- `globals.css` has a legacy-color remapping layer that rewrites any stray `#0F1F2E` / `#4ABED9` / `#3CB371` Tailwind arbitrary values to the token system. This is a safety net, not a feature. As each remaining page is migrated to use CSS variables directly, trim the remap rules. Target: delete the whole legacy-remap block once everything reads clean. Track progress in `REDESIGN-LOG.md`.

**Other rules:**
- Player photos as circles with fallback initials (mono font, `--mute` color)
- Country flags via `countryFlag()` helper

### Important Rules
- This is Next.js **14** — `params` in API routes are `{ params: { id: string } }` (NOT Promise-based like Next 15)
- Always use `Promise.allSettled` for parallel API calls — individual failures shouldn't crash the page
- Wrap risky API calls in try-catch — the page must render even if the API is down
- The coming-soon gate is in middleware.ts — `?preview=vamos2026` bypasses it
- Full production site: vamos-net.vercel.app (no gate)

## Testing
Run `npx playwright test` before committing. Tests must pass.
Run `npx next build` to verify no build errors.

## Git Workflow
- Work on feature branches: `feat/feature-name`
- Commit with conventional commits: `feat:`, `fix:`, `refactor:`
- Do NOT push directly to `main` — create PR or merge after testing
- Vercel auto-deploys every branch as a preview URL

## Common Pitfalls
- PadelAPI rate limits on free tier (we're on Pro now, 60 req/min)
- Some tournaments have matches in global `/matches` endpoint but NOT in `/tournaments/{id}/matches` — always check both
- Live match `score` field is `null` — use `/matches/{id}/live` endpoint for real-time scores
- Player photos may be missing — always provide fallback initials
