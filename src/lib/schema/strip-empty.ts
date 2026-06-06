/**
 * Recursively remove undefined / null values from a schema object so the
 * resulting JSON-LD is clean and doesn't include extraneous null fields.
 *
 * Reused across matches, hub article, and any future schema injection points.
 */
export function stripEmpty<T extends object>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => (v === undefined || v === null ? undefined : v))
  ) as T;
}
