// One-shot: create the Hub-section tags that don't exist yet in Ghost.
// Reads admin key from .env.local. Idempotent — skips tags that exist.

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

const HUB_TAGS = [
  { slug: "academy", name: "Academy", description: "How-to, technique, equipment guides — the Player's Hub Academy track." },
  { slug: "rules",   name: "Rules & Game", description: "Padel rules, scoring, court dimensions, history, glossary — the foundations of the sport." },
  { slug: "review",  name: "Reviews", description: "Equipment reviews and buyer's guides — rackets, shoes, apparel, accessories." },
  { slug: "lifestyle", name: "Lifestyle", description: "Padel beyond the court — culture, travel, food, fashion, the people of the sport." },
  { slug: "training", name: "Training", description: "Technique, drills, mindset, fuel and recovery for padel players." },
];

const existing = await api.tags.browse({ limit: 100, fields: "slug,name" });
const existingSlugs = new Set(existing.map((t) => t.slug));
console.log(`Found ${existing.length} existing tag(s) in Ghost.`);

let created = 0;
for (const t of HUB_TAGS) {
  if (existingSlugs.has(t.slug)) {
    console.log(`  skip   ${t.slug} (already exists)`);
    continue;
  }
  try {
    const made = await api.tags.add({
      slug: t.slug,
      name: t.name,
      description: t.description,
    });
    console.log(`  CREATE ${made.slug.padEnd(12)} -> ${made.name}`);
    created += 1;
  } catch (e) {
    console.log(`  FAIL   ${t.slug}: ${e.message}`);
  }
}

console.log(`\nCreated ${created} new tag(s).`);

// Final state
const finalTags = await api.tags.browse({ limit: 100, fields: "slug,name" });
console.log(`\nAll tags now in Ghost (${finalTags.length}):`);
for (const t of finalTags.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`  ${t.slug.padEnd(34)} ${t.name}`);
}
