# Tournament Recap Pattern

How to draft a Premier Padel tournament recap for Vamos. Distilled from how the
Spanish padel press (Marca, Mundo Deportivo, sport.es, PadelSpain, ElNeverazo,
Padel Tonic) actually covers a P1/P2/Major.

**Use this pattern every time. Don't reinvent the structure per article.**

---

## The non-negotiables

A recap is missing if any of these is absent:

1. **Result + season-narrative anchor in the lead.** Not just "X beat Y 6-2 6-3." The lead must say what the result *means* in the season's storyline.
2. **Round-by-round path to the final** for the winners, with scores. Spanish press does this for every recap. We've been skipping it.
3. **Set-by-set narration of the final**, with break points pinpointed by game number. ("The break came in the fifth game of the second set.")
4. **At least two direct quotes** — one from the winner about the partner / coach / moment. Press conferences are the source. If there's no presser available, pull from official Premier Padel post-match interviews.
5. **Match stats baked in** — winners count, break points conceded, duration, key statistical asymmetry. Density is the point.
6. **H2H / rivalry context** — was this their nth meeting? Who won the previous ones? Is there a rivalry forming?
7. **Pair-formation context** — when did this pair form, what came before, who else got reshuffled. Vamos signature, mandatory.
8. **Coach + team mention** — Spanish press always credits the coaching staff. We do too.
9. **Forward-looking close** — name the next tournament on the calendar by name, not vaguely "the tour heads on."
10. **At least one human / emotional beat** — tears, milestones, redemption arcs. Don't bury them.

If a recap is missing 3+ of these, it's not done. Send back to draft.

---

## Structural template

Use this skeleton. Adjust paragraph length to fit, but keep the order.

### Title
Pattern: `[Tournament name + level/year]: [Editorial hook]`

Good: *"Brussels P2 2026: New Pairs, Old Tears, the Race Reopens"*
Good: *"Cancún P2 2026: The Golden Boys Make It Three"*
Bad: *"Lebrón and Augsburger Win Brussels P2"* (just a fact, no editorial)
Bad: *"A Stunning Weekend in Brussels"* (vague AI-slop)

### Lead paragraph (~110-130 words)
- Sentence 1: who won the men's final + score
- Sentence 2-3: what makes this win meaningful (first title, comeback, rivalry beat, ranking shift)
- Sentence 4: women's final winner + score
- Sentence 5: women's narrative anchor (rivalry, milestone, streak)
- Sentence 6 (optional): the season-level takeaway. *"The race for 2026 is open."*

Lead with men's per the 70/30 coverage split. Women's gets one or two sentences in the lead.

### Men's final paragraph (~180-220 words)
- Set 1 narration: who broke whom, in which game, finishing score
- Set 2 turn: where the match flipped, key tactical change, pinpointed break
- Set 3 close: how it finished
- Stat bomb: at least 2 stats (winners, break points conceded, duration)
- One direct quote from the winner about the partner or moment
- Coach name if known
- Backstory: what was this title for the winners? First together? Comeback after a slump?

### Men's draw paragraph (~180-220 words)
- Quarters: 2-3 notable matches with scores
- Semis: both semifinals with scores
- Pair-formation context: who formed when, who came from where, who survived the off-season
- One structural observation: *"Three of the four men's SF pairs were formed in the last six months."*

