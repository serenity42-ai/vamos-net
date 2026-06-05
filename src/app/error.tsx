"use client";

import { useEffect } from "react";

/**
 * Root error boundary (audit M2). Catches uncaught render-time errors from
 * any page that doesn't have its own error.tsx. Must be a client component
 * per Next 14 conventions (error.tsx receives a reset callback).
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to whichever logging pipeline the deploy uses
    // (Vercel captures console.error automatically). Never spam users.
    console.error("[root-error]", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl text-center">
        <p
          className="mb-4"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-brand-primary, #FE4C00)",
          }}
        >
          Unforced error
        </p>
        <h1
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(32px, 6vw, 56px)",
            lineHeight: 1,
            textTransform: "uppercase",
            color: "var(--color-text-primary, #181D27)",
          }}
        >
          Something went sideways
        </h1>
        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            lineHeight: "24px",
            color: "var(--color-text-secondary, #535862)",
          }}
        >
          We hit an error rendering this page. It&rsquo;s usually temporary.
        </p>
        <div className="flex flex-wrap justify-center gap-12">
          <button
            onClick={() => reset()}
            type="button"
            className="inline-flex items-center rounded-full px-20 py-12 font-sans text-14 font-semibold"
            style={{
              background: "var(--color-brand-primary, #FE4C00)",
              color: "#ffffff",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-full px-20 py-12 font-sans text-14 font-semibold border"
            style={{
              borderColor: "var(--color-border-primary, #E9EAEB)",
              color: "var(--color-text-primary, #181D27)",
            }}
          >
            Back to homepage
          </a>
        </div>
        {error?.digest && (
          <p
            className="mt-8 font-mono text-12"
            style={{ color: "var(--color-text-tertiary, #717680)" }}
          >
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
