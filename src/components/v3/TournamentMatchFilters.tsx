"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * Vamos.net v3 TournamentMatchFilters — S20.
 *
 * Three-up dropdown row that scopes the schedule/results view by:
 *  - Date (YYYY-MM-DD)
 *  - Round (round_name)
 *  - Court (court name)
 *
 * Each select writes its value into the URL query (?date=...&round=...&court=...)
 * and triggers a server-side re-render via router.replace — no client state.
 *
 * "All" / "" is the unset value. Selects render nothing when there are 0–1
 * options for that facet (e.g. only one court at the venue).
 */

export type FilterOption = { value: string; label: string };

export type TournamentMatchFiltersProps = {
  dates: FilterOption[];
  rounds: FilterOption[];
  courts: FilterOption[];
  selected: { date?: string; round?: string; court?: string };
  /** Preserve current tab when navigating (schedule | results). */
  tab: string;
};

export default function TournamentMatchFilters({
  dates,
  rounds,
  courts,
  selected,
  tab,
}: TournamentMatchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: "date" | "round" | "court", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always keep the active tab pinned in the URL.
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Skip the whole row if no filters offer meaningful choice.
  const showDates = dates.length > 1;
  const showRounds = rounds.length > 1;
  const showCourts = courts.length > 1;
  if (!showDates && !showRounds && !showCourts) return null;

  return (
    <div className="mb-24 flex flex-wrap items-center gap-8">
      {showDates && (
        <Select
          ariaLabel="Filter by date"
          value={selected.date ?? ""}
          options={[{ value: "", label: "All dates" }, ...dates]}
          onChange={(v) => update("date", v)}
        />
      )}
      {showRounds && (
        <Select
          ariaLabel="Filter by round"
          value={selected.round ?? ""}
          options={[{ value: "", label: "All rounds" }, ...rounds]}
          onChange={(v) => update("round", v)}
        />
      )}
      {showCourts && (
        <Select
          ariaLabel="Filter by court"
          value={selected.court ?? ""}
          options={[{ value: "", label: "All courts" }, ...courts]}
          onChange={(v) => update("court", v)}
        />
      )}
    </div>
  );
}

function Select({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{ariaLabel}</span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full border border-border-primary bg-bg-white py-8 pl-16 pr-32 font-sans text-13 font-semibold text-text-primary transition-colors hover:bg-bg-gray focus:outline-none focus:ring-2 focus:ring-brand/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-12 h-12 w-12 text-text-secondary"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
}
