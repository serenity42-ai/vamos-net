"use client";

import { useState } from "react";
import IconButton from "@/components/IconButton";

/**
 * SidebarNewsletter — compact newsletter signup for the homepage right-rail.
 *
 * Distinct from the full-width newsletter band in the global Footer:
 *  - Smaller padding (matches QuickLinks / MostSearched card size)
 *  - Single-row email input + circular orange submit
 *  - Dark bg (#181D27) to anchor the right column
 */

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function SidebarNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Beehiiv wiring stays the same as the footer signup — log for now,
    // the page-level newsletter component owns the real integration.
    setSubmitted(true);
  };

  return (
    <section
      className="bg-bg-constant text-text-contrast rounded-24 p-20"
      aria-labelledby="sidebar-newsletter-title"
    >
      <h3
        id="sidebar-newsletter-title"
        className="font-display font-extrabold uppercase mb-8"
        style={{ fontSize: 24, lineHeight: "28px" }}
      >
        All Things Padel, One Email
      </h3>
      <p
        className="text-text-tertiary mb-16"
        style={{ fontSize: 14, lineHeight: "20px" }}
      >
        Tournaments, stories, gear, and tips — get our 5 min newsletter on
        what matters in padel.
      </p>

      {submitted ? (
        <p className="text-body-m text-text-contrast">
          Thanks — check your inbox to confirm.
        </p>
      ) : (
        <form className="flex items-center gap-8" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email address"
            className="flex-1 bg-bg-white rounded-full text-text-primary placeholder:text-text-tertiary outline-none"
            style={{
              height: 48,
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: 14,
            }}
          />
          <IconButton
            type="submit"
            variant="primary"
            size="md"
            icon={<ArrowUpRight />}
            label="Subscribe"
            className="!h-48 !w-48 shrink-0"
          />
        </form>
      )}
    </section>
  );
}
