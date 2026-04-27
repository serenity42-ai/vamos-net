// Dry-run: parse content/articles/*.md, apply editorial polish pass, and
// print what *would* be uploaded to Ghost. Does not touch Ghost.
//
// Run: node scripts/ghost-upload-dryrun.mjs

import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const ARTICLES_DIR = "./content/articles";
const MAPPING = JSON.parse(readFileSync("./scripts/article-mapping.json", "utf8"));

/**
 * Parse YAML frontmatter + markdown body. Tiny custom parser; we only need
 * `title`, `description`, `date`, `keywords` from the frontmatter and the body.
 */
function parseArticle(raw) {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: raw };
  const yaml = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const meta = {};
  for (const line of yaml.split("\n")) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!m) continue;
    let value = m[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""));
    }
    meta[m[1]] = value;
  }
  return { meta, body };
}

/**
 * Light editorial polish per WRITING-INSTRUCTIONS / AI-SLOP-CHECKLIST.
 * This pass is intentionally conservative: no opening rewrites yet (those
 * are per-article and need human judgment). It only:
 *   - normalises double-hyphen "--" pseudo-em-dashes to commas / parentheses
 *     based on heuristic context (most are parenthetical, so use parens)
 *   - flags banned words/phrases for review (does NOT silently rewrite them)
 *   - flags signposting phrases
 *   - reports openings repetition and length variance metrics
 */

const BANNED = [
  // Single words
  "compelling", "comprehensive", "robust", "vibrant", "crucial", "pivotal",
  "groundbreaking", "transformative", "seamless", "seamlessly", "ever-evolving",
  "multifaceted", "delve", "harness", "leverage", "unlock", "unleash",
  "utilize", "foster", "facilitate", "empower", "streamline",
  // Metaphor nouns
  "tapestry", "ecosystem", "paradigm",
  // Phrases
  "in equal measure", "a testament to", "nothing short of",
  "it's worth noting", "it is worth noting",
  "in today's", "in an era of", "when it comes to",
  "masterclass", "served notice",
];

const SIGNPOSTING = [
  "in this section", "as mentioned earlier", "as we've seen", "as we've explored",
  "now that we've", "let's dive into", "let's explore", "first,", "secondly,", "finally,",
];

function polishReport(body) {
  const text = body.toLowerCase();
  const issues = [];

  // Em-dash overuse (pseudo or real)
  const fakeEmDashes = (body.match(/--/g) || []).length;
  const realEmDashes = (body.match(/—/g) || []).length;
  const totalEm = fakeEmDashes + realEmDashes;
  if (totalEm > 6) {
    issues.push(`em-dash overuse: ${totalEm} occurrences (target ≤ 6 per piece)`);
  }

  // Banned-word hits
  const bannedHits = [];
  for (const w of BANNED) {
    const re = new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\\]{}]/g, "\\$&")}\\b`, "gi");
    const matches = body.match(re);
    if (matches && matches.length > 0) bannedHits.push(`${w}×${matches.length}`);
  }
  if (bannedHits.length) issues.push(`banned: ${bannedHits.join(", ")}`);

  // Signposting hits
  const signHits = [];
  for (const p of SIGNPOSTING) {
    if (text.includes(p)) signHits.push(p);
  }
  if (signHits.length) issues.push(`signposting: ${signHits.join(" | ")}`);

  // Sentence length variance — read body, strip headings/code, split on .!?
  const prose = body
    .split("\n")
    .filter((l) => !l.startsWith("#") && !l.startsWith("```") && l.trim().length > 0)
    .join(" ");
  const sentences = prose
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 5);
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  const stdev = Math.sqrt(
    lengths.map((l) => (l - avg) ** 2).reduce((a, b) => a + b, 0) / lengths.length
  );
  const shortPct = Math.round(
    (lengths.filter((l) => l < 8).length / lengths.length) * 100
  );
  const longPct = Math.round(
    (lengths.filter((l) => l > 30).length / lengths.length) * 100
  );

  // Openings — first 3 words of each sentence
  const openings = sentences.map((s) =>
    s.split(/\s+/).slice(0, 3).join(" ").toLowerCase()
  );
  const openingCounts = {};
  for (const o of openings) openingCounts[o] = (openingCounts[o] || 0) + 1;
  const repeatedOpenings = Object.entries(openingCounts)
    .filter(([_, n]) => n >= 3)
    .map(([o, n]) => `"${o}"×${n}`);
  if (repeatedOpenings.length) {
    issues.push(`repeated openings: ${repeatedOpenings.slice(0, 3).join(", ")}`);
  }

  return {
    sentences: sentences.length,
    avgWords: avg,
    stdev: Math.round(stdev * 10) / 10,
    shortPct,
    longPct,
    fakeEmDashes,
    realEmDashes,
    issues,
  };
}

