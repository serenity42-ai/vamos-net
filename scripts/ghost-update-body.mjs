import { readFileSync } from "node:fs";
import GhostAdminAPI from "@tryghost/admin-api";
import { marked } from "marked";

const env = readFileSync(".env.local", "utf8");
const url = env.match(/GHOST_URL=(.+)/)[1].trim();
const key = env.match(/GHOST_ADMIN_API_KEY=(.+)/)[1].trim();
const api = new GhostAdminAPI({ url, key, version: "v5.0" });

const raw = readFileSync("content/articles/brussels-p2-2026-recap.md", "utf8");
const end = raw.indexOf("\n---", 3);
const yaml = raw.slice(3, end).trim();
const body = raw.slice(end + 4).trim();
const meta = {};
for (const line of yaml.split("\n")) {
  const m = line.match(/^(\w+):\s*(.+)$/);
  if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const html = marked.parse(body);

// Fetch fresh by slug to get current updated_at
const fresh = await api.posts.read({ slug: "brussels-p2-2026-recap" });
console.log("Fetched:", fresh.id, "updated_at:", fresh.updated_at);

const result = await api.posts.edit({
  id: fresh.id,
  updated_at: fresh.updated_at,
  title: meta.title,
  custom_excerpt: meta.description?.slice(0, 300),
  meta_title: meta.title?.slice(0, 70),
  meta_description: meta.description?.slice(0, 160),
  html,
}, { source: "html" });
console.log("Updated:", result.id, "| title:", result.title);
