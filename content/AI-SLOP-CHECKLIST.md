# AI Slop Detection & Mitigation Checklist

Based on research from "Measuring AI Slop" (arXiv:2509.19163) and our own editorial experience at Vamos.

---

## The Three Biggest Slop Signals

These are the strongest predictors of text being perceived as AI-generated slop, ranked by impact:

### 1. Low Information Density
The #1 slop signal. Too many words carrying too little meaning.

**How to detect:**
- Read each paragraph and ask: "What new information does this add?"
- If a paragraph could be deleted without the reader missing anything, it's filler
- Count the specific facts (names, numbers, dates, scores) per paragraph — if it's zero, it's probably fluff
- Watch for "setup paragraphs" that exist only to transition between ideas

**How to fix:**
- Cut the paragraph entirely, or merge its one useful sentence into the paragraph above/below
- Replace vague statements with specifics: "the sport is growing" → "padel clubs grew 22% globally in 2024"
- Target: every sentence should either deliver a fact, advance an argument, or set up the next fact
- Ideal article density: 500-700 words for a tournament recap, no more than 900 for a deep-dive

### 2. Irrelevance
Content that doesn't serve the article's purpose. Tangents, over-explained context, background nobody asked for.

**How to detect:**
- Read the headline, then read each paragraph — does it deliver on the headline's promise?
- Would a reader who already follows padel skip this paragraph? If yes, cut or compress it
- Watch for "Wikipedia syndrome" — explaining who Arturo Coello is to an audience that already knows

**How to fix:**
- Assume the reader knows the sport. Don't explain what padel is in a tournament recap
- Background context gets one sentence max, not a paragraph
- If a paragraph starts with "To understand this, we need to..." — compress whatever follows into one line

### 3. Wrong Tone
Generic, corporate, press-release energy. The voice of nobody in particular.

**How to detect:**
- Read the text out loud. Does it sound like a person talking, or a press release?
- Would The Dink, Marca, or Padel Magazine publish this sentence?
- Does every paragraph sound the same? Real writing has rhythm variation — short punchy sentences followed by longer ones
- Is the text too "balanced"? Real editorial writing has a point of view

**How to fix:**
- Have an opinion. "Augsburger played well" → "Augsburger played like someone who knows he belongs"
- Vary sentence length deliberately. Follow a long analytical sentence with a short one. "That's the point."
- Use contractions (it's, doesn't, won't) — formal writing without contractions reads robotic
- First person plural sparingly but naturally: "the question everyone's asking" not "one might wonder"

---

## Phrase Kill List

These words and phrases are AI fingerprints. Replace or delete on sight:

### Single Words
- "masterclass" → describe what actually happened
- "landscape" (non-geographic) → "scene," "field," "picture," or just cut it
- "tapestry" → never
- "delve" → "dig into" or just start the sentence differently
- "Furthermore" / "Moreover" → cut entirely, or use "and" / "also"
- "utilize" → "use"
- "facilitate" → "help" or "enable"
- "leverage" (as a verb) → "use"
- "nuanced" → be specific about what the nuance is
- "multifaceted" → never
- "comprehensive" → usually filler, cut it
- "robust" → what does this actually mean in context?

### Phrases
- "It's worth noting that..." → just say the thing
- "In terms of..." → restructure the sentence
- "At the end of the day..." → cut
- "Nothing short of..." → cut
- "A testament to..." → describe the actual evidence
- "In equal measure" → pick one or lean into one
- "Served notice" → what specifically did they do?
- "The throne holds" / "the crown is safe" → describe the actual outcome
- "Shape of things to come" → too literary, too neat
- "Only time will tell" → make a prediction or don't, but don't punt
- "It remains to be seen" → same as above
- "When all is said and done" → cut
- "[X] is here to stay" → show why, don't declare it

### Structural Patterns
- **Colon titles:** "Miami P1: The Stakes Just Got Higher" → drop the colon format entirely
- **Triple comma adjectives:** "relentless, precise, and utterly composed" → break up or cut one
- **Balanced pairs:** "composed and explosive in equal measure" → pick a side
- **The AI paragraph rhythm:** Topic sentence → supporting detail → supporting detail → concluding restatement. Real writing doesn't follow this every paragraph
- **Every paragraph starting with a different subject** → too neat. Real writing has messy flow, callbacks, continuation
- **Punchy one-liner paragraph openers:** "The player economics reflect the acceleration." / "These aren't charitable gestures." / "The numbers tell the same story." These read like bad subheadings disguised as sentences. Real writers don't start every paragraph with a standalone thesis statement. Fix: merge the setup into the first real sentence, or just delete the one-liner and let the facts open the paragraph. Example: "The player economics reflect the acceleration. Coello and Tapia each earned..." → "Coello and Tapia each earned..."
- **Ending with a question** → fine occasionally, but AI overuses rhetorical questions as closers

---

## Domain-Specific Checks

### Tournament Recaps (Tour News)
Primary slop risks: tone and density
- Every paragraph needs at least one specific match detail (score, player name, round)
- No generic "the atmosphere was electric" without describing what actually happened
- Use padel terminology naturally (chiquita, bandeja, víbora) — it's an insider knowledge signal
- Nicknames signal authenticity — use them (Golden Boys, El Lobo, Mozart, Chingalán, Perlamita)

### Business/Analytics Articles
Primary slop risks: density and relevance
- Every claim needs a number or a source
- No "the sport is experiencing unprecedented growth" without data
- Name the companies, name the amounts, name the dates
- Compare to something: "€492K in prize money" means nothing without "which is more than doubled since 2022"

### Preview/What-to-Expect Articles
Primary slop risks: irrelevance and tone
- Don't recap the entire season — focus on what matters this week
- Seedings and draw analysis should be specific, not generic "anything can happen"
- Make predictions or highlight likely matchups — don't hedge everything
- Close with a concrete detail (date, time, where to watch) not a vague teaser

---

## The Final Test

Before publishing, ask:

1. **Delete test:** Can I remove any paragraph without the article losing something? If yes, remove it.
2. **Specificity test:** Does every paragraph contain at least one proper noun, number, or direct quote? If not, it's probably filler.
3. **Voice test:** Read the opening paragraph out loud. Does it sound like a sports journalist or a corporate blog? Rewrite until it sounds human.
4. **So-what test:** After reading the whole article, can the reader answer "what did I learn?" If the answer is vague, the article lacks density.
5. **Headline test:** Does the article deliver exactly what the headline promises? No more, no less.
