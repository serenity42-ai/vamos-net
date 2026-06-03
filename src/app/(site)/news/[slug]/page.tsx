import { redirect } from "next/navigation";

// Old /news/[slug] URLs forward to /hub/[slug].
export default async function NewsArticleRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/hub/${slug}`);
}
