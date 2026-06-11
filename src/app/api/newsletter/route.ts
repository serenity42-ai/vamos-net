import { NextRequest, NextResponse } from "next/server";
import GhostAdminAPI from "@tryghost/admin-api";

/**
 * Newsletter signup endpoint — POST { email, source? }.
 *
 * Creates a Ghost Member subscribed to the default newsletter. Ghost handles
 * the double opt-in / confirmation email itself (per its Members settings).
 *
 * Privacy posture: we never log full emails to stdout in production; only
 * domain + redacted local-part for debugging. We return a generic success
 * for already-subscribed addresses so we don't expose subscriber existence
 * via timing/error responses (small but real privacy + scraping concern).
 *
 * Rate limited per-IP at the edge region (same approach as /api/advisory).
 */

export const runtime = "nodejs";

const GHOST_URL = process.env.GHOST_URL;
const GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;

const EMAIL_MAX = 320;
const SOURCE_MAX = 200;
const VALID_SOURCES = new Set([
  "footer",
  "sidebar",
  "homepage",
  "business",
  "pro",
  "gear",
  "article",
  "services",
  "other",
]);

// Per-IP rate limit. Module-level Map = per edge region; not perfect, but
// blocks trivial brute-force.
const recent: Map<string, number[]> = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) return false;
  arr.push(now);
  recent.set(ip, arr);
  // Opportunistic cleanup to keep the map bounded.
  if (recent.size > 5000) {
    for (const [k, v] of recent.entries()) {
      if (v.every((t) => now - t >= WINDOW_MS)) recent.delete(k);
    }
  }
  return true;
}

// RFC 5321 says local-part can be quoted with almost anything, but in
// practice the strict-enough regex below catches every legitimate address
// we'd ever sign up while rejecting obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "<invalid>";
  if (local.length <= 2) return `${local[0] ?? "*"}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

type GhostError = {
  name?: string;
  context?: string;
  type?: string;
  message?: string;
  details?: unknown;
  errors?: { type?: string; message?: string }[];
};

function isAlreadyExists(err: GhostError): boolean {
  // @tryghost/admin-api surfaces validation failures with err.name==="ValidationError"
  // at the top level; some versions/paths nest them in err.errors[0]. Cover both.
  const top = err?.name === "ValidationError" || err?.type === "ValidationError";
  const nested = err?.errors?.[0]?.type === "ValidationError";
  if (!top && !nested) return false;
  const messages = [
    err?.message ?? "",
    err?.context ?? "",
    err?.errors?.[0]?.message ?? "",
  ].join(" ");
  // Ghost surfaces "already exists" in a few wordings depending on hit path
  // (member by email, by id, etc.). Match liberally.
  return /already exists|already a member|exists/i.test(messages);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests, please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const data = (body ?? {}) as { email?: unknown; source?: unknown };
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const sourceRaw =
    typeof data.source === "string" ? data.source.trim().toLowerCase() : "";

  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const source =
    sourceRaw && sourceRaw.length <= SOURCE_MAX && VALID_SOURCES.has(sourceRaw)
      ? sourceRaw
      : "other";

  if (!GHOST_URL || !GHOST_ADMIN_API_KEY) {
    console.error("[newsletter] Ghost env vars missing — signup not persisted");
    // Generic success to avoid leaking config state to the client.
    return NextResponse.json({ ok: true, status: "queued" });
  }

  const api = new GhostAdminAPI({
    url: GHOST_URL,
    key: GHOST_ADMIN_API_KEY,
    version: "v5.0",
  });

  try {
    // Ghost auto-subscribes new members to any newsletter with
    // `subscribe_on_signup: true`. We've confirmed the "Vamos.net" default
    // newsletter has that flag enabled.
    await api.members.add({
      email,
      labels: [`source:${source}`, "newsletter-signup"],
      note: `Signed up via vamos.net (${source}) on ${new Date().toISOString()}`,
    });
    console.log(
      `[newsletter] subscribed ${redactEmail(email)} via ${source}`,
    );
    return NextResponse.json({ ok: true, status: "subscribed" });
  } catch (err) {
    const ghostErr = err as GhostError;

    // Already-subscribed case: treat as success — privacy + UX (don't leak
    // whether an email is on the list, and don't punish the user for
    // signing up twice).
    if (isAlreadyExists(ghostErr)) {
      console.log(
        `[newsletter] already-subscribed ${redactEmail(email)} via ${source}`,
      );
      return NextResponse.json({ ok: true, status: "already-subscribed" });
    }

    console.error(
      `[newsletter] Ghost create failed for ${redactEmail(email)}:`,
      ghostErr?.message ?? err,
      ghostErr?.context ?? "",
    );
    return NextResponse.json(
      { error: "We couldn't sign you up right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
