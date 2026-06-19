import Link from "next/link";
import VamosNetLogo from "@/components/VamosNetLogo";
import NewsletterSignup from "@/components/v3/NewsletterSignup";

/**
 * Real Vamos.net social handles. Empty array = render no social row.
 * Per restructure spec §8.5: "replace # placeholders with real profiles or
 * remove icons until profiles exist (empty links look abandoned)."
 * Restore entries once real handles exist.
 */
const SOCIAL_HANDLES = {
  linkedin: "https://www.linkedin.com/company/vamos-net/",
  instagram: "https://www.instagram.com/vamos_net",
  twitter: "",
  youtube: "",
  tiktok: "",
};

/**
 * Vamos.net v3 Footer — desktop + mobile responsive footer block.
 *
 * Spec (from Figma /v1/files/nodes → FooterDesktop / FooterMobile):
 *  Desktop:
 *    - Outer 1440×660, padding x=12, vertical-stacked Newsletter + Footer.
 *    - Footer inner: padding 4t / 20r / 80b / 20l, gap 48 between rows.
 *    - Social row: 4 large pill buttons (h-90, fill #EBEAE9, radius-full).
 *    - Footer row: logo (left) + 11-link grid (right, gap ~24).
 *    - Politics row: copyright (left, #A4A7AE) + Terms + Privacy (right).
 *  Mobile:
 *    - Outer 390×888, padding x=8.
 *    - Newsletter on top (smaller), then padded footer column (40t / 100b).
 *    - Logo, then 11-link vertical-leaning grid, then 4 social buttons (h-90),
 *      then politics rows.
 *
 * Link list ("Favourites" dropped for v1):
 *   Home, Reviews, Tournament Calendar, Scores, Padel Hub, Suggest collaborate,
 *   Contact, Podcasts, Guides, Pro News.
 *
 * This component is server-renderable: no client state, no hooks.
 */

type FooterLink = { href: string; label: string };

const FOOTER_LINKS: FooterLink[] = [
  { href: "/", label: "Spotlight" },
  { href: "/business", label: "Business" },
  { href: "/pro", label: "Pro Padel" },
  { href: "/gear", label: "Gear & Improve" },
  { href: "/scores", label: "Scores" },
  { href: "/tournaments", label: "Tournament Calendar" },
  { href: "/rankings", label: "Rankings" },
  { href: "/players", label: "Players" },
  { href: "/services", label: "Advisory & services" },
  { href: "/about", label: "About" },
  { href: "/about#contribute", label: "Write for us" },
];

type Social = { href: string; label: string; icon: React.ReactNode };

/* Inline SVG placeholders — kept simple so we own the marks. Each is sized
 * 32×32 to match the Figma IconPlace slot. */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.59 8.67L23 22h-6.7l-5.24-6.85L4.92 22H1.66l8.13-9.29L1 2h6.86l4.74 6.27L18.244 2Zm-1.18 18.02h1.86L7.04 3.86H5.04l12.024 16.16Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M23 12c0-2.5-.3-4.2-.6-5.1-.3-.9-1-1.6-1.9-1.9C18.5 4.5 12 4.5 12 4.5s-6.5 0-8.5.5c-.9.3-1.6 1-1.9 1.9C1.3 7.8 1 9.5 1 12s.3 4.2.6 5.1c.3.9 1 1.6 1.9 1.9 2 .5 8.5.5 8.5.5s6.5 0 8.5-.5c.9-.3 1.6-1 1.9-1.9.3-.9.6-2.6.6-5.1ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.4 8.4 0 0 1-4.5-1.3v6.6A6.2 6.2 0 1 1 10.3 9.6v3.2a3.1 3.1 0 1 0 3.1 3.1V3h3.1Z" />
    </svg>
  );
}

const SOCIALS: Social[] = [
  SOCIAL_HANDLES.linkedin && { href: SOCIAL_HANDLES.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
  SOCIAL_HANDLES.instagram && { href: SOCIAL_HANDLES.instagram, label: "Instagram", icon: <InstagramIcon /> },
  SOCIAL_HANDLES.twitter && { href: SOCIAL_HANDLES.twitter, label: "Twitter / X", icon: <TwitterIcon /> },
  SOCIAL_HANDLES.youtube && { href: SOCIAL_HANDLES.youtube, label: "YouTube", icon: <YouTubeIcon /> },
  SOCIAL_HANDLES.tiktok && { href: SOCIAL_HANDLES.tiktok, label: "TikTok", icon: <TikTokIcon /> },
].filter(Boolean) as Social[];

export default function Footer() {
  return (
    <footer className="w-full" style={{ paddingLeft: 12, paddingRight: 12 }}>
      <NewsletterSignup />

      <div
        className="flex flex-col"
        style={{
          paddingTop: 4,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 80,
          gap: 48,
        }}
      >
        {SOCIALS.length > 0 && (
          /* Social media row — pill buttons. Only renders when real handles exist. */
          <ul
            className="grid gap-8 list-none"
            style={{
              gridTemplateColumns: `repeat(${SOCIALS.length}, minmax(0, 1fr))`,
            }}
          >
            {SOCIALS.map((s) => (
              <li key={s.href} className="flex">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-full rounded-full text-text-primary hover:text-brand transition-colors"
                  style={{
                    background: "#EBEAE9", // exact Figma fill (not yet tokenised; --color-bg-gray is #EBE9E9 — close but distinct)
                    height: 90,
                  }}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Logo + link grid */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-24 md:gap-40">
          <Link href="/" aria-label="Vamos.net home" className="inline-flex">
            <VamosNetLogo variant="ink" height={26} />
          </Link>

          <nav aria-label="Footer">
            <ul
              className="list-none grid gap-x-24 gap-y-12"
              style={{
                // 2 columns on mobile, up to 4 columns on desktop for compact density.
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-display font-semibold text-16 text-text-primary hover:text-brand transition-colors"
                    style={{ lineHeight: "22px" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Politics row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <p className="text-body-s" style={{ color: "var(--color-text-tertiary)" }}>
            © 2026 Vamos.net. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-24 gap-y-8 list-none">
            <li>
              <Link
                href="/terms"
                className="text-body-s hover:text-brand transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Terms of use
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-body-s hover:text-brand transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/disclosure"
                className="text-body-s hover:text-brand transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Affiliate disclosure
              </Link>
            </li>
            <li>
              <Link
                href="/imprint"
                className="text-body-s hover:text-brand transition-colors"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Imprint
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
