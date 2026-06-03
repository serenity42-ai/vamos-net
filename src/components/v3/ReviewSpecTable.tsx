/**
 * ReviewSpecTable (v3) — 2-column spec table for the Review variant (A2).
 *
 * Default rows for paddle reviews: Weight, Head Shape, Balance, Face.
 * Caller passes overrides via `specs`; missing values fall back to "—".
 */

export interface ReviewSpec {
  label: string;
  value: string;
}

export interface ReviewSpecTableProps {
  specs?: ReviewSpec[];
  title?: string;
}

const DEFAULT_SPECS: ReviewSpec[] = [
  { label: "Weight", value: "—" },
  { label: "Head Shape", value: "—" },
  { label: "Balance", value: "—" },
  { label: "Face", value: "—" },
];

export default function ReviewSpecTable({
  specs,
  title = "Specifications",
}: ReviewSpecTableProps) {
  const rows = specs && specs.length > 0 ? specs : DEFAULT_SPECS;

  return (
    <section
      aria-label={title}
      className="overflow-hidden rounded-32 border border-border-primary bg-bg-page"
    >
      <header className="border-b border-border-primary bg-bg-gray px-24 py-16">
        <span className="text-uppercase-eyebrow text-brand">■ {title}</span>
      </header>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.label}
              className={
                idx % 2 === 0 ? "bg-bg-page" : "bg-bg-gray"
              }
            >
              <th
                scope="row"
                className="w-1/2 px-24 py-16 text-left text-body-s-semibold text-text-secondary"
              >
                {row.label}
              </th>
              <td className="px-24 py-16 text-body-s-semibold text-text-primary">
                {row.value || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
