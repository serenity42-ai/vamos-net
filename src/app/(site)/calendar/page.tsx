import { redirect } from "next/navigation";

export const metadata = {
  title: "Schedule | VAMOS",
};

/**
 * /calendar has been renamed to /schedule in the v3 redesign.
 * Permanent redirect keeps old links / bookmarks working.
 */
export default function CalendarRedirect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") qs.set(k, v);
    else if (Array.isArray(v) && v[0]) qs.set(k, v[0]);
  }
  const tail = qs.toString();
  redirect(`/schedule${tail ? `?${tail}` : ""}`);
}
