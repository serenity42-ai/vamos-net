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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vamos.net" },
    { "@type": "ListItem", position: 2, name: "Hub",  item: "https://vamos.net/hub" },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Padel Hub | VAMOS",
  description:
    "Padel news, reviews, training, lifestyle, and the business behind the world's fastest-growing sport.",
  url: "https://vamos.net/hub",
  publisher: {
    "@type": "Organization",
    name: "VAMOS",
    url: "https://vamos.net",
  },
};

export default async function HubPage() {
  const articles = await fetchArticles();
  return (
    // Client subtree reads ?category= via useSearchParams — needs a Suspense
    // boundary to keep ISR enabled for the page shell.
    <Suspense fallback={null}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <HubPageClient articles={articles} />
    </Suspense>
  );
}
