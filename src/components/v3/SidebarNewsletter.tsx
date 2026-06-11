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

// Wired to /api/newsletter (Ghost Admin API) on 2026-06-11.
const NEWSLETTER_ENABLED = true;

type Status = "idle" | "loading" | "success" | "error";

export default function SidebarNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "sidebar" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
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

      {status === "success" ? (
        <p className="text-body-m text-text-contrast" role="status" aria-live="polite">
          Thanks — check your inbox to confirm.
        </p>
      ) : (
        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit}
          aria-busy={status === "loading"}
        >
          <div className="flex items-center gap-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              aria-label="Email address"
              className="flex-1 bg-bg-white rounded-full text-text-primary placeholder:text-text-tertiary outline-none disabled:opacity-60"
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
              label={status === "loading" ? "Subscribing" : "Subscribe"}
              disabled={status === "loading"}
              className="!h-48 !w-48 shrink-0"
            />
          </div>
          {status === "error" && message && (
            <p
              role="alert"
              className="text-body-s"
              style={{ color: "#FF8A7A" }}
            >
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
