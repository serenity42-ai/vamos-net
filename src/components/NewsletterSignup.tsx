"use client";

import { useState } from "react";

/**
 * Editorial newsletter signup block — ink band with big italic display
 * "The padel brief" treatment.
 */
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
    <section style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <div className="eyebrow" style={{ color: "var(--red)", marginBottom: 12 }}>
              ■ The padel brief
            </div>
            <h2 className="display" style={{ color: "var(--paper)" }}>
              Stay in the <span className="italic-serif">game</span>.
            </h2>
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 17,
                lineHeight: 1.5,
                color: "rgba(243,238,228,0.7)",
                maxWidth: 560,
              }}
            >
              Weekly. Scores, rankings, and the stories behind them. Delivered to your inbox.
              No spam, just padel.
            </p>
          </div>

          <div className="lg:col-span-5">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: "transparent",
                    border: "1px solid rgba(243,238,228,0.3)",
                    color: "var(--paper)",
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe →
                </button>
              </form>
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  border: "1px solid var(--lime)",
                  background: "rgba(212,255,58,0.08)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "var(--lime)",
                  }}
                >
                  You're on the list.
                </p>
                <p
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: "rgba(243,238,228,0.6)",
                    marginTop: 4,
                  }}
                >
                  We'll notify you with the latest.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
