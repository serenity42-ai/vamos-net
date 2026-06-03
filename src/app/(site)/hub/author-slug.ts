/**
 * Lightweight slug helper used to derive author URL slugs from `Article.author`
 * strings. Lives in the hub folder because constraints forbid editing other
 * trees; the same helper is consumed by both the hub list page (linking out
 * to /hub/author/<slug>) and the author page (resolving back to the name).
 */
export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-") // non-alnum to dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
