import Image from "next/image";
import Link from "next/link";
import type { Player } from "@/lib/padel-api";
import { countryFlag } from "@/lib/padel-api";

/**
 * Editorial ranking row. Hairline border, mono rank + points,
 * Archivo name. Top-3 rank colored red per brand rules.
 */
export default function RankingRow({
  player,
  compact,
}: {
  player: Player;
  compact?: boolean;
}) {
  const flag = countryFlag(player.nationality);

  return (
    <tr
      style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      className="transition-colors hover:bg-[var(--paper-2)]"
    >
      <td style={{ padding: "12px 16px", textAlign: "center", width: 56 }}>
        <span
          className="score-mono"
          style={{
            fontSize: 15,
            color: player.ranking <= 3 ? "var(--red)" : "var(--ink)",
          }}
        >
          {player.ranking}
        </span>
      </td>
      <td style={{ padding: "12px 8px" }}>
        <Link href={`/players/${player.id}`} className="flex items-center gap-3 group">
          {player.photo_url && !compact ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover shrink-0"
              style={{ background: "var(--paper-2)" }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "var(--paper-2)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--mute)",
              }}
            >
              {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <span
              className="block truncate transition-colors"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              {player.name}
            </span>
            {!compact && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "var(--mute)",
                }}
              >
                {flag} {player.nationality}
              </span>
            )}
          </div>
        </Link>
      </td>
      {!compact && (
        <td style={{ padding: "12px 8px" }} className="hidden sm:table-cell">
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--mute)",
            }}
          >
            {flag} {player.nationality}
          </span>
        </td>
      )}
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        <span className="score-mono" style={{ fontSize: 13, color: "var(--ink)" }}>
          {player.points?.toLocaleString() ?? "—"}
        </span>
      </td>
    </tr>
  );
}
