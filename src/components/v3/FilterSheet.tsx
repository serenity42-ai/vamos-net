"use client";

/**
 * FilterSheet (S6) — tournament filter chooser.
 *
 *  - Mobile (<md): slides up from the bottom (translateY).
 *  - Desktop (>=md): centered modal with backdrop blur + fade.
 *  - Tournament chips render inside; single-select.
 *    Tapping the already-active chip returns to "All".
 *  - "Save filters" applies + closes.
 *  - X button or backdrop click cancels (no apply).
 */

import { useEffect, useMemo, useState } from "react";
import type { Tournament } from "@/lib/padel-api";

export interface FilterSheetProps {
  open: boolean;
  tournaments: Tournament[];
  /** Current applied tournament id, "all" for none. */
  value: string;
  /** Called with the new id ("all" or tournament id string) when user hits Save. */
  onSave: (next: string) => void;
  /** Called when user cancels (X / backdrop / Esc). */
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FilterSheet({
  open,
  tournaments,
  value,
  onSave,
  onClose,
}: FilterSheetProps) {
  // Local working state — only commits on Save.
  const [selected, setSelected] = useState<string>(value);

  // Reset working state whenever the sheet opens or `value` changes.
  useEffect(() => {
    if (open) setSelected(value);
  }, [open, value]);

  // Esc cancels.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const chips = useMemo(() => {
    return [{ id: "all", name: "All tournaments" }, ...tournaments.map((t) => ({ id: String(t.id), name: t.name }))];
  }, [tournaments]);

  const handleChip = (id: string) => {
    setSelected((current) => {
      // Tap the active chip → returns to All.
      if (current === id && id !== "all") return "all";
      return id;
    });
  };

  return (
    <>
      {/* Backdrop — fades in/out */}
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-50 bg-bg-constant/40 backdrop-blur-sm transition-opacity"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Mobile: bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter tournaments"
        className={[
          "fixed inset-x-0 bottom-0 z-50 md:hidden",
          "bg-bg-white rounded-t-32 border-t border-border-primary",
          "p-20 pb-32",
        ].join(" ")}
        style={{
          transform: open ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 300ms ease",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <FilterSheetBody
          chips={chips}
          selected={selected}
          onChip={handleChip}
          onSave={() => onSave(selected)}
          onClose={onClose}
        />
      </div>

      {/* Desktop: centered modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter tournaments"
        className="fixed inset-0 z-50 hidden items-center justify-center md:flex"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease",
        }}
      >
        <div
          className="bg-bg-white rounded-24 border border-border-primary w-full max-w-[520px] p-24 m-16"
          style={{
            transform: open ? "scale(1)" : "scale(0.96)",
            transition: "transform 200ms ease",
            maxHeight: "85vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <FilterSheetBody
            chips={chips}
            selected={selected}
            onChip={handleChip}
            onSave={() => onSave(selected)}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
}

function FilterSheetBody({
  chips,
  selected,
  onChip,
  onSave,
  onClose,
}: {
  chips: Array<{ id: string; name: string }>;
  selected: string;
  onChip: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Drag handle (mobile) */}
      <div className="mx-auto mb-12 h-4 w-40 rounded-full bg-bg-gray md:hidden" />

      <div className="flex items-center justify-between mb-16">
        <h2 className="font-display font-semibold text-text-primary text-title-l">
          Filter tournaments
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="inline-flex h-40 w-40 items-center justify-center rounded-full border border-border-primary bg-bg-white text-text-primary hover:bg-bg-gray"
        >
          <CloseIcon />
        </button>
      </div>

      <p className="font-sans text-12 text-text-secondary mb-12 uppercase tracking-[0.04em] font-semibold">
        Tournament
      </p>
      <div className="flex flex-wrap gap-8 mb-24">
        {chips.map((c) => {
          const active = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChip(c.id)}
              aria-pressed={active}
              className={[
                "shrink-0 rounded-full border px-16 py-8 font-sans text-14 font-semibold transition-colors",
                active
                  ? "bg-text-primary text-text-contrast border-text-primary"
                  : "bg-bg-white text-text-secondary border-border-primary hover:text-text-primary",
              ].join(" ")}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSave}
        className="w-full rounded-full bg-brand text-text-contrast font-display font-semibold py-12 text-16 hover:bg-brand-dark transition-colors"
      >
        Save filters
      </button>
    </>
  );
}
