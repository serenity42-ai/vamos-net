/**
 * WhereToBuyList (v3) — multi-shop affiliate list for Review variant (A4).
 *
 * Renders a "Where to Buy [product]" block with one row per shop:
 *   logo · shop name · price-from · rating · arrow button (external)
 *
 *  - Hides itself entirely when `shops` is empty
 *  - v1: caller passes placeholder shops with an `eyebrow` like "Coming soon"
 *    so the structure is visible without misleading data
 */

import Image from "next/image";
import Link from "next/link";

export interface Shop {
  name: string;
  logoUrl?: string;
  priceFrom?: string;
  rating?: number;
  url: string;
}

export interface WhereToBuyListProps {
  productName: string;
  shops: Shop[];
  eyebrow?: string;
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 15L15 5M15 5H7M15 5v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1l2.16 4.38 4.84.7-3.5 3.42.83 4.82L8 12.05 3.67 14.32l.83-4.82L1 6.08l4.84-.7L8 1z" />
    </svg>
  );
}

export default function WhereToBuyList({
  productName,
  shops,
  eyebrow,
}: WhereToBuyListProps) {
  if (!shops || shops.length === 0) return null;

  return (
    <section
      aria-label={`Where to buy ${productName}`}
      className="overflow-hidden rounded-32 border border-border-primary bg-bg-page"
    >
      <header className="flex flex-wrap items-center justify-between gap-12 border-b border-border-primary bg-bg-gray px-24 py-20">
        <div className="flex flex-col gap-4">
          {eyebrow && (
            <span className="text-uppercase-eyebrow text-brand">
              ■ {eyebrow}
            </span>
          )}
          <h3 className="text-title-m text-text-primary">
            Where to Buy {productName}
          </h3>
        </div>
      </header>
      <ul className="divide-y divide-border-primary">
        {shops.map((shop) => (
          <li key={shop.name}>
            <Link
              href={shop.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-16 px-24 py-16 transition-colors hover:bg-bg-gray"
            >
              <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-16 bg-bg-gray">
                {shop.logoUrl ? (
                  <Image
                    src={shop.logoUrl}
                    alt={`${shop.name} logo`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-body-s-semibold text-text-secondary">
                    {shop.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-body-s-semibold text-text-primary">
                  {shop.name}
                </span>
                <div className="flex flex-wrap items-center gap-12 text-body-s text-text-secondary">
                  {shop.priceFrom && <span>Price from {shop.priceFrom}</span>}
                  {typeof shop.rating === "number" && (
                    <span className="inline-flex items-center gap-4 text-brand">
                      <StarIcon />
                      <span>{shop.rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>
              </div>
              <span
                aria-hidden
                className="flex h-40 w-40 items-center justify-center rounded-full bg-bg-gray text-text-primary transition-colors group-hover:bg-brand group-hover:text-text-contrast"
              >
                <ArrowIcon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
