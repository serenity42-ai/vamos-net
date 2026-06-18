"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";

/**
 * BannerDesktop — homepage hero carousel (1420×513).
 *
 * Figma spec (id=541:10427):
 *  - 1420×513 r=32, asymmetric: image left (1141 wide) + content right
 *  - Dark linear gradient overlay on right half
 *  - Orange ellipse decoration (327×327) bottom-right under content
 *  - Pagination dots at top right (orange = active)
 *  - "Read article" button outline variant
 *  - Slider chevrons (prev/next) at right
 *
 * Animation spec:
 *  - Track-based slider: all slides rendered side-by-side, container
 *    translates by -100% per index. Transition:
 *      transform 500ms cubic-bezier(0.4, 0, 0.2, 1)
 *  - Content (eyebrow + title + body + cta) re-mounts on slide change
 *    (keyed) and fades + slides up:
 *      opacity 0→1, translateY(12px)→0,
 *      400ms ease, 200ms delay
 *  - Background image starts at scale(1.03) and settles to scale(1)
 *      transform 600ms ease
 *  - Pagination dot active-color uses 300ms ease background transition.
 *  - Autoplay 5s, resets when the user clicks the arrow buttons.
 *  - Respects prefers-reduced-motion (motion-reduce: variant).
 */

export interface BannerSlide {
  image: string;
  eyebrow?: string;
  title: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface BannerDesktopProps {
  slides: BannerSlide[];
  autoPlayMs?: number;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function BannerDesktop({
  slides,
  autoPlayMs = 5000,
}: BannerDesktopProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  // Tick state used to reset the autoplay timer when user interacts.
  const [autoplayTick, setAutoplayTick] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (count === 0 ? 0 : (i + delta + count) % count));
    },
    [count]
  );

  // Autoplay — dependent on autoplayTick so we can reset by bumping it.
  useEffect(() => {
    if (!autoPlayMs || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, count, autoplayTick]);

  const handleArrow = useCallback(
    (delta: number) => {
      go(delta);
      setAutoplayTick((t) => t + 1); // reset autoplay timer
    },
    [go]
  );

  const handleDot = useCallback((i: number) => {
    setIndex(i);
    setAutoplayTick((t) => t + 1);
  }, []);

  if (count === 0) return null;
  const slide = slides[index];
  if (!slide) return null;

  const cta = slide.ctaText ?? "Read article";
  const href = slide.ctaHref ?? "#";

  return (
    <section
      className="relative w-full overflow-hidden rounded-32 bg-bg-gray text-text-contrast"
      style={{ aspectRatio: "1420 / 513" }}
      aria-roledescription="carousel"
    >
      {/* ──────────────────────────────────────────────────────────────
          SLIDE TRACK — horizontal flex, translated by index.
          Each slide carries its own background image + Ken-Burns scale.
         ────────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex motion-reduce:!transition-none"
        style={{
          width: `${count * 100}%`,
          transform: `translateX(-${(index * 100) / count}%)`,
          transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-live="polite"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative h-full"
            style={{ width: `${100 / count}%` }}
            aria-hidden={i !== index}
          >
            {/* Background image with scale-in animation.
                Keyed remount when this slide becomes active so the
                transition replays. */}
            <BannerImage src={s.image} active={i === index} activeKey={index} />
            {/* Dark gradient overlay on right ~55% — static */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(24,29,39,0) 30%, rgba(24,29,39,0.85) 70%, rgba(24,29,39,0.95) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Full-card click target — makes the whole banner open the article,
          not just the "Read article" button. Sits above the images (z-0) but
          below the interactive controls (dots/arrows/button at z-[5]+/z-10),
          which stop propagation / sit on top so they still work. */}
      <Link
        href={href}
        aria-label={slide.title}
        className="absolute inset-0 z-[2]"
      />

      {/* Orange ellipse decoration — bottom-right (static).
          Softened with blur + reduced opacity so it reads as a brand glow
          rather than a hard disc that fights the headline + CTA above it.
          Spec calls for 327×327 #FE4C00; visually it's an atmospheric accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[120px] -bottom-[120px] h-[327px] w-[327px] rounded-full bg-brand opacity-40 blur-3xl"
      />

      {/* Pagination dots — top right */}
      {count > 1 && (
        <div className="absolute right-32 top-32 z-10 flex items-center gap-12">
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

      {/* Slider arrows — right side, vertically centered */}
      {count > 1 && (
        <div className="absolute right-32 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-12">
          <IconButton
            variant="ghost-dark"
            size="lg"
            icon={<ChevronLeft />}
            label="Previous slide"
            onClick={() => handleArrow(-1)}
          />
          <IconButton
            variant="ghost-dark"
            size="lg"
            icon={<ChevronRight />}
            label="Next slide"
            onClick={() => handleArrow(1)}
          />
        </div>
      )}

      {/* Content — right column, KEYED on index so it remounts and
          replays the fade + slide-up animation on slide change. */}
      <div
        key={index}
        className="pointer-events-none relative z-[5] flex h-full items-end p-32 lg:p-48 motion-reduce:!animate-none"
        style={{
          animation:
            "vamosBannerContentIn 400ms ease 200ms both",
        }}
      >
        <div className="flex max-w-[428px] flex-col gap-20 lg:ml-auto">
          {slide.eyebrow && (
            <span className="text-uppercase-eyebrow text-brand">
              {slide.eyebrow}
            </span>
          )}
          <div className="flex flex-col gap-8">
            <h2 className="text-desktop-heading-l text-text-contrast line-clamp-3">
              {slide.title}
            </h2>
            {slide.body && (
              <p className="text-body-l text-text-contrast/85 line-clamp-2">
                {slide.body}
              </p>
            )}
          </div>
          <div className="pointer-events-auto relative z-[6] inline-flex">
            <Button
              as={Link}
              href={href}
              variant="outline"
              trailingIcon="arrow"
            >
              {cta}
            </Button>
          </div>
        </div>
      </div>

      {/* Local keyframes + reduced-motion fallback */}
      <style jsx>{`
        @keyframes vamosBannerContentIn {
          from {
            opacity: 0;
            transform: translateY(12px);
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
   scale-in (1.03 → 1) animation. */
function BannerImage({
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
          ? {
              animation: "vamosBannerImageIn 600ms ease both",
            }
          : { transform: "scale(1)" }
      }
    >
      <Image
        src={src}
        alt=""
        fill
        priority={active}
        sizes="(min-width: 1280px) 1420px, 100vw"
        className="object-cover object-[center_25%]"
      />
      <style jsx>{`
        @keyframes vamosBannerImageIn {
          from {
            transform: scale(1.03);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
