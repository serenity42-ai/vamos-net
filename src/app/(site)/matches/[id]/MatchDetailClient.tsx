"use client";

import { useRouter } from "next/navigation";
import MatchHero from "@/components/v3/MatchHero";
import type { Match } from "@/lib/padel-api";
import type { NormalizedMatch } from "@/lib/normalize-match";

interface MatchDetailClientProps {
  match: NormalizedMatch | (Match & { displayStatus?: string });
  tournamentName?: string;
}

export default function MatchDetailClient({ match, tournamentName }: MatchDetailClientProps) {
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
      </div>
    </div>
  );
}
