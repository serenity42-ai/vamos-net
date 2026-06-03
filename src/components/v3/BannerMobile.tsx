"use client";

import { useCallback, useEffect, useState } from "react";
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
 */

export interface BannerMobileProps {
  slides: BannerSlide[];
  autoPlayMs?: number;
}

export default function BannerMobile({
  slides,
  autoPlayMs = 6000,
}: BannerMobileProps) {
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
      className="relative w-full overflow-hidden rounded-40 bg-bg-constant text-text-contrast"
      style={{ aspectRatio: "390 / 500", minHeight: 500 }}
      aria-roledescription="carousel"
    >
      {/* Background image — fill */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/4"
          style={{
            background:
              "linear-gradient(0deg, rgba(24,29,39,0.95) 10%, rgba(24,29,39,0.6) 55%, rgba(24,29,39,0) 100%)",
          }}
        />
      </div>

      {/* Content — bottom stack */}
      <div className="relative z-[5] flex h-full flex-col justify-end gap-12 p-16">
        <div className="flex flex-col gap-8">
          {slide.eyebrow && (
            <span className="text-uppercase-eyebrow text-brand">
              {slide.eyebrow}
            </span>
          )}
          <h2 className="text-mobile-heading-l text-text-contrast">
            {slide.title}
          </h2>
          {slide.body && (
            <p className="text-body-m text-text-contrast/85">{slide.body}</p>
          )}
        </div>

        {/* Pagination dots */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-12">
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
    </section>
  );
}
