import { redirect } from "next/navigation";

export const metadata = {
  title: "Padel News | VAMOS",
  description: "Padel news has moved to the Padel Hub.",
};

// /news has been folded into /hub. Preserve link equity with a redirect.
export default function NewsRedirect() {
  redirect("/hub");
}
