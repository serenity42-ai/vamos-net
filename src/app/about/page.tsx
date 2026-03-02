import NewsletterSignup from "@/components/NewsletterSignup";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#0F1F2E] mb-6">About Vamos.net</h1>

      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
        <p>
          <strong>Vamos.net</strong> is the definitive platform for the world of padel. We bring you live scores,
          real-time rankings, in-depth news coverage, and everything you need to follow the fastest-growing
          racquet sport on the planet.
        </p>
        <p>
          Our mission is simple: make padel accessible to fans worldwide. Whether you are following the
          Premier Padel tour, tracking your favorite players in the rankings, or reading about the sport&apos;s
          explosive global growth, Vamos.net is your home.
        </p>

        <h2 className="text-xl font-bold text-[#0F1F2E] mt-8 mb-4">What We Cover</h2>
        <ul className="space-y-2">
          <li><strong>Live Scores</strong> &mdash; Real-time match updates from Premier Padel, WPT, and major tournaments worldwide.</li>
          <li><strong>Rankings</strong> &mdash; Up-to-date men&apos;s and women&apos;s padel rankings with trend tracking.</li>
          <li><strong>News</strong> &mdash; Tour coverage, player profiles, business developments, and coaching insights.</li>
          <li><strong>Analysis</strong> &mdash; Deep dives into tactics, form, and the evolution of the sport.</li>
        </ul>

        <h2 className="text-xl font-bold text-[#0F1F2E] mt-8 mb-4">Contact</h2>
        <p>
          Have a tip, suggestion, or just want to say hello? Reach out at{" "}
          <a href="mailto:hello@vamos.net" className="text-[#4ABED9] hover:underline">hello@vamos.net</a>.
        </p>
      </div>

      <NewsletterSignup />
    </main>
  );
}
