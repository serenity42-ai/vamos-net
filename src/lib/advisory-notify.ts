/**
 * Advisory enquiry delivery layer.
 *
 * Tries the configured channels in this order:
 *   1. Telegram bot — instant push to Alex + Dima. Requires
 *      TELEGRAM_BOT_TOKEN and TELEGRAM_ADVISORY_CHAT_IDS (comma-separated).
 *   2. Resend transactional email — requires RESEND_API_KEY and
 *      RESEND_FROM (a verified sender).
 *
 * At least one is recommended for production. If neither is configured,
 * we still log the enquiry to stdout so it appears in Vercel logs, and we
 * return success to the user. The advisory form is the revenue funnel —
 * the user should never see a failure.
 */

export type AdvisoryEnquiry = {
  name: string;
  email: string;
  company?: string;
  message: string;
  source: string; // e.g. "advisory_page" or "business_post:slug"
  submittedAt: string; // ISO
};

type DeliveryResult = {
  attempted: string[];
  delivered: string[];
  errors: { channel: string; error: string }[];
};

export async function deliverAdvisoryEnquiry(
  enquiry: AdvisoryEnquiry
): Promise<DeliveryResult> {
  const result: DeliveryResult = {
    attempted: [],
    delivered: [],
    errors: [],
  };

  // Telegram bot push
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChats = (process.env.TELEGRAM_ADVISORY_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (tgToken && tgChats.length > 0) {
    result.attempted.push("telegram");
    try {
      const text = formatTelegramMessage(enquiry);
      await Promise.all(
        tgChats.map((chatId) =>
          fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "Markdown",
              disable_web_page_preview: true,
            }),
          }).then(async (r) => {
            if (!r.ok) {
              const body = await r.text();
              throw new Error(`Telegram chat ${chatId}: ${r.status} ${body}`);
            }
          })
        )
      );
      result.delivered.push("telegram");
    } catch (err) {
      result.errors.push({
        channel: "telegram",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Resend transactional email
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM ?? "Vamos.net <hello@vamos.net>";
  const resendTo = (process.env.RESEND_ADVISORY_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (resendKey && resendTo.length > 0) {
    result.attempted.push("resend");
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: resendTo,
          reply_to: enquiry.email,
          subject: `Vamos advisory: ${enquiry.name}${
            enquiry.company ? " (" + enquiry.company + ")" : ""
          }`,
          text: formatEmailBody(enquiry),
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Resend ${res.status}: ${body}`);
      }
      result.delivered.push("resend");
    } catch (err) {
      result.errors.push({
        channel: "resend",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Always log to stdout — Vercel captures these and we never lose a lead.
  console.log("[advisory] enquiry submitted", {
    ...enquiry,
    delivery: result,
  });

  return result;
}

function formatTelegramMessage(e: AdvisoryEnquiry): string {
  const lines = [
    "*New advisory enquiry — vamos.net*",
    "",
    `*Name:* ${escMd(e.name)}`,
    `*Email:* ${escMd(e.email)}`,
  ];
  if (e.company) lines.push(`*Company:* ${escMd(e.company)}`);
  lines.push(`*Source:* ${escMd(e.source)}`);
  lines.push("");
  lines.push("*Message:*");
  lines.push(escMd(e.message));
  return lines.join("\n");
}

function formatEmailBody(e: AdvisoryEnquiry): string {
  const lines = [
    "New advisory enquiry submitted on vamos.net",
    "",
    `Name:     ${e.name}`,
    `Email:    ${e.email}`,
  ];
  if (e.company) lines.push(`Company:  ${e.company}`);
  lines.push(`Source:   ${e.source}`);
  lines.push(`Sent at:  ${e.submittedAt}`);
  lines.push("");
  lines.push("Message:");
  lines.push("");
  lines.push(e.message);
  return lines.join("\n");
}

function escMd(s: string): string {
  // Telegram Markdown escape — minimal but covers the dangerous characters
  // that would unbalance the message.
  return s.replace(/([*_`\[\]])/g, "\\$1");
}
