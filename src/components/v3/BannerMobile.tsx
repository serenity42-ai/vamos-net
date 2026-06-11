"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import type { BannerSlide } from "./BannerDesktop";

/**
 * BannerMobile — homepage hero carousel mobile (390×500).
 *
 * Figma spec (id=227:32163):
 *  - 374×500 r=40, full-bleed image w/ dark linear gradient overlay at bottom
 *  - Stacked content: text → pagination dots → full-width "Read article" Button
 *
 * Animation spec:
 *  - Track-based slider, translated by -index*100%.
 *  - Swipe gesture (touch only):
 *      threshold 40px, snap on release with
 *      transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1)
 *    During drag, no transition is applied (real-time follow).
 *  - Autoplay 5s, reset on any touchstart on the banner.
 *  - Content fade + slide-up on slide change:
 *      opacity 0→1, translateY(10px)→0,
 *      350ms ease, 150ms delay
 *  - Ken-Burns background: scale(1.04)→scale(1) over 5000ms linear,
 *    replays on each slide change.
 *  - Respects prefers-reduced-motion.
 */

export interface BannerMobileProps {
  slides: BannerSlide[];
  autoPlayMs?: number;
}

const SWIPE_THRESHOLD = 40;

export default function BannerMobile({
  slides,
  autoPlayMs = 5000,
}: BannerMobileProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const [autoplayTick, setAutoplayTick] = useState(0);

  // Drag state — separate refs to avoid re-renders during touchmove.
  const startXRef = useRef<number | null>(null);
  const trackWidthRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragDeltaPx, setDragDeltaPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Autoplay (resets when autoplayTick changes)
  useEffect(() => {
    if (!autoPlayMs || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, count, autoplayTick]);

  const handleDot = useCallback((i: number) => {
    setIndex(i);
    setAutoplayTick((t) => t + 1);
  }, []);

  // ─── Touch handlers ─────────────────────────────────────────────
  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (count <= 1) return;
      startXRef.current = e.touches[0].clientX;
      trackWidthRef.current = containerRef.current?.clientWidth ?? 0;
      setIsDragging(true);
      setAutoplayTick((t) => t + 1); // reset autoplay on any touch
    },
    [count]
  );

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;
    const delta = e.touches[0].clientX - startXRef.current;
    setDragDeltaPx(delta);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (startXRef.current === null) return;
    const delta = dragDeltaPx;
    startXRef.current = null;
    setIsDragging(false);
    setDragDeltaPx(0);

    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      // Snap back — nothing to do; transition runs from dragDeltaPx → 0
      return;
    }
    // Snap forward / back
    setIndex((i) => {
      if (count === 0) return 0;
      if (delta < 0) {
        // swiped left → next
        return (i + 1) % count;
      }
      // swiped right → previous
      return (i - 1 + count) % count;
    });
  }, [count, dragDeltaPx]);

  if (count === 0) return null;
  const slide = slides[index];
  if (!slide) return null;

  const cta = slide.ctaText ?? "Read article";
  const href = slide.ctaHref ?? "#";

  // Compose track transform: index offset (as %) + drag offset (in px).
  const indexOffsetPct = (index * 100) / count; // percentage of TRACK width
  const dragOffsetPct =
    trackWidthRef.current > 0
      ? (dragDeltaPx / trackWidthRef.current) * 100
      : 0;
  const trackTransform = `translateX(calc(-${indexOffsetPct}% + ${dragOffsetPct}%))`;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-40 bg-bg-constant text-text-contrast"
      style={{ height: 500, touchAction: "pan-y" }}
      aria-roledescription="carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* Slide track */}
      <div
        className="absolute inset-0 flex motion-reduce:!transition-none"
        style={{
          width: `${count * 100}%`,
          transform: trackTransform,
          transition: isDragging
            ? "none"
            : "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative h-full"
            style={{ width: `${100 / count}%` }}
            aria-hidden={i !== index}
          >
            {/* Background image with slow Ken-Burns zoom */}
            <BannerMobileImage
              src={s.image}
              active={i === index}
              activeKey={index}
            />
            {/* Static gradient overlay */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-3/4"
              style={{
                background:
                  "linear-gradient(0deg, rgba(24,29,39,0.95) 10%, rgba(24,29,39,0.6) 55%, rgba(24,29,39,0) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Content — bottom stack. KEYED on index so it remounts and
          replays the fade + slide-up animation on slide change. */}
      <div
        key={index}
        className="relative z-[5] flex h-full flex-col justify-end gap-12 p-16 motion-reduce:!animate-none"
        style={{ animation: "vamosBannerMobileContentIn 350ms ease 150ms both" }}
      >
        <div className="flex flex-col gap-8">
          {slide.eyebrow && (
            <span className="text-uppercase-eyebrow text-brand">
              {slide.eyebrow}
            </span>
          )}
          <h2 className="text-mobile-heading-l text-text-contrast line-clamp-3">
            {slide.title}
          </h2>
          {slide.body && (
            <p className="text-body-m text-text-contrast/85 line-clamp-2">
              {slide.body}
            </p>
          )}
        </div>

        {/* Pagination dots — centered */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-12">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => handleDot(i)}
                className={[
                  "h-8 w-8 rounded-full motion-reduce:!transition-none",
                  i === index ? "bg-brand" : "bg-bg-white",
                ].join(" ")}
                style={{ transition: "background 300ms ease" }}
              />
            ))}
          </div>
        )}

        {/* Full-width CTA */}
        <Button
          as={Link}
          href={href}
          variant="outline"
          trailingIcon="arrow"
          className="w-full justify-between"
        >
          {cta}
        </Button>
      </div>

      <style jsx>{`
        @keyframes vamosBannerMobileContentIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(section[aria-roledescription="carousel"] *) {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* Background image wrapper. Keyed remount on activeKey replays the
   slow Ken-Burns zoom (1.04 → 1, 5000ms linear). */
function BannerMobileImage({
  src,
  active,
  activeKey,
}: {
  src: string;
  active: boolean;
  activeKey: number;
}) {
  return (
    <div
      key={active ? `active-${activeKey}` : "idle"}
      className="absolute inset-0 motion-reduce:!transform-none motion-reduce:!transition-none"
      style={
        active
          ? { animation: "vamosBannerMobileImageIn 5000ms linear both" }
          : { transform: "scale(1)" }
      }
    >
      <Image
        src={src}
        alt=""
        fill
        priority={active}
        sizes="100vw"
        className="object-cover object-[center_25%]"
      />
      <style jsx>{`
        @keyframes vamosBannerMobileImageIn {
          from {
            transform: scale(1.04);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
