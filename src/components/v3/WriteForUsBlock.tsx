import Link from "next/link";

/**
 * WriteForUsBlock — editorial recruitment CTA injected mid-feed (PH6).
 *
 * Compact card that fits a single column slot in the hub grid. Pushes
 * potential contributors to the about/contact page. Uses bg-bg-gray so it
 * sits as a quiet break between content cards, with a brand-orange CTA.
 */
export default function WriteForUsBlock({
  href = "/about#contribute",
}: {
  href?: string;
}) {
  return (
    <div className="flex h-full flex-col gap-12 rounded-32 bg-bg-gray p-24">
      <span className="text-uppercase-eyebrow text-brand">
        ■ Write for us
      </span>
      <h3 className="text-title-l text-text-primary">
        Have a padel story to tell?
      </h3>
      <p className="text-body-s text-text-secondary">
        Pitch us your feature, review, or guide. We pay for great editorial.
      </p>
      <Link
        href={href}
        className="mt-auto inline-flex w-fit items-center justify-center rounded-full bg-brand px-20 py-12 text-body-s-semibold text-text-contrast transition-opacity hover:opacity-90"
      >
        Get in touch →
      </Link>
    </div>
  );
}
