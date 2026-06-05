import Image from "next/image";
import Link from "next/link";
import type { Player } from "@/lib/padel-api";
import { countryFlag } from "@/lib/padel-api";

/**
 * Vamos.net v3 RankingRow — Figma-aligned ranking list row.
 *
 * Layout:
 *   [ rank# ]  [ photo + flag + name ]                     [ points ]
 *
 * Rank coloring:
 *   #1   → brand orange, larger display weight
 *   2-3  → text-primary (dark, emphasized)
 *   4+   → text-tertiary (muted)
 *
 * Compact variant trims the photo (smaller) and hides the secondary points label.
 */
export default function RankingRow({
  player,
  compact = false,
}: {
  player: Player;
  compact?: boolean;
}) {
  const flag = countryFlag(player.nationality);

  const rankColor =
    player.ranking === 1
      ? "text-brand"
      : player.ranking <= 3
      ? "text-text-primary"
      : "text-text-tertiary";

  const rankSize = compact
    ? player.ranking === 1
      ? "text-20 font-display font-bold"
      : "text-16 font-display font-semibold"
    : player.ranking === 1
    ? "text-28 font-display font-bold"
    : "text-20 font-display font-semibold";

  const photoSize = compact ? 32 : 40;

  return (
    <Link
      href={`/players/${player.id}`}
      className={[
        "group flex items-center gap-12 rounded-12 bg-bg-white transition-colors",
        compact ? "px-12 py-8" : "px-16 py-12",
        "hover:bg-bg-gray",
      ].join(" ")}
    >
      {/* Rank */}
      <div
        className={[
          "flex shrink-0 items-center justify-center tabular-nums",
          rankColor,
          rankSize,
          compact ? "w-24" : "w-32",
        ].join(" ")}
      >
        {player.ranking}
      </div>

      {/* Photo + name + flag */}
      <div className="flex min-w-0 flex-1 items-center gap-12">
        {player.photo_url ? (
          <Image
            src={player.photo_url}
            alt={player.name}
            width={photoSize}
            height={photoSize}
            className="shrink-0 rounded-full bg-bg-gray object-cover"
            style={{ width: photoSize, height: photoSize }}
          />
        ) : (
          <div
            className="flex shrink-0 items-center justify-center rounded-full bg-bg-gray font-sans text-12 font-semibold text-text-secondary"
            style={{ width: photoSize, height: photoSize }}
          >
            {(player?.name ?? "")
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "—"}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-8">
            <span
              aria-hidden="true"
              className="text-16 leading-none"
              title={player.nationality}
            >
              {flag}
            </span>
            <span className="truncate font-display text-16 font-semibold text-text-primary group-hover:text-brand">
              {player.name}
            </span>
          </div>
          {!compact && (
            <div className="mt-2 font-sans text-12 text-text-secondary">
              {player.nationality}
            </div>
          )}
        </div>
      </div>

      {/* Points */}
      <div className="shrink-0 text-right">
        <div className="font-display text-16 font-semibold tabular-nums text-text-primary">
          {player.points?.toLocaleString() ?? "—"}
        </div>
        {!compact && (
          <div className="font-sans text-12 text-text-secondary">pts</div>
        )}
      </div>
    </Link>
  );
}
