import Link from "next/link";
import type { Tournament } from "@/lib/padel-api";

/**
 * QuickLinks — homepage right-rail block.
 *
 * Spec (Figma annotation, Homepage / 350:19404):
 *   "Список быстрых ссылок на турниры/лиги. Показываем список активных туров
 *    с количеством активных турниров. Порядок туров управляется в CMS по
 *    приоритету / активности. Клик по туру → страница с расписанием/календарем
 *    турниров."
 *
 * Implementation:
 *  - Derive tour aggregates from the tournament list (Premier Padel / FIP / etc.)
 *  - Show each tour with the number of currently-live tournaments
 *  - Hard-coded priority for v1 (no CMS yet); falls back gracefully if data is empty
 */

type Tour = {
  name: string;
  href: string;
  match: (t: Tournament) => boolean;
};

const TOURS: Tour[] = [
  {
    name: "Premier Padel",
    href: "/tournaments?tour=premier-padel",
    match: (t) =>
      /premier\s*padel/i.test(t.name) ||
      (t as unknown as { tour?: string }).tour === "premier-padel",
  },
  {
    name: "Cupra FIP Tour",
    href: "/tournaments?tour=fip",
    match: (t) =>
      /\bfip\b/i.test(t.name) || /cupra/i.test(t.name) ||
      (t as unknown as { tour?: string }).tour === "fip",
  },
  {
    name: "Hexagon Cup",
    href: "/tournaments?tour=hexagon",
    match: (t) => /hexagon/i.test(t.name),
  },
  {
    name: "A1 Padel",
    href: "/tournaments?tour=a1",
    match: (t) => /\ba1\s*padel\b/i.test(t.name),
  },
];

export interface QuickLinksProps {
  tournaments: Tournament[];
  title?: string;
}

export default function QuickLinks({ tournaments, title = "Quick Links" }: QuickLinksProps) {
  // Count active (live + upcoming-this-month) tournaments per tour
  const counts = new Map<string, number>();
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  for (const t of tournaments) {
    const isActive =
      t.status === "live" ||
      (t.status === "pending" && new Date(t.start_date) <= endOfMonth);
    if (!isActive) continue;
    for (const tour of TOURS) {
      if (tour.match(t)) {
        counts.set(tour.name, (counts.get(tour.name) ?? 0) + 1);
        break;
      }
    }
  }

  const items = TOURS.map((tour) => ({
    name: tour.name,
    href: tour.href,
    count: counts.get(tour.name) ?? 0,
  }));

  // Hide block entirely if nothing matched (defensive)
  if (items.every((i) => i.count === 0)) return null;

  return (
    <section
      className="bg-bg-white rounded-24 p-20"
      aria-labelledby="quicklinks-title"
    >
      <h3
        id="quicklinks-title"
        className="text-uppercase-eyebrow text-text-secondary mb-16"
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-12 rounded-12 px-12 py-12 transition-colors hover:bg-bg-gray"
            >
              <span className="text-title-m text-text-primary">{item.name}</span>
              {item.count > 0 && (
                <span
                  className="inline-flex items-center justify-center rounded-full bg-brand text-text-contrast"
                  style={{
                    minWidth: 24,
                    height: 24,
                    paddingLeft: 8,
                    paddingRight: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  {item.count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
