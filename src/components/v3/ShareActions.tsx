"use client";

/**
 * ShareActions (v3) — action icon strip at the end of an article body.
 *
 * Annotation A7: clicking opens ShareModal. Save/favourite star intentionally
 * omitted because Favourites was dropped for v1.
 */

import { useState } from "react";
import ShareModal from "./ShareModal";

export interface ShareActionsProps {
  url: string;
  title: string;
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M13 7l3-3m0 0l-3-3m3 3H8a4 4 0 00-4 4v0M7 13l-3 3m0 0l3 3m-3-3h8a4 4 0 004-4v0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ShareActions({ url, title }: ShareActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-12">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Share this article"
          className="inline-flex items-center gap-8 rounded-full bg-bg-gray px-16 py-12 text-body-s-semibold text-text-primary transition-colors hover:bg-brand hover:text-text-contrast focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <ShareIcon />
          <span>Share</span>
        </button>
      </div>

      {open && (
        <ShareModal url={url} title={title} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
