"use client";

/**
 * PhotoGallery (v3) — gallery + photo preview modal for Review variant (A2).
 *
 *  - Click a thumbnail → opens a fullscreen preview modal
 *  - Prev/next navigation (← → keys + buttons)
 *  - ESC + backdrop click closes
 *  - Wraps around at the ends
 *
 * Photos are expected to be { src, alt? }. Falls back gracefully if a single
 * photo is provided.
 */

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export interface GalleryPhoto {
  src: string;
  alt?: string;
}

export interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  title?: string;
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const close = useCallback(() => setActiveIdx(null), []);
  const next = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);
  const prev = useCallback(() => {
    setActiveIdx((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length,
    );
  }, [photos.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIdx, close, next, prev]);

  if (!photos || photos.length === 0) return null;

  const active = activeIdx !== null ? photos[activeIdx] : null;

  return (
    <section aria-label={title || "Photo gallery"} className="flex flex-col gap-16">
      {title && (
        <span className="text-uppercase-eyebrow text-brand">■ {title}</span>
      )}
      <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p, idx) => (
          <button
            key={`${p.src}-${idx}`}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="group relative aspect-square overflow-hidden rounded-16 bg-bg-gray focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label={`Open photo ${idx + 1}`}
          >
            <Image
              src={p.src}
              alt={p.alt || `Photo ${idx + 1}`}
              fill
              sizes="(min-width: 1024px) 200px, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(24,29,39,0.85)", backdropFilter: "blur(8px)" }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={close}
            className="absolute right-16 top-16 flex h-40 w-40 items-center justify-center rounded-full bg-bg-page text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
          >
            <CloseIcon />
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-16 top-1/2 flex h-48 w-48 -translate-y-1/2 items-center justify-center rounded-full bg-bg-page text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
            >
              <ChevronLeft />
            </button>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt || `Photo ${(activeIdx ?? 0) + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-16 top-1/2 flex h-48 w-48 -translate-y-1/2 items-center justify-center rounded-full bg-bg-page text-text-primary transition-colors hover:bg-brand hover:text-text-contrast"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
