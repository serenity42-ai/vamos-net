"use client";

/**
 * ShareModal (v3) — generic share dialog.
 *
 * Annotation A7: share modal with LinkedIn, Instagram, X, Copy Link, Email.
 * LinkedIn leads — it's our primary B2B / newsletter-conversion channel.
 *
 *  - Backdrop blur, centered card, rounded-32 on desktop, full-width sheet on mobile
 *  - Closes on backdrop click + ESC
 *  - "Copy Link" copies window.location.href and shows a toast for 2s
 *  - Instagram has no public web share endpoint. We do NOT redirect to another
 *    network. On mobile we open the native share sheet (which surfaces the real
 *    Instagram app); otherwise we copy the link so the user can paste it into
 *    Instagram. Never open X/Twitter from the Instagram button.
 *
 * Reusable: pass { url, title, onClose }.
 */

import { useEffect, useState } from "react";

export interface ShareModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M15 5L5 15M5 5l10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 9V7a1 1 0 011-1h2V3h-3a4 4 0 00-4 4v2H7v3h2v8h3v-8h2.5l.5-3H14z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21.5l-7.59 8.67L23 22h-6.7l-5.24-6.85L4.92 22H1.66l8.13-9.29L1 2h6.86l4.74 6.27L18.244 2Zm-1.18 18.02h1.86L7.04 3.86H5.04l12.024 16.16Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

interface ShareButtonProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

function ShareButton({ label, icon, href, onClick }: ShareButtonProps) {
  const className =
    "flex flex-col items-center gap-8 rounded-16 bg-bg-gray px-16 py-20 text-text-primary transition-colors hover:bg-brand hover:text-text-contrast focus:outline-none focus:ring-2 focus:ring-brand";
  const content = (
    <>
      <span aria-hidden>{icon}</span>
      <span className="text-body-s-semibold">{label}</span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default function ShareModal({ url, title, onClose }: ShareModalProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // M6 (audit): one source of truth for the shared URL. Previously copy
  // used window.location.href while social buttons used the `url` prop — a
  // user could copy one link and tweet a different one (different query
  // params, modals open, etc.). Prefer the prop — it's what the caller meant
  // to share; the live URL is only a fallback if no prop was supplied.
  const shareUrl =
    url ||
    (typeof window !== "undefined" ? window.location.href : "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast("Link copied!");
    } catch {
      setToast("Could not copy");
    }
    window.setTimeout(() => setToast(null), 2000);
  }

  // Instagram has no public web share-intent URL. On devices with the native
  // share sheet (mobile), invoke it so the real Instagram app shows up. On
  // desktop, copy the link and tell the user to paste it into Instagram.
  // We never redirect to X/Twitter from the Instagram button.
  async function handleInstagram() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast("Link copied — paste it into Instagram");
    } catch {
      setToast("Could not copy");
    }
    window.setTimeout(() => setToast(null), 2500);
  }

  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
  // LinkedIn deprecated the title/summary params, but the feed share intent
  // still pre-fills from the URL's OG tags (which our articles set).
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  const xUrl = `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`;
  const mailto = `mailto:?subject=${encodedTitle}&body=${encoded}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      style={{ backgroundColor: "rgba(24,29,39,0.55)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share article"
    >
      <div
        className="w-full max-w-[480px] rounded-t-32 bg-bg-page p-24 shadow-xl sm:rounded-32"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-20 flex items-center justify-between">
          <h2 className="text-title-m text-text-primary">Share</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="flex h-32 w-32 items-center justify-center rounded-full bg-bg-gray text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-12 sm:grid-cols-6">
          <ShareButton
            label="LinkedIn"
            icon={<LinkedInIcon />}
            href={linkedInUrl}
          />
          <ShareButton label="X" icon={<XIcon />} href={xUrl} />
          <ShareButton
            label="Instagram"
            icon={<InstagramIcon />}
            onClick={handleInstagram}
          />
          <ShareButton
            label="Facebook"
            icon={<FacebookIcon />}
            href={facebookUrl}
          />
          <ShareButton
            label="Copy Link"
            icon={<LinkIcon />}
            onClick={handleCopy}
          />
          <ShareButton label="Email" icon={<EmailIcon />} href={mailto} />
        </div>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="mt-16 rounded-16 bg-brand px-16 py-12 text-center text-body-s-semibold text-text-contrast"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
