/**
 * tournament-photos.ts — per-tournament hero background images.
 *
 * Premier Padel / FIP events visit ~30 cities across the year. The tournament
 * banner used to be a flat gradient on dark; this module supplies a
 * recognisable landmark photo per city so the page reads as "this is happening
 * in Valencia / Rome / Doha" at a glance.
 *
 * Sources are Wikimedia Commons (CC-licensed) so we can hot-link the CDN
 * thumbnail directly — no media storage on our end, no royalties owed, and
 * resized on the fly via `?width=N`. Each entry carries the author + licence
 * for the credit line we render in the banner corner.
 *
 * Lookup key is `tournament.location` lower-cased + diacritics stripped.
 * When a tournament's city isn't in the table we fall back to the country
 * map; when even that's missing we let the banner render its CSS gradient.
 */

export type TournamentPhoto = {
  /** Direct CDN URL — Wikimedia thumb endpoint for on-the-fly resizing. */
  url: string;
  /** Where the photo was taken (used as alt text + tooltip). */
  caption: string;
  /** Photographer or uploader name. */
  credit: string;
  /** SPDX-style licence id, e.g. "CC BY-SA 3.0". */
  licence: string;
  /** Source page on Commons (linkable from the credit line). */
  source?: string;
};

/**
 * Build a Wikimedia thumb URL at a given width. The original lives at
 *   /wikipedia/commons/X/YZ/FILENAME
 * and the thumb endpoint at
 *   /wikipedia/commons/thumb/X/YZ/FILENAME/<width>px-FILENAME
 *
 * Direct hotlinks are rejected with HTTP 400 unless `width` is one of the
 * standard Wikimedia thumb widths (20, 40, 60, 120, 250, 330, 500, 960,
 * 1280, 1920, 3840). 1920 is the right default for hero banners up to 4K.
 */
function wikimediaThumb(filePath: string, width = 1920): string {
  // filePath e.g. "3/33/City_of_Arts_and_Science_-_Valencia%2C_Spain.JPG"
  const segments = filePath.split("/");
  const fileName = segments[segments.length - 1];
  const dirs = segments.slice(0, -1).join("/");
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${dirs}/${fileName}/${width}px-${fileName}`;
}

// ---------------------------------------------------------------------------
// City overrides — keyed by canonical city slug
// ---------------------------------------------------------------------------

const CITY_PHOTOS: Record<string, TournamentPhoto> = {
  valencia: {
    url: wikimediaThumb("6/6e/Valencia_Skyline.jpg"),
    caption: "Valencia skyline from the harbour",
    credit: "Mukeber",
    licence: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Valencia_Skyline.jpg",
  },
};

// ---------------------------------------------------------------------------
// Country fallbacks — when we don't have a city photo, a generic country
// landmark still beats the empty gradient.
// ---------------------------------------------------------------------------

const COUNTRY_PHOTOS: Record<string, TournamentPhoto> = {
  // intentionally empty for the first cut — populated as more events come up
};

// ---------------------------------------------------------------------------
// Canonicalisation
// ---------------------------------------------------------------------------

function canonicalSlug(input: string): string {
  return input
    .normalize("NFD")
    // strip combining diacritics
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Look up a hero photo for a tournament. Returns null when nothing is
 * configured — the banner falls back to its CSS gradient in that case.
 */
export function getTournamentPhoto(input: {
  location: string;
  country?: string;
}): TournamentPhoto | null {
  if (input.location) {
    const citySlug = canonicalSlug(input.location);
    if (CITY_PHOTOS[citySlug]) return CITY_PHOTOS[citySlug];
  }
  if (input.country) {
    const countrySlug = canonicalSlug(input.country);
    if (COUNTRY_PHOTOS[countrySlug]) return COUNTRY_PHOTOS[countrySlug];
  }
  return null;
}
