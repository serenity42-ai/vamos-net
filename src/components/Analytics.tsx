import Script from "next/script";

/**
 * Privacy-friendly analytics (§7.1) — Plausible, opt-in via env var.
 *
 * Configure:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN  e.g. "vamos.net"
 *   NEXT_PUBLIC_PLAUSIBLE_SRC     optional override, e.g.
 *                                 "https://plausible.io/js/script.outbound-links.js"
 *
 * When PLAUSIBLE_DOMAIN is unset, the component renders nothing — useful for
 * preview deployments where you don't want to pollute production analytics.
 *
 * Why Plausible:
 *  - cookieless, no consent banner needed
 *  - EU-hosted
 *  - simple custom-event API (window.plausible('event_name', { props }))
 *
 * Switching to Fathom or GA4 later: add a sibling component, swap env var
 * names, done. The custom-event call sites use the same window.plausible
 * shim guarded by a try/catch so unset analytics never throws.
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ??
    "https://plausible.io/js/script.outbound-links.js";

  return (
    <Script
      defer
      data-domain={domain}
      src={src}
      strategy="afterInteractive"
    />
  );
}
