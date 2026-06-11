"use client";

import { useState, type FormEvent } from "react";
import IconButton from "@/components/IconButton";

/**
 * Vamos.net v3 Newsletter Signup — dark band, used at the top of the footer.
 *
 * Spec (from Figma /v1/files/nodes → Newsletter / FooterDesktop / FooterMobile):
 *  Desktop: 1416×296, bg #181D27, radius 32, padding 80t / 110r / 80b / 110l.
 *           Heading: Archivo/900/40/40 UPPER, white.
 *           Subtitle: Inter/400/16/24, #A4A7AE.
 *           Input pill (white, h-64 desktop) + orange round submit (arrow ↗).
 *  Mobile: 374×264, padding 24, heading Archivo/900/28/28, gap 24 between
 *          text and input row, input pill (h-56) + 56×56 orange submit.
 *
 * For accessibility we render a real <form> with a <label> and an <input
 * type="email" required>. The submit is the existing IconButton primary
 * variant (orange, white arrow), driven by the trailing arrow icon shape
 * defined in Button.tsx.
 */

function ArrowUpRight({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

// Wired to /api/newsletter (Ghost Admin API) on 2026-06-11.
const NEWSLETTER_ENABLED = true;

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
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
      setMessage("Thanks — check your inbox to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-bg-constant text-text-contrast rounded-32 w-full"
      style={{
        // Padding tuned to scale between mobile (24) and desktop (80/110).
        // Using CSS clamp keeps the dark band visually balanced at every width.
        paddingTop: "clamp(24px, 6vw, 80px)",
        paddingBottom: "clamp(24px, 6vw, 80px)",
        paddingLeft: "clamp(24px, 7vw, 110px)",
        paddingRight: "clamp(24px, 7vw, 110px)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-24 md:gap-40">
        {/* Text block */}
        <div className="flex flex-col gap-8 max-w-[468px]">
          <h2
            id="newsletter-heading"
            className="text-mobile-heading-l md:text-desktop-display-l text-text-contrast"
          >
            All Things Padel, One Email
          </h2>
          <p className="text-body-l" style={{ color: "var(--color-text-tertiary)" }}>
            Tournaments, stories, gear, and tips — get our 5 min newsletter on what matters in padel.
          </p>
        </div>

        {/* Email form — flex row; input takes flex-1, button is fixed 56×56 */}
        {NEWSLETTER_ENABLED && status === "success" ? (
          <div
            className="flex flex-col gap-4 w-full md:w-[376px] shrink-0"
            role="status"
            aria-live="polite"
          >
            <p className="text-body-l text-text-contrast">{message}</p>
          </div>
        ) : (
          NEWSLETTER_ENABLED && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8 w-full md:w-[376px] shrink-0"
              aria-busy={status === "loading"}
            >
              <div className="flex items-center gap-8">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div
                  className="flex items-center bg-bg-white rounded-full flex-1 min-w-0"
                  style={{
                    height: 56,
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingLeft: 24,
                    paddingRight: 24,
                  }}
                >
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full min-w-0 bg-transparent outline-none text-16 text-text-primary placeholder:text-text-tertiary disabled:opacity-60"
                  />
                </div>
                <IconButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  label={status === "loading" ? "Subscribing" : "Subscribe"}
                  icon={<ArrowUpRight />}
                  disabled={status === "loading"}
                  className="shrink-0"
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
          )
        )}
      </div>
    </section>
  );
}
