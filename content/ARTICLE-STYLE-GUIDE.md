# Vamos.net Article Style Guide

## Writing Guidelines

### Tone & Voice
- Write like a sports media outlet, not a blog
- No AI slop: avoid "masterclass," "served notice," "the throne holds," "shape of things to come"
- No bullet points in articles — flowing prose only
- No weird headlines — clear, punchy, editorial style
- Use padel nicknames naturally (Golden Boys, El Lobo, Mozart, Chingalán, Perlamita) — shows insider knowledge
- First mention: full name. After that: nickname or surname
- Don't insert nicknames mid-name (not "Juan El Lobo Lebrón" — either "Juan Lebrón" or "El Lobo")

### Structure
- One page overview per tournament
- Lead with the final result, then unpack the drama
- Include "wow moments" — upsets, surprise runs, notable performances
- Add context: quotes from players, press conferences
- Close with what's next (next tournament, implications)
- AI slop check: review for triple-adjective structures, formulaic phrases, LLM patterns
- Factcheck: verify all scores, seedings, round results, quotes, historical claims

### Content Sources
- Scores/draws: vamos-net.vercel.app/tournaments/[id] (our own data)
- Match details & quotes: Marca, PadelFIP, Padel Magazine, Padel Tonic
- Photos: @premierpadel Instagram (free for editorial use), Premier Padel X account
- Video highlights: YouTube (PadelZone TV, beIN Sports, Premier Padel official)

## Drafting & Polishing Process

### Step 1: Research
- Pull all match results from our own scores page first
- Cross-reference with Marca, PadelFIP, Padel Magazine, Padel Tonic for color/detail
- Find "wow moments" — upsets, comeback matches, unexpected semifinalists
- Search for player quotes/press conference quotes from the tournament
- Check what's next on the calendar to close with a forward look

### Step 2: First Draft
- Write in flowing editorial prose — no bullet points, no numbered lists
- Lead with the headline result (who won the final)
- Second paragraph: unpack the final — set-by-set narrative, key moments, tactics
- Third paragraph: the draw chaos — upsets, surprise runs, underdogs
- Fourth paragraph: women's draw with same treatment
- Close: what's next on tour, what this tournament means for the season
- Target length: 500-700 words (one page feel, not a marathon)

### Step 3: Nickname & Insider Knowledge Pass
- Use established padel nicknames to show credibility:
  - Coello/Tapia = "The Golden Boys"
  - Lebrón = "El Lobo"
  - Tapia = "Mozart"
  - Galán/Chingotto = "Chingalán"
  - Josemaría/González = "Perlamita"
- Use nicknames slightly more often than in generic sports writing — it signals "we know padel"
- First mention always includes full name, then switch to nickname or surname
- NEVER insert nickname mid-name (wrong: "Juan El Lobo Lebrón" / right: "El Lobo" or "Juan Lebrón")
- Include padel-specific terminology naturally: chiquitas, bandeja, víbora, bajada — readers expect it

### Step 4: AI Slop Check
Scan the entire draft for these red flags and fix them:

**Phrases to kill on sight:**
- "masterclass" — always replace with something specific
- "served notice" — too corporate
- "the throne holds" — cliché
- "shape of things to come" — literary cliché (H.G. Wells)
- "composed and explosive in equal measure" — classic AI balancing act
- "a testament to" — overused
- "nothing short of" — filler
- "in equal measure" — dead giveaway
- "landscape" (when not describing actual geography) — AI word

**Structural patterns to break:**
- Triple comma-separated adjectives ("relentless, precise, utterly composed") — break up or cut one
- "X was Y — [adjective] from the [noun], [verb]ing every [noun], and [adjective] in the [noun]" — classic LLM rhythm
- Sentences ending with "...is real" or "...is here to stay" — overused closers
- Every paragraph starting with a different subject — too neat, real writing has messier flow

**The human test:** Would a sports journalist at The Dink, Padel Magazine, or Marca write this sentence? If it sounds like a press release or LinkedIn post, rewrite it.

### Step 5: Factcheck
Before publishing, verify EVERY factual claim:
- All match scores (cross-check with our scores page + PadelFIP)
- Round results (who beat whom, in which round)
- Seedings (who was seed 1, 2, etc.)
- Player quotes (verify source — don't paraphrase quotes we haven't confirmed)
- Historical claims (e.g., "won his first title at Madrid P1 last September" — confirm date and tournament)
- Nickname accuracy (make sure we're attributing the right nickname to the right pair)
- Tournament details (dates, venue, prize money, category P1/P2/Major)
- What's next (confirm the next tournament name, dates, and category)

### Step 6: Final Polish
- Read the entire article out loud — if you stumble, the sentence is too long or awkward
- Check opening line — does it grab? Would you click on this?
- Check closing line — does it leave the reader with something? A question, an anticipation?
- Ensure the cover photo matches the article's main story (winners celebrating > generic court shot)

## Technical Setup

### Article Data Location
- File: `src/data/mock.ts`
- Articles array: newest first
- Interface: `{ slug, title, excerpt, category, author, date, imageUrl, body }`
- Body format: HTML string with `<p>` tags

### Article Categories
- "Tour News" — tournament recaps, results, player news
- "Rankings" — ranking changes, analysis
- "Business" — padel industry, investment, growth
- "Academy" — how-to, technique, equipment

### Images
- Location: `public/images/news/`
- Format: JPG, 16:9 aspect ratio preferred
- Naming: `[tournament]-[year].jpg` (e.g., `cancun-p2-champions-2026.jpg`)
- Reference in data: `/images/news/[filename]`

### Typography (Tailwind)
- Plugin: `@tailwindcss/typography` (installed)
- Article body classes:
  ```
  prose prose-base sm:prose-lg max-w-none text-gray-700 break-words
  prose-p:mb-5 prose-p:leading-relaxed
  prose-headings:text-[#0F1F2E] prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
  prose-a:text-[#4ABED9] prose-a:no-underline hover:prose-a:underline
  prose-img:rounded-xl
  prose-strong:text-[#0F1F2E]
  ```

### Deployment
- Repo: github.com/serenity42-ai/vamos-net
- Branch: main
- Auto-deploy: Vercel (triggers on push to main)
- Live URL: vamos-net.vercel.app (production: vamos.net)
- Deploy time: ~1-2 minutes after push

### Publishing Checklist
1. Write article following style guide
2. AI slop check + factcheck
3. Get/save cover photo to `public/images/news/`
4. Add article object to `src/data/mock.ts` (top of array = newest)
5. `git add -A && git commit -m "..." && git push origin main`
6. Verify on Vercel after deploy