// ---- main ----

const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
console.log(`Found ${files.length} markdown article(s) in ${ARTICLES_DIR}\n`);

const summary = [];
for (const f of files) {
  const slug = basename(f, ".md");
  const raw = readFileSync(join(ARTICLES_DIR, f), "utf8");
  const { meta, body } = parseArticle(raw);
  const map = MAPPING[slug];
  const wordCount = body.split(/\s+/).filter((w) => w.length > 0).length;
  const report = polishReport(body);

  console.log("─".repeat(78));
  console.log(`SLUG:        ${slug}`);
  console.log(`TITLE:       ${meta.title || "(no title in frontmatter)"}`);
  console.log(`PRIMARY TAG: ${map?.primary || "** UNMAPPED **"}`);
  console.log(`SECONDARY:   ${(map?.secondary || []).join(", ") || "(none)"}`);
  console.log(`HUB:         ${map?.hubSection || "(not on hub)"}`);
  console.log(`STATUS:      ${map?.alreadyInGhost ? "already in Ghost — skip upload, just retag" : "TO UPLOAD as draft"}`);
  console.log(`WORDS:       ${wordCount}`);
  console.log(`SENTENCES:   ${report.sentences}  | avg ${report.avgWords}w  | stdev ${report.stdev}  | <8w ${report.shortPct}%  | >30w ${report.longPct}%`);
  console.log(`EM-DASHES:   --: ${report.fakeEmDashes}  |  —: ${report.realEmDashes}`);
  if (report.issues.length === 0) {
    console.log(`POLISH:      ✓ no obvious issues`);
  } else {
    for (const i of report.issues) console.log(`POLISH:      ⚠ ${i}`);
  }
  summary.push({
    slug,
    primary: map?.primary,
    hub: map?.hubSection,
    status: map?.alreadyInGhost ? "retag" : "upload",
    words: wordCount,
    issues: report.issues.length,
  });
}

console.log("\n" + "═".repeat(78));
console.log("BATCH SUMMARY");
console.log("═".repeat(78));
const byStatus = summary.reduce((acc, a) => {
  acc[a.status] = (acc[a.status] || 0) + 1;
  return acc;
}, {});
const byHub = summary.reduce((acc, a) => {
  const k = a.hub || "(no hub)";
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});
const totalWords = summary.reduce((a, b) => a + b.words, 0);
const totalIssues = summary.reduce((a, b) => a + b.issues, 0);
console.log(`Articles:        ${summary.length}`);
console.log(`Total words:     ${totalWords.toLocaleString()}`);
console.log(`Polish issues:   ${totalIssues} flag(s) across ${summary.filter((a) => a.issues > 0).length} article(s)`);
console.log(`By status:       ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(", ")}`);
console.log(`By hub section:`);
for (const [k, v] of Object.entries(byHub).sort()) console.log(`  ${k.padEnd(20)} ${v}`);
console.log("\nTo execute the real upload, run scripts/ghost-upload.mjs (not yet built).");
