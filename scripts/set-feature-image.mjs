// One-off: upload a local image to Ghost and set it as a post's feature image.
// Run: node scripts/set-feature-image.mjs <postId> <localImagePath> ["alt text"]
import { readFileSync } from "node:fs";
import GhostAdminAPI from "@tryghost/admin-api";

const env = Object.fromEntries(
  readFileSync("./.env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const [postId, imgPath, alt] = process.argv.slice(2);
if (!postId || !imgPath) { console.error("usage: node scripts/set-feature-image.mjs <postId> <imagePath> [alt]"); process.exit(1); }

const api = new GhostAdminAPI({ url: env.GHOST_URL, key: env.GHOST_ADMIN_API_KEY, version: "v5.0" });

const uploaded = await api.images.upload({ file: imgPath });
console.log("uploaded image url:", uploaded.url);

const existing = await api.posts.read({ id: postId }, { fields: "id,updated_at,status,slug" });
const edited = await api.posts.edit({
  id: postId,
  updated_at: existing.updated_at,
  feature_image: uploaded.url,
  feature_image_alt: (alt || "").slice(0, 125) || undefined,
});
console.log(`feature image set on ${edited.slug} (status=${edited.status})`);
