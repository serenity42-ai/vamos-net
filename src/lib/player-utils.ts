import type { Match } from "@/lib/padel-api";

// Common surname prefixes that should be included with the next word
const SURNAME_PREFIXES = new Set(["di", "de", "da", "do", "del", "van", "von", "le", "la", "el", "al"]);

/**
 * Extract the display surname from a player's full name.
 * 
 * Spanish naming convention: FirstName Surname1 Surname2
 * For 3+ word names, the second word is typically the known surname.
 * For 2-word names, the last word is the surname.
 * Handles prefixes like "Di", "De", "Da" (e.g. "Martin Di Nenno" → "Di Nenno")
 * 
 * Examples:
 *   "Ariana Sanchez Fallada" → "Sanchez"
 *   "Martin Di Nenno" → "Di Nenno"
 *   "Fabio Da Costa Araujo" → "Da Costa"
 *   "Arturo Coello" → "Coello"
 */
export function displaySurname(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) {
    return parts[parts.length - 1];
  }
  // 3+ words: second word is typically the primary surname
  const surname = parts[1];
  // If the surname is a prefix (Di, De, Da, etc.), include the next word
  if (SURNAME_PREFIXES.has(surname.toLowerCase()) && parts.length > 2) {
    return `${surname} ${parts[2]}`;
  }
  return surname;
}

/**
 * Get a team display name from player array.
 * Returns "Surname1 / Surname2" format.
 */
export function teamName(players: Match["players"]["team_1"]): string {
  if (!players || players.length === 0) return "TBD";
  return players.map((p) => displaySurname(p.name)).join(" / ");
}
