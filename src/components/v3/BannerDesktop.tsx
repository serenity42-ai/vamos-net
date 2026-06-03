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
  autoPlayMs = 6000,
}: BannerDesktopProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (count === 0 ? 0 : (i + delta + count) % count));
    },
    [count]
  );

  useEffect(() => {
    if (!autoPlayMs || count <= 1) return;
    const id = window.setInterval(() => go(1), autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, count, go]);

  if (!slide) return null;

  const cta = slide.ctaText ?? "Read article";
  const href = slide.ctaHref ?? "#";

  return (
    <section
      className="relative w-full overflow-hidden rounded-32 bg-bg-gray text-text-contrast"
      style={{ aspectRatio: "1420 / 513" }}
      aria-roledescription="carousel"
    >
      {/* Background image (left, 1141/1420 ≈ 80%) */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1420px, 100vw"
          className="object-cover"
        />
        {/* Dark gradient overlay on right ~55% */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(24,29,39,0) 30%, rgba(24,29,39,0.85) 70%, rgba(24,29,39,0.95) 100%)",
          }}
        />
      </div>

      {/* Orange ellipse decoration — bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[80px] -bottom-[80px] h-[327px] w-[327px] rounded-full bg-brand opacity-90"
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
              onClick={() => setIndex(i)}
              className={[
                "h-8 w-8 rounded-full transition-colors",
                i === index ? "bg-brand" : "bg-text-contrast/70 hover:bg-text-contrast",
              ].join(" ")}
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
            onClick={() => go(-1)}
          />
          <IconButton
            variant="ghost-dark"
            size="lg"
            icon={<ChevronRight />}
            label="Next slide"
            onClick={() => go(1)}
          />
        </div>
      )}

      {/* Content — right column */}
      <div className="relative z-[5] flex h-full items-end p-32 lg:p-48">
        <div className="flex max-w-[428px] flex-col gap-20 lg:ml-auto">
          {slide.eyebrow && (
            <span className="text-uppercase-eyebrow text-brand">
              {slide.eyebrow}
            </span>
          )}
          <div className="flex flex-col gap-8">
            <h2 className="text-desktop-heading-l text-text-contrast">
              {slide.title}
            </h2>
            {slide.body && (
              <p className="text-body-l text-text-contrast/85">{slide.body}</p>
            )}
          </div>
          <div>
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
    </section>
  );
}
