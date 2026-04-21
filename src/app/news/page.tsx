import NewsPageClient from "./NewsPageClient";
import { fetchArticles } from "@/lib/ghost";
import { newsCategories } from "@/data/mock";

// Revalidate every 60 seconds so new posts in Ghost appear quickly.
export const revalidate = 60;

export default async function NewsPage() {
  const articles = await fetchArticles();
  return <NewsPageClient articles={articles} categories={newsCategories} />;
}
