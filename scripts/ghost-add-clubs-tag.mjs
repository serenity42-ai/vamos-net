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

const TAG = {
  slug: "clubs",
  name: "Clubs",
  description: "Padel club reviews, news, and openings — the places where the game lives.",
};

const existing = await api.tags.browse({ limit: 200, fields: "slug,name" });
const found = existing.find((t) => t.slug === TAG.slug);
if (found) {
  console.log(`Tag '${TAG.slug}' already exists: ${found.name}`);
} else {
  const made = await api.tags.add(TAG);
  console.log(`CREATED  ${made.slug} -> ${made.name}`);
  console.log(`         ${made.description}`);
}

console.log("\nAll tags now in Ghost:");
const finalTags = await api.tags.browse({ limit: 200, fields: "slug,name" });
for (const t of finalTags.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`  ${t.slug.padEnd(34)} ${t.name}`);
}
