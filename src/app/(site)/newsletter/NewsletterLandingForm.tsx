"use client";

import { useState, type FormEvent } from "react";

/**
 * Newsletter landing-page signup form.
 *
 * Unlike the footer/sidebar quick-signups (email only), this form captures
 * ONE qualifying signal: the subscriber's angle on padel-as-a-business.
 * That role is the difference between "a name on a list" and "a routed lead"
 * — an operator with a club in the red is an advisory prospect; an investor
 * is a future LP. We post it to /api/newsletter as `role`, which tags the
 * Ghost member (label `role:<x>`) so the list self-segments from day one.
 *
 * The role is OPTIONAL on purpose: a required field kills conversion. We ask,
 * we don't gate.
 */

const ROLES: { value: string; label: string }[] = [
  { value: "", label: "What's your angle? (optional)" },
  { value: "operator", label: "I run / want to run a club" },
  { value: "builder", label: "I build courts / make gear or apparel" },
  { value: "investor", label: "I invest in / fund padel" },
  { value: "organizer", label: "I organize events / tournaments" },
  { value: "brand", label: "I'm a brand / sponsor" },
  { value: "other", label: "Something else" },
];

type Status = "idle" | "loading" | "success" | "error";

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

export default function NewsletterLandingForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter", role: role || undefined }),
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
      setMessage("You're in. Check your inbox to confirm your subscription.");
      setEmail("");
      setRole("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-24 bg-bg-white p-24 md:p-32"
      >
        <p className="text-mobile-heading-s md:text-desktop-heading-s text-text-primary">
          {message}
        </p>
        <p className="mt-8 text-body-m" style={{ color: "var(--color-text-secondary)" }}>
          The next brief lands in your inbox within two weeks. No spam, unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={status === "loading"}
      className="flex flex-col gap-12"
    >
      <label htmlFor="nl-email" className="sr-only">
        Email address
      </label>
      <div
        className="flex items-center bg-bg-white rounded-full w-full min-w-0"
        style={{ height: 64, paddingLeft: 24, paddingRight: 8 }}
      >
        <input
          id="nl-email"
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

      <label htmlFor="nl-role" className="sr-only">
        Your angle on padel
      </label>
      <div
        className="flex items-center gap-8 bg-bg-white rounded-full w-full min-w-0"
        style={{ height: 64, paddingLeft: 24, paddingRight: 24 }}
      >
        <select
          id="nl-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={status === "loading"}
          className="w-full min-w-0 bg-transparent outline-none text-16 text-text-primary disabled:opacity-60 appearance-none cursor-pointer"
          style={{ color: role ? "var(--color-text-primary)" : "var(--color-text-tertiary)" }}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
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
          className="shrink-0 pointer-events-none"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-8 rounded-full bg-brand text-text-contrast font-display font-semibold text-16 transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ height: 64 }}
      >
        <span>{status === "loading" ? "Subscribing…" : "Subscribe — it's free"}</span>
        {status !== "loading" && <ArrowUpRight />}
      </button>

      {status === "error" && message && (
        <p role="alert" className="text-body-s" style={{ color: "#CC3D00" }}>
          {message}
        </p>
      )}

      <p className="text-body-s" style={{ color: "var(--color-text-tertiary)" }}>
        Bi-weekly. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
