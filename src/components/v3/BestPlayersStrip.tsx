import Image from "next/image";
import Link from "next/link";
import { countryFlag } from "@/lib/padel-api";

/**
 * Vamos.net v3 BestPlayersStrip — S18.
 *
 * Horizontal-scroll strip of the top-ranked players competing at a tournament.
 * Renders one card per player: photo (or fallback initial), name, ranking,
 * nationality flag. Click → player profile.
 *
 * Renders nothing if `players` is empty so the page collapses cleanly when
 * data is missing (early-round tournaments without rankings, FIP events, etc).
 */

export type BestPlayer = {
  id: number;
  name: string;
  photoUrl: string | null;
  ranking: number | null;
  nationality: string | null;
};

export default function BestPlayersStrip({
  players,
  title = "Best players",
}: {
  players: BestPlayer[];
  title?: string;
}) {
  if (!players.length) return null;

  return (
    <section aria-labelledby="best-players-heading" className="mt-24">
      <div className="mb-12 flex items-baseline justify-between px-16 sm:px-0">
        <h2
          id="best-players-heading"
          className="font-display text-16 font-bold uppercase tracking-[0.04em] text-text-primary"
        >
          {title}
        </h2>
      </div>
      <div
        className="-mx-16 flex gap-12 overflow-x-auto px-16 pb-8 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {players.map((p) => (
          <Link
            key={p.id}
            href={`/players/${p.id}`}
            className="group flex w-[140px] shrink-0 flex-col items-center rounded-16 border border-border-primary bg-bg-white p-12 transition-colors hover:bg-bg-gray"
          >
            <div className="relative mb-8 h-72 w-72 overflow-hidden rounded-full border border-border-primary bg-bg-gray">
              {p.photoUrl ? (
                <Image
                  src={p.photoUrl}
                  alt={p.name}
                  fill
                  sizes="72px"
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-24 font-bold text-text-secondary">
                  {p.name.charAt(0).toUpperCase()}
                </div>
              )}
              {p.ranking != null && (
                <span
                  className="absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-brand px-[6px] font-sans text-11 font-bold leading-none text-text-contrast"
                  aria-label={`Ranking ${p.ranking}`}
                >
                  #{p.ranking}
                </span>
              )}
            </div>
            <p className="line-clamp-2 text-center font-display text-13 font-semibold leading-tight text-text-primary group-hover:text-brand">
              {p.name}
            </p>
            {p.nationality && (
              <p className="mt-4 text-center font-sans text-12 text-text-secondary">
                <span aria-hidden="true">{countryFlag(p.nationality)}</span>{" "}
                <span>{p.nationality.toUpperCase()}</span>
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
