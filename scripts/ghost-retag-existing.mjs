// Retag the 14 existing news/recap posts in Ghost. They were imported Apr 21
// without primary tags. Apply 'tour-news' as default since they're all
// tournament recaps, previews, or opinion pieces.

import { readFileSync } from "node:fs";
import GhostAdminAPI from "@tryghost/admin-api";

const env = Object.fromEntries(
  readFileSync("./.env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const api = new GhostAdminAPI({
  url: env.GHOST_URL,
  key: env.GHOST_ADMIN_API_KEY,
  version: "v5.0",
});

// Curated retag map for the 14 existing posts based on content.
// Slugs are from the inspect output earlier today.
const RETAG = {
  "miami-p1-finals-2026":          ["tour-news"],
  "miami-p1-2026-semifinal-preview": ["tour-news"],
  "miami-p1-2026-preview":          ["tour-news"],
  "augsburger-galan-feud-explained": ["tour-news"],
  "padel-big-money-2026":           ["business"],
  "uk-padel-growth-2026":           ["business", "lifestyle"],
  "opinion-ppl-15-million-padel":   ["business"],
  "cancun-p2-2026-recap":           ["tour-news"],
  "premier-padel-miami-p1-preview": ["tour-news"],
  "coello-tapia-win-riyadh-p1-2026": ["tour-news"],
  "galan-chingotto-new-partnership-2026": ["tour-news"],
  "padel-2026-new-partnerships-guide":    ["tour-news", "business"],
  "triay-brea-dominate-womens-tour":      ["tour-news"],
  "padel-fastest-growing-sport-2026":     ["business"],
};

const PRETTY = {
  rules: "Rules & Game",
  review: "Reviews",
  business: "Business",
  lifestyle: "Lifestyle",
  training: "Training",
  academy: "Academy",
  rankings: "Rankings",
  "tour-news": "Tour News",
  news: "News",
};

const posts = await api.posts.browse({
  limit: "all",
  fields: "id,slug,status,updated_at",
});

let retagged = 0;
let skipped = 0;
let failed = 0;

for (const slug of Object.keys(RETAG)) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    console.log(`[SKIP]  ${slug} (not found in Ghost)`);
    skipped += 1;
    continue;
  }

  const tagSlugs = RETAG[slug];
  const tags = tagSlugs.map((s) => ({ slug: s, name: PRETTY[s] || s }));

  try {
    await api.posts.edit({
      id: post.id,
      updated_at: post.updated_at,
      tags,
    });
    console.log(`[RETAG] ${slug.padEnd(42)} -> ${tagSlugs.join(", ")}`);
    retagged += 1;
  } catch (e) {
    console.log(`[FAIL]  ${slug.padEnd(42)} ${e.message?.slice(0, 200)}`);
    failed += 1;
  }
}

console.log(`\nSummary: retagged=${retagged}, skipped=${skipped}, failed=${failed}`);
