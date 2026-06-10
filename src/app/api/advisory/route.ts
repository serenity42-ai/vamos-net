import { NextRequest, NextResponse } from "next/server";
import { deliverAdvisoryEnquiry, AdvisoryEnquiry } from "@/lib/advisory-notify";

/**
 * Advisory enquiry endpoint — POST { name, email, company?, message, source? }.
 *
 * Per restructure spec §4.3, this is the funnel endpoint for the consulting
 * business. The user should never see a failure from a misconfigured delivery
 * provider: we always 200 once validation passes, and the delivery layer
 * itself logs to stdout so Vercel captures every lead even if Telegram and
 * Resend are both unconfigured.
 */
export const runtime = "nodejs";

const MAX_LENGTHS = {
  name: 200,
  email: 320,
  company: 200,
  message: 5000,
  source: 200,
};

// Simple in-memory rate limit per IP. Per-edge-region only, but it knocks
// out the trivial spam. We can add Upstash later if it becomes a problem.
const recent: Map<string, number[]> = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    recent.set(ip, arr);
    return false;
  }
  arr.push(now);
  recent.set(ip, arr);
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — silently accept (so bots think they won) but drop.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitize(body.name, MAX_LENGTHS.name);
  const email = sanitize(body.email, MAX_LENGTHS.email);
  const company = sanitize(body.company, MAX_LENGTHS.company);
  const message = sanitize(body.message, MAX_LENGTHS.message);
  const source = sanitize(body.source, MAX_LENGTHS.source) || "advisory_page";

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }
  if (message.length < 20) {
    return NextResponse.json(
      { ok: false, error: "Please add a bit more detail to your message." },
      { status: 400 }
    );
  }

  const enquiry: AdvisoryEnquiry = {
    name,
    email,
    company: company || undefined,
    message,
    source,
    submittedAt: new Date().toISOString(),
  };

  // Fire-and-await delivery, but never propagate the error to the user.
  // We log inside deliverAdvisoryEnquiry — that's the audit trail.
  try {
    await deliverAdvisoryEnquiry(enquiry);
  } catch (err) {
    console.error("[advisory] delivery threw — lead is in console log:", err);
  }

  return NextResponse.json({ ok: true });
}

function sanitize(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function isEmail(s: string): boolean {
  // Pragmatic, not RFC-perfect. Good enough for a contact form.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 320;
}
