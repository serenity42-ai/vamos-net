import { Suspense } from "react";
import HubPageClient from "./HubPageClient";
import { fetchArticles } from "@/lib/ghost";

export const metadata = {
  title: "Padel Hub | VAMOS",
  description:
    "Padel news, reviews, training, lifestyle, and the business behind the world's fastest-growing sport.",
};

// Match ISR cadence used by the old /news page so editorial updates appear quickly.
export const revalidate = 60;

export default async function HubPage() {
  const articles = await fetchArticles();
  return (
    // Client subtree reads ?category= via useSearchParams — needs a Suspense
    // boundary to keep ISR enabled for the page shell.
    <Suspense fallback={null}>
      <HubPageClient articles={articles} />
    </Suspense>
  );
}
