"use client";

import Link from "next/link";
import VamosNetLogo from "@/components/VamosNetLogo";

/**
 * Vamos.net v3 Mobile-only sticky top header.
 *
 * - Centred logo (variant="ink", 40px tall — slightly larger than desktop's 31px
 *   so it reads as the focal point of the mobile chrome).
 * - Sticky to the top of the viewport: sticky top-0 z-40.
 * - Hidden on md+ (the desktop Header handles that breakpoint).
 * - Height 56px with a bottom border that separates it from page content.
 */
export default function MobileHeader() {
  return (
    <header
      className="md:hidden sticky top-0 z-40 flex items-center justify-center bg-bg-page border-b border-border-primary"
      style={{ height: 56, paddingLeft: 16, paddingRight: 16 }}
    >
      <Link href="/" aria-label="Vamos.net home" className="flex items-center">
        <VamosNetLogo variant="ink" height={40} />
      </Link>
    </header>
  );
}
