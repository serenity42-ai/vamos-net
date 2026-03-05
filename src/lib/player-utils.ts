import type { Match } from "@/lib/padel-api";

/**
 * Extract the display surname from a player's full name.
 * 
 * Spanish naming convention: FirstName Surname1 Surname2
 * For 3+ word names, the second word is typically the known surname.
 * For 2-word names, the last word is the surname.
 * 
 * Examples:
 *   "Ariana Sanchez Fallada" → "Sanchez"
 *   "Arturo Coello" → "Coello"
 *   "Claudia Jensen" → "Jensen"
 *   "Sofia Araujo" → "Araujo"
 */
export function displaySurname(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) {
    return parts[parts.length - 1];
  }
  // 3+ words: second word is typically the primary surname
  return parts[1];
}

/**
 * Get a team display name from player array.
 * Returns "Surname1 / Surname2" format.
 */
export function teamName(players: Match["players"]["team_1"]): string {
  if (!players || players.length === 0) return "TBD";
  return players.map((p) => displaySurname(p.name)).join(" / ");
}
