import { notFound } from "next/navigation";
import {
  getMatch,
  getTournament,
  getLiveMatches,
  type LiveMatchData,
  type Tournament,
} from "@/lib/padel-api";
import { normalizeMatch, buildContext, type DisplayStatus } from "@/lib/normalize-match";
import { fetchArticles } from "@/lib/ghost";
import type { Article } from "@/data/mock";
import MatchDetailClient from "./MatchDetailClient";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const idNum = parseInt(params.id);
  if (!Number.isFinite(idNum)) return { title: "Match | VAMOS" };
  try {
    const match = await getMatch(idNum);
    const lastWord = (n: string | null | undefined) => {
      const parts = (n ?? "").trim().split(/\s+/).filter(Boolean);
      return parts.length ? parts[parts.length - 1] : "TBD";
    };
    const t1 =
      match.players.team_1.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
    const t2 =
      match.players.team_2.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
    return {
      title: `${t1} vs ${t2} | VAMOS`,
      description: `Match details, scores and stats for ${t1} vs ${t2}.`,
    };
  } catch {
    return { title: "Match | VAMOS" };
  }
}

export default async function MatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const idNum = parseInt(params.id);
  if (!Number.isFinite(idNum)) notFound();

  let match;
  try {
    match = await getMatch(idNum);
  } catch {
    notFound();
  }

  // Resolve tournament name (best effort)
  let tournament: Tournament | undefined;
  const tPath = match.connections?.tournament;
  if (tPath) {
    const tId = parseInt(tPath.split("/").pop() || "0");
    if (tId) {
      try {
        tournament = await getTournament(tId);
      } catch {
        /* ignore — tournament name is optional */
      }
    }
  }

  // Live overlay
  let liveData: LiveMatchData[] = [];
  try {
    const live = await getLiveMatches();
    liveData = live.data;
  } catch {
    /* ignore */
  }

  const today = new Date().toISOString().split("T")[0];
  const ctx = buildContext(liveData, today);
  const normalized = normalizeMatch(match, ctx);

  // S16 — News for this match: articles mentioning the tournament name.
  let relatedNews: Article[] = [];
  if (tournament?.name) {
    try {
      const all = await fetchArticles();
      const needle = tournament.name.toLowerCase();
      relatedNews = all
        .filter(
          (a) =>
            a.title.toLowerCase().includes(needle) ||
            a.excerpt.toLowerCase().includes(needle) ||
            a.body.toLowerCase().includes(needle),
        )
        .slice(0, 4);
    } catch {
      /* ignore */
    }
  }

  // ---------------------------------------------------------------------------
  // Schema.org JSON-LD
  // ---------------------------------------------------------------------------

  const lastWord = (n: string | null | undefined) => {
    const parts = (n ?? "").trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "TBD";
  };

  const t1Name =
    match.players.team_1.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
  const t2Name =
    match.players.team_2.map((p) => lastWord(p?.name)).join(" / ") || "TBD";
  const matchName = `${t1Name} vs ${t2Name}`;

  const eventStatusMap: Record<DisplayStatus | string, string> = {
    live: "https://schema.org/EventScheduled",
    finished: "https://schema.org/EventScheduled",
    cancelled: "https://schema.org/EventCancelled",
    scheduled: "https://schema.org/EventScheduled",
    walkover: "https://schema.org/EventScheduled",
    unknown: "https://schema.org/EventScheduled",
  };

  const tournamentId = tournament?.id;

  // Build location only when data is available
  const locationSchema =
    tournament?.location
      ? {
          "@type": "Place",
          name: tournament.location,
          address: {
            "@type": "PostalAddress",
            addressCountry: tournament.country,
          },
        }
      : undefined;

  // Build superEvent only when tournament is available
  const superEventSchema =
    tournament && tournamentId
      ? {
          "@type": "SportsEvent",
          name: tournament.name,
          url: `https://vamos.net/tournaments/${tournamentId}`,
        }
      : undefined;

  // Compute endDate only for finished matches with duration
  const endDateVal =
    normalized.displayStatus === "finished" && normalized.duration && normalized.played_at
      ? (() => {
          try {
            // duration is typically "HH:MM" — convert to milliseconds and add to startDate
            const parts = normalized.duration.split(":");
            const hours = parseInt(parts[0] ?? "0", 10);
            const minutes = parseInt(parts[1] ?? "0", 10);
            const start = new Date(normalized.played_at);
            if (!isNaN(start.getTime())) {
              start.setHours(start.getHours() + hours);
              start.setMinutes(start.getMinutes() + minutes);
              return start.toISOString();
            }
          } catch {
            /* ignore */
          }
          return undefined;
        })()
      : undefined;

  const descriptionVal =
    tournament
      ? `Padel match in ${tournament.name} – ${normalized.round_name}`
      : `Padel match – ${normalized.round_name}`;

  // Strip undefined / null values from schema
  function stripEmpty<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj, (_k, v) =>
      v === undefined || v === null ? undefined : v
    )) as T;
  }

  const matchSchema = stripEmpty({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: matchName,
    sport: "Padel",
    startDate: normalized.played_at,
    endDate: endDateVal,
    eventStatus: eventStatusMap[normalized.displayStatus] ?? "https://schema.org/EventScheduled",
    url: `https://vamos.net/matches/${idNum}`,
    description: descriptionVal,
    location: locationSchema,
    superEvent: superEventSchema,
    competitor: [
      {
        "@type": "SportsTeam",
        name: t1Name,
        member: match.players.team_1.map((p) => ({
          "@type": "Person",
          name: p.name,
        })),
      },
      {
        "@type": "SportsTeam",
        name: t2Name,
        member: match.players.team_2.map((p) => ({
          "@type": "Person",
          name: p.name,
        })),
      },
    ],
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vamos.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Scores",
        item: "https://vamos.net/scores",
      },
      ...(tournament
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: tournament.name,
              item: `https://vamos.net/tournaments/${tournamentId}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: matchName,
              item: `https://vamos.net/matches/${idNum}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: matchName,
              item: `https://vamos.net/matches/${idNum}`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(matchSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MatchDetailClient
        match={normalized}
        tournamentName={tournament?.name}
        relatedNews={relatedNews}
      />
    </>
  );
}
