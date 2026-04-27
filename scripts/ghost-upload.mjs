// Upload polished SEO articles from content/articles/*.md to Ghost as drafts.
//
// For each markdown file:
//   1. Parse YAML frontmatter (title, description, date, keywords)
//   2. Convert markdown body to HTML (skipping the H1 — Ghost uses post.title)
//   3. Look up slug in article-mapping.json for tags + hub section
//   4. Upload to Ghost as a DRAFT, primary tag first, then secondary tags
//   5. miami-p1-finals-2026 is already in Ghost: retag instead of reupload
//
// Run: node scripts/ghost-upload.mjs           (dry: false by default)
//      node scripts/ghost-upload.mjs --dry     (preview without writing)
//      node scripts/ghost-upload.mjs --only=what-is-padel    (one slug)

import { readFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import GhostAdminAPI from "@tryghost/admin-api";
import { marked } from "marked";

// ---- env ----
const env = Object.fromEntries(
  readFileSync("./.env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

// ---- args ----
const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.replace("--only=", "") : null;

// ---- ghost client ----
const api = new GhostAdminAPI({
  url: env.GHOST_URL,
  key: env.GHOST_ADMIN_API_KEY,
  version: "v5.0",
});

// ---- mapping ----
const MAPPING = JSON.parse(readFileSync("./scripts/article-mapping.json", "utf8"));

// ---- markdown parsing ----
function parseFrontmatter(raw) {
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
 * Strip the leading H1 from the markdown body. Ghost uses post.title for the
 * H1 in its rendering, so duplicating the H1 in the body produces two titles.
 */
function stripLeadingH1(md) {
  return md.replace(/^#\s+.+\n+/, "");
}

function mdToHtml(md) {
  // Keep the marked output simple; Ghost handles its own typography.
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(stripLeadingH1(md));
}

// ---- existing posts ----
const existingPosts = await api.posts.browse({
  limit: "all",
  fields: "id,slug,title,status",
  filter: "status:[draft,published]",
});
const bySlug = new Map(existingPosts.map((p) => [p.slug, p]));
console.log(`Ghost has ${existingPosts.length} existing post(s).`);

// ---- collect articles ----
const ARTICLES_DIR = "./content/articles";
const files = readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => !ONLY || basename(f, ".md") === ONLY);

console.log(
  `Processing ${files.length} markdown article(s). Mode: ${DRY ? "DRY-RUN" : "LIVE"}\n`
);

let created = 0;
let updated = 0;
let skipped = 0;
let failed = 0;

for (const f of files) {
  const slug = basename(f, ".md");
  const map = MAPPING[slug];

  if (!map) {
    console.log(`[SKIP]   ${slug.padEnd(42)} (no mapping entry)`);
    skipped += 1;
    continue;
  }

  const raw = readFileSync(join(ARTICLES_DIR, f), "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const title = meta.title || slug;
  const excerpt = meta.description || "";
  const html = mdToHtml(body);

  // Build tags array. Primary tag first; Ghost treats first as primary.
  const tagSlugs = [map.primary, ...(map.secondary || [])].filter(Boolean);
  const tags = tagSlugs.map((s) => ({ slug: s, name: tagSlugForName(s) }));

  const existing = bySlug.get(slug);
  const isAlreadyInGhost = !!existing;

  if (DRY) {
    console.log(
      `[DRY]    ${slug.padEnd(42)} ${isAlreadyInGhost ? "RETAG" : "CREATE"}  tags=[${tagSlugs.join(",")}]  title="${title.slice(0, 50)}..."`
    );
    continue;
  }

  try {
    if (isAlreadyInGhost) {
      // Retag only — don't overwrite the published post body.
      const updatedPost = await api.posts.edit({
        id: existing.id,
        // Required: Ghost requires updated_at to prevent concurrent edits.
        updated_at: existing.updated_at || new Date().toISOString(),
        tags,
      });
      console.log(`[RETAG]  ${slug.padEnd(42)} status=${updatedPost.status}, tags=${tagSlugs.join(",")}`);
      updated += 1;
    } else {
      const newPost = await api.posts.add(
        {
          title,
          slug,
          html,
          custom_excerpt: excerpt.slice(0, 300) || undefined,
          meta_title: title.slice(0, 70),
          meta_description: excerpt.slice(0, 160) || undefined,
          status: "draft",
          tags,
        },
        { source: "html" }
      );
      console.log(`[CREATE] ${slug.padEnd(42)} id=${newPost.id}, tags=${tagSlugs.join(",")}`);
      created += 1;
    }
  } catch (e) {
    console.log(`[FAIL]   ${slug.padEnd(42)} ${e.message?.slice(0, 200)}`);
    if (e.context) console.log(`         context: ${e.context.slice(0, 200)}`);
    if (e.details) console.log(`         details: ${JSON.stringify(e.details).slice(0, 200)}`);
    failed += 1;
  }
}

console.log("\n" + "═".repeat(70));
console.log(`Summary: created=${created}, retagged=${updated}, skipped=${skipped}, failed=${failed}`);
if (DRY) console.log("(DRY-RUN — no changes were written to Ghost.)");

function tagSlugForName(slug) {
  // Ghost tags can be created on-the-fly by passing {name}. We pass slug too
  // so the API resolves to existing tags by slug rather than creating duplicates.
  // Pretty names for any tags we created earlier.
  const pretty = {
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
  return pretty[slug] || slug;
}
