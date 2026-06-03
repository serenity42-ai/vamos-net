"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MatchHero from "@/components/v3/MatchHero";
import type { Match } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";
import type { Article } from "@/data/mock";

interface MatchDetailClientProps {
  match: NormalizedMatch | (Match & { displayStatus?: string });
  tournamentName?: string;
  relatedNews?: Article[];
}

// ---------------------------------------------------------------------------
// S14 — Where to Watch chips
// ---------------------------------------------------------------------------

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77c.27-1.57.4-3.18.4-4.8a26.2 26.2 0 0 0-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.39 8.44L23 22h-6.81l-5.34-6.95L4.84 22H1.58l7.91-9.03L1 2h6.96l4.82 6.37L18.24 2zm-1.19 18h1.84L7.05 4H5.1l11.95 16z" />
    </svg>
  );
}

function TwitchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 3h18v12l-4 4h-4l-2 2H8v-2H3V3zm2 2v12h4v2l2-2h4l3-3V5H5zm6 2h2v6h-2V7zm5 0h2v6h-2V7z" />
    </svg>
  );
}

function PremierIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 9h4a3 3 0 1 1 0 6H8V9zm0 0v9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface WatchChip {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  brandClass: string;
}

const DEFAULT_WATCH_CHIPS: WatchChip[] = [
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@PremierPadel",
    icon: <YouTubeIcon />,
    brandClass: "bg-bg-white text-text-primary",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/PremierPadel",
    icon: <XIcon />,
    brandClass: "bg-bg-constant text-text-contrast",
  },
  {
    id: "twitch",
    label: "Twitch",
    href: "https://www.twitch.tv/premierpadel",
    icon: <TwitchIcon />,
    brandClass: "bg-bg-white text-text-primary",
  },
  {
    id: "premier",
    label: "Premier Padel TV",
    href: "https://premierpadel.com",
    icon: <PremierIcon />,
    brandClass: "bg-brand text-text-contrast",
  },
];

function WhereToWatchSection() {
  return (
    <section>
      <h2 className="font-display text-title-l font-semibold text-text-primary mb-12 uppercase">
        Where to watch
      </h2>
      <div className="rounded-16 border border-border-primary bg-bg-white p-24">
        <div className="flex flex-wrap items-center gap-16">
          {DEFAULT_WATCH_CHIPS.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-8 group"
              aria-label={c.label}
            >
              <span
                className={[
                  "inline-flex h-56 w-56 items-center justify-center rounded-full border border-border-primary transition-transform group-hover:scale-105",
                  c.brandClass,
                ].join(" ")}
              >
                {c.icon}
              </span>
              <span className="font-sans text-12 font-semibold text-text-secondary group-hover:text-text-primary">
                {c.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// S16 — News for this match
// ---------------------------------------------------------------------------

function NewsForMatchSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section>
      <h2 className="font-display text-title-l font-semibold text-text-primary mb-12 uppercase">
        News for this match
      </h2>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/news/${a.slug}`}
            className="rounded-16 border border-border-primary bg-bg-white overflow-hidden hover:bg-bg-gray transition-colors flex"
          >
            {a.imageUrl && (
              <div className="relative shrink-0 w-96 h-96 bg-bg-gray">
                <Image
                  src={a.imageUrl}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-12 min-w-0 flex-1">
              <p className="font-sans text-12 font-semibold text-brand uppercase tracking-[0.04em] truncate">
                {a.category}
              </p>
              <h3 className="font-display text-title-s text-text-primary line-clamp-2 mt-4">
                {a.title}
              </h3>
              <p className="font-sans text-12 text-text-secondary mt-4">
                {new Date(a.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------

export default function MatchDetailClient({
  match,
  tournamentName,
  relatedNews = [],
}: MatchDetailClientProps) {
  const router = useRouter();

  return (
    <div className="bg-bg-page min-h-screen">
      {/* Hero */}
      <MatchHero
        // MatchHero expects the v3 Match shape; NormalizedMatch extends Match
        match={match as Match}
        tournamentName={tournamentName}
        onBack={() => router.back()}
      />

      <div className="mx-auto max-w-[1320px] px-16 py-32 sm:px-24 lg:px-32 space-y-32">
        {/* Statistics */}
        <section>
          <h2 className="font-display text-title-l font-semibold text-text-primary mb-12">
            STATISTICS
          </h2>
          <div className="rounded-16 border border-border-primary bg-bg-white p-24">
            <p className="font-sans text-14 text-text-secondary">
              Match statistics — Coming soon.
            </p>
          </div>
        </section>

        {/* Head-to-head */}
        <section>
          <h2 className="font-display text-title-l font-semibold text-text-primary mb-12">
            HEAD-TO-HEAD
          </h2>
          <div className="rounded-16 border border-border-primary bg-bg-white p-24">
            <p className="font-sans text-14 text-text-secondary">
              Head-to-head history — Coming soon.
            </p>
          </div>
        </section>

        {/* S14 — Where to Watch */}
        <WhereToWatchSection />

        {/* S16 — News for this match */}
        <NewsForMatchSection articles={relatedNews} />
      </div>
    </div>
  );
}