### Women's section (~110-150 words, one paragraph)
- Result + score + rivalry context (which meeting in the H2H)
- One emotional beat (Triay's 100th final, tears, milestone)
- Set-level highlight (where the match turned)
- Stat punch (winners, break points)
- One direct quote
- Brief draw context if there was an upset

### Close paragraph (~80-100 words)
- What this means for the season title race
- Who's still the team to beat
- **Specific** next tournament(s) by name and location — verify the calendar order before writing
- Optional speculation hook: *"Padel's pair market doesn't usually move in spring, but a few results like Brussels can change that."*

Total target: 600-750 words. Do not pad.

---

## Coverage split (locked rule)

- **Men's content: ~70%** of body words. Foreground in lead. Two full body paragraphs (final + draw).
- **Women's content: ~30%** of body words. One body paragraph that combines final + draw highlights.

This reflects the current padel fan-base demographics, not editorial preference. Revisit when audience analytics warrant.

---

## Tone

- **Enthusiastic-but-earned.** We're fans, not wire-service stenographers.
- Don't shy from emotion (tears, milestones, redemption). But ground enthusiasm in on-court substance, not adjectives.
- **Avoid framing wins as "upsets"** when both pairs are world-class. *Upset* centres the loss. Prefer "statement win," "made their case," "the race reopens."
- Spanish press uses generous metaphor (*"se han vestido de dorado", "tocan el cielo en Bruselas"*). We can do similar in English when it lands. Don't force it.
- **No AI-slop banned phrases** (see `AI-SLOP-CHECKLIST.md`): no "masterclass," "served notice," "throne holds," "shape of things to come," "in equal measure."
- ≤6 em-dashes per piece. Use commas or parentheses by default.

---

## Padel vocabulary (English equivalents for Spanish terms you'll see in source articles)

| Spanish | English to use |
|---|---|
| remontada | comeback (or just "reversed it") |
| binomio / dupla / pareja | pair, partnership, duo |
| manga | set |
| break / rotura de servicio | break |
| punto de inflexión | the turn / where the match flipped |
| golpe de autoridad | statement win |
| cuadro | draw |
| cabezas de serie | seeds |
| sets corridos | straight sets |
| doble 6-x | identical X-X scoreline |

Don't pepper English text with Spanish unless quoting. *"Al lado tengo a un fenómeno"* is a Lebrón quote and stays in Spanish, with translation in italics or parentheses. *"Golpe de autoridad"* used as commentary is fine if italicised once and translated.

---

## Process: how to actually draft one of these

### 1. Pull the data first
- PadelAPI: tournament metadata, all match results, durations, courts. Use `https://padelapi.org/api/tournaments/{id}/matches?per_page=100`.
- Cross-check round results, set scores, seeds.

### 2. Read at least 3 Spanish recaps before drafting
**Mandatory.** PadelAPI gives scores; it doesn't give stories.
- Marca: round-by-round structure, coach names, calendar
- Mundo Deportivo: tactical narration, set turns
- sport.es: emotional / human beats, women's coverage depth
- PadelSpain: fan voice, headline metaphors
- ElNeverazo: set-by-set break game numbers, stats
- Padel Tonic: English-language quotes from press conferences (Lebrón, Galán, etc.), H2H records

Extract from these:
- The decisive break point game numbers
- Direct quotes (winner, partner, coach, loser)
- H2H history of both finalist pairs
- Coach / team names
- Career milestones (Xth title, Yth final, comeback after Z)
- Match duration and shot stats
- The next tournament on the calendar

### 3. Verify the calendar order before writing the close
The Premier Padel calendar moves geographically and the order matters. Check the official calendar before naming "what's next." After Brussels P2 2026 the tour went to **Asunción P2 → Buenos Aires P1**, not Rome. Verify every time.

### 4. Draft to the structural template above
Don't reinvent the structure. Skeleton stays the same; substance changes by tournament.

### 5. Self-audit before shipping
Run the draft against the **non-negotiables** checklist (top of this doc). Every box checked? Ship to Ghost as draft. Otherwise, rework.

---

## Common factual landmines (verify every time)

These trip up generic AI summaries:
- **Player's last title is rarely the obvious one.** Check the actual most-recent title in PadelAPI, not the famous one. (Lebrón's last title before Brussels was Cancún P2 with Stupaczuk, not anything from the Galán era.)
- **Pair-formation timeline is fluid.** Who was with whom in 2024 ≠ 2025 ≠ 2026. Verify the prior partner before writing "the pair formed after splitting from X."
- **H2H counts.** Spanish press tracks recent meetings carefully. Don't invent.
- **Career milestones (Xth final, Yth title)** come from the press conference or sport.es / Marca features. PadelAPI doesn't give them.
- **Tour calendar order** changes year to year. Verify.

When in doubt: don't invent the detail. Omit it.

---

## What NOT to do (lessons from past drafts)

- ❌ Don't draft a recap from PadelAPI scores alone. You'll miss every emotional beat and every quote.
- ❌ Don't frame a top-5 pair beating a top-1 pair as an "upset." It's a statement.
- ❌ Don't use "the throne holds," "served notice," "shape of things to come," "in equal measure," or any LLM-comfortable phrase.
- ❌ Don't drop a triple-adjective list ("clean, fast, ruthless"). Two adjectives max.
- ❌ Don't speculate beyond what the source material supports. ("Tapia bandeja into the net at game 6" is fabrication if the source didn't say it.)
- ❌ Don't pad to hit a word count. 600 dense words beats 800 padded ones.
- ❌ Don't ship before running the non-negotiables checklist.
