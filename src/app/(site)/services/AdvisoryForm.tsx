"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "ok" | "error";

export default function AdvisoryForm({ source = "advisory_page" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      // Honeypot — hidden field, real users leave it blank.
      website: String(data.get("website") ?? "").trim(),
      source,
    };

    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json?.error ?? "Something went wrong. Please email hello@vamos.net.");
        // Fire conversion event even on failure? No — we only count delivered.
        return;
      }

      // Fire analytics event if Plausible is loaded (no-op otherwise).
      try {
        const w = window as unknown as { plausible?: (event: string, opts?: object) => void };
        w.plausible?.("advisory_form_submit", { props: { source } });
      } catch {
        /* analytics is best-effort */
      }

      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error. Try again.");
    }
  }

  if (status === "ok") {
    return (
      <div
        role="status"
        className="rounded-lg border p-24 text-text-primary"
        style={{
          background: "var(--color-bg-gray, #EBE9E9)",
          borderColor: "var(--color-text-primary, #111)",
        }}
      >
        <h3 className="font-display text-mobile-heading-s md:text-desktop-heading-s mb-8">
          Got it.
        </h3>
        <p>
          Thanks — we&rsquo;ll get back to you within two business days. If it&rsquo;s
          urgent, email <a href="mailto:hello@vamos.net">hello@vamos.net</a> directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-16" noValidate>
      <div className="grid gap-16 md:grid-cols-2">
        <Field label="Your name" name="name" required maxLength={200} autoComplete="name" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
        />
      </div>
      <Field
        label="Company / project (optional)"
        name="company"
        maxLength={200}
        autoComplete="organization"
      />
      <Field
        label="What do you need?"
        name="message"
        textarea
        required
        maxLength={5000}
        rows={6}
        placeholder="Court development, tournament organization, market entry, deal structuring — tell us what you're looking at."
      />

      {/* Honeypot — visually hidden, off the tab order. Real users leave blank. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <p className="text-body-s" style={{ color: "var(--color-text-tertiary)" }}>
        By submitting you agree to our <a href="/privacy">Privacy Policy</a>. We&rsquo;ll
        only use these details to reply to your enquiry.
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full px-24 py-12 font-display font-semibold transition-opacity disabled:opacity-50"
        style={{
          background: "var(--color-text-primary, #111)",
          color: "var(--color-bg, #fff)",
        }}
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      {status === "error" && error && (
        <p
          role="alert"
          className="text-body-s"
          style={{ color: "var(--color-danger, #b00020)" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
};

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  autoComplete,
  textarea,
  rows,
  placeholder,
}: FieldProps) {
  const id = `advisory-${name}`;
  const base = {
    id,
    name,
    required,
    maxLength,
    autoComplete,
    placeholder,
    className:
      "w-full rounded-md border px-12 py-10 font-body text-16 focus:outline-none focus:ring-2",
    style: {
      background: "var(--color-bg, #fff)",
      borderColor: "var(--color-text-tertiary, #999)",
      color: "var(--color-text-primary, #111)",
    } as React.CSSProperties,
  };

  return (
    <label htmlFor={id} className="flex flex-col gap-4">
      <span className="text-body-s font-semibold text-text-primary">
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "var(--color-danger, #b00020)" }}>
            {" *"}
          </span>
        )}
      </span>
      {textarea ? <textarea {...base} rows={rows ?? 4} /> : <input {...base} type={type} />}
    </label>
  );
}
