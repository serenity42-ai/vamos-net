import { Suspense } from "react";
import NewsPageClient from "./NewsPageClient";
import { fetchArticles } from "@/lib/ghost";
import { newsCategories } from "@/data/mock";

// Revalidate every 60 seconds so new posts in Ghost appear quickly.
export const revalidate = 60;

export default async function NewsPage() {
  const articles = await fetchArticles();
  return (
    // The client component reads `useSearchParams()` for the ?category=
    // filter. With ISR enabled on this route, Next prerenders the page
    // shell statically and requires the client subtree to declare a
    // Suspense boundary so it can bail out into CSR during hydration.
    <Suspense fallback={null}>
      <NewsPageClient articles={articles} categories={newsCategories} />
    </Suspense>
  );
}
