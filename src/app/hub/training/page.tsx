import HubPlaceholder from "@/components/HubPlaceholder";

export const metadata = {
  title: "Training | Player's Hub | VAMOS",
  description:
    "Padel technique, drills, mindset, fuel and recovery. Everything that makes you better between matches.",
};

export default function HubTrainingPage() {
  return (
    <HubPlaceholder
      section="Training"
      eyebrow="Cluster 05 · Get Better"
      display="Train to"
      italic="win"
      intro="Technique, drills, strategy, mindset, fuel and recovery. Original content from coaches and players who actually compete — not generic advice."
      articles={[
        { slug: "the-six-shots-every-beginner-needs", title: "The six shots every beginner needs", status: "coming" },
        { slug: "wall-play-guide", title: "Wall play: the shot that decides matches", status: "coming" },
        { slug: "padel-positioning-net-vs-baseline", title: "Positioning: net vs baseline, when and why", status: "coming" },
        { slug: "communicating-with-your-partner", title: "How to communicate with your partner when you're losing", status: "coming" },
        { slug: "padel-warm-up-routine", title: "A 5-minute padel warm-up routine that actually works", status: "coming" },
        { slug: "speed-and-reaction-drills", title: "Speed and reaction drills you can do at home", status: "coming" },
        { slug: "what-to-eat-before-a-match", title: "What to eat 90 minutes before a match", status: "coming" },
        { slug: "post-match-recovery-protocol", title: "The 3-day recovery protocol after a tournament", status: "coming" },
        { slug: "pre-match-mental-prep", title: "Pre-match mental prep of a top-100 player", status: "coming" },
        { slug: "common-padel-injuries", title: "Common padel injuries and how to prevent them", status: "coming" },
      ]}
    />
  );
}
