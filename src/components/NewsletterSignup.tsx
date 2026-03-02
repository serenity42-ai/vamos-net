"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-[#0F1F2E] rounded-2xl px-4 py-10 sm:px-8 sm:py-12 md:px-12 text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
        Stay in the Game
      </h2>
      <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
        Get the latest padel scores, rankings, and news delivered to your inbox. No spam, just padel.
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#4ABED9] focus:ring-2 focus:ring-[#4ABED9]/20 transition-all text-sm"
          />
          <button
            type="submit"
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#4ABED9] hover:bg-[#3ba8c2] text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <div className="bg-[#3CB371]/15 border border-[#3CB371]/30 rounded-xl px-4 sm:px-6 py-4 max-w-md mx-auto">
          <p className="text-[#3CB371] font-semibold">You are on the list.</p>
          <p className="text-gray-400 text-sm mt-1">We will notify you with the latest updates.</p>
        </div>
      )}
    </section>
  );
}
