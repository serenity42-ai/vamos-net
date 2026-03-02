"use client";

import { useState } from "react";
import Image from "next/image";

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
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-white">
      {/* Subtle court-line background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <div className="w-[700px] h-[460px] border-[3px] border-[#0F1F2E] rounded-lg relative">
          <div className="w-full h-1/2 border-b-[3px] border-[#0F1F2E]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-full border-x-[3px] border-[#0F1F2E]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/logo.png"
            alt="Vamos.net — The World of Padel"
            width={500}
            height={120}
            className="mx-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-sm uppercase tracking-[0.35em] text-[#4ABED9] font-medium mb-10">
          The World of Padel
        </p>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#4ABED9] to-[#8AB300] mx-auto mb-10" />

        {/* Description */}
        <p className="text-xl text-[#0F1F2E] mb-3 leading-relaxed font-medium">
          Live scores. Rankings. News. Stats.
        </p>
        <p className="text-base text-gray-400 mb-10">
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
              className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0F1F2E] placeholder-gray-400 outline-none focus:border-[#8AB300]/50 focus:ring-2 focus:ring-[#8AB300]/10 transition-all text-base"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#0F1F2E] hover:bg-[#1a2d40] text-white font-bold rounded-xl transition-all text-base tracking-wide whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <div className="bg-[#8AB300]/10 border border-[#8AB300]/30 rounded-xl px-6 py-4 max-w-md mx-auto">
            <p className="text-[#6B8A00] font-semibold">¡Vamos! You&apos;re on the list.</p>
            <p className="text-gray-400 text-sm mt-1">We&apos;ll notify you when we launch.</p>
          </div>
        )}

        {/* Features preview */}
        <div className="mt-16 flex items-center justify-center gap-8 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium">
          <span>Live Scores</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Rankings</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>News</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Stats</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-xs text-gray-300">
          © 2026 Vamos.net — The World of Padel
        </p>
      </footer>
    </main>
  );
}
