import HubPlaceholder from "@/components/HubPlaceholder";

export const metadata = {
  title: "Lifestyle | Player's Hub | VAMOS",
  description:
    "Padel beyond the court — culture, travel, food, fashion, the people who make the sport.",
};

export default function HubLifestylePage() {
  return (
    <HubPlaceholder
      section="Lifestyle"
      eyebrow="Cluster 04 · Culture"
      display="Padel"
      italic="off-court"
      intro="The sport beyond the glass walls. Travel guides for padel destinations, food and recovery, the fashion of the tour, and the people who shape the culture."
      articles={[
        { slug: "padel-travel-guide-marbella", title: "The padel traveller's guide to Marbella", status: "coming" },
        { slug: "padel-travel-guide-buenos-aires", title: "Buenos Aires: where padel was born", status: "coming" },
        { slug: "what-pros-eat-on-tour", title: "What the pros eat on tour", status: "coming" },
        { slug: "padel-style-on-court-and-off", title: "Padel style: on court and off", status: "coming" },
        { slug: "padel-clubs-paris", title: "The best padel clubs in Paris", status: "coming" },
        { slug: "padel-clubs-london", title: "The best padel clubs in London", status: "coming" },
        { slug: "padel-clubs-dubai", title: "The best padel clubs in Dubai", status: "coming" },
      ]}
    />
  );
}
