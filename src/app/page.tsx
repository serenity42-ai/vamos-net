"use client";

import { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Beehiiv API
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#0F1923]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#4ABED9]/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#3CB371]/5 blur-[120px]" />
      
      {/* Court lines decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="w-[600px] h-[400px] border-2 border-white rounded-lg">
          <div className="w-full h-1/2 border-b-2 border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-2 border-white rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-[0.15em] text-white">
            VAM<span className="text-[#3CB371]">O</span>S
          </h1>
          <div className="mt-3 text-sm md:text-base tracking-[0.3em] text-[#4ABED9]/80 uppercase font-medium">
            The World of Padel
          </div>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#4ABED9] to-[#3CB371] mx-auto mb-8" />

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
          Live scores. Rankings. News. Stats.
        </p>
        <p className="text-base text-gray-500 mb-10">
          The definitive padel platform is launching soon.
        </p>

        {/* Email signup */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#3CB371]/50 focus:bg-white/[0.07] transition-all text-base"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#3CB371] hover:bg-[#2ea060] text-[#0F1923] font-bold rounded-xl transition-all text-base tracking-wide whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-[#3CB371]/10 border border-[#3CB371]/30 rounded-xl px-6 py-4 max-w-md mx-auto">
            <p className="text-[#3CB371] font-semibold">¡Vamos! You&apos;re on the list 🎾</p>
            <p className="text-gray-400 text-sm mt-1">We&apos;ll notify you when we launch.</p>
          </div>
        )}

        {/* Features preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🎾", label: "Live Scores" },
            { icon: "📊", label: "Rankings" },
            { icon: "📰", label: "News" },
            { icon: "🏆", label: "Stats" },
          ].map((item) => (
            <div key={item.label} className="group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-xs text-gray-600">
          © 2026 Vamos.net — The World of Padel
        </p>
      </footer>
    </main>
  );
}
