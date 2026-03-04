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

### Design System
- Colors: `#0F1F2E` (dark navy), `#4ABED9` (accent blue), `#3CB371` (green), white backgrounds
- NO emojis in UI
- Light theme, clean minimal design
- Player photos as circles with fallback initials
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
