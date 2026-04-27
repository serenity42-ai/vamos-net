// Cleanup: remove the two hash-import-* tags that Ghost's bulk import
// auto-created. They're internal housekeeping and clutter the Tags UI.

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

const tags = await api.tags.browse({ limit: 200, fields: "id,slug,name" });
const hashTags = tags.filter((t) => t.slug.startsWith("hash-import-"));
console.log(`Found ${hashTags.length} hash-import tag(s) to delete.`);

for (const t of hashTags) {
  try {
    await api.tags.delete({ id: t.id });
    console.log(`  deleted  ${t.slug}`);
  } catch (e) {
    console.log(`  failed   ${t.slug}: ${e.message}`);
  }
}

const finalTags = await api.tags.browse({ limit: 100, fields: "slug,name" });
console.log(`\nFinal tag list (${finalTags.length}):`);
for (const t of finalTags.sort((a, b) => a.slug.localeCompare(b.slug))) {
  console.log(`  ${t.slug.padEnd(20)} ${t.name}`);
}
