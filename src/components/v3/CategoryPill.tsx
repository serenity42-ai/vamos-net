"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CategoryPill — secondary category filter for Padel Hub (PH2, PH3).
 *
 * A rounded pill button shaped "Category: <Selected>" that opens a dropdown
 * with radio-style options below it. Only one category is active at a time;
 * closing the dropdown without choosing keeps the previous selection.
 *
 * Used under the sticky Tabs row when a non-All content type is active
 * (News, Reviews, etc.).
 */

export interface CategoryOption {
  label: string;
  value: string; // url-safe slug, "all" for the reset option
}

export interface CategoryPillProps {
  options: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  /** Label prefix shown in the pill, default "Category". */
  label?: string;
  className?: string;
}

export default function CategoryPill({
  options,
  value,
  onChange,
  label = "Category",
  className = "",
}: CategoryPillProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Resolve the currently selected option label (fallback to value if missing).
  const current = options.find((o) => o.value === value) ?? options[0];
  const currentLabel = current?.label ?? "All";

  // Outside-click + Esc to close. Mounted only while open to avoid leaking
  // listeners across renders.
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent | TouchEvent) {
      if (!rootRef.current) return;
      if (e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={["relative inline-block", className].join(" ")}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex items-center gap-8 rounded-full border border-border-primary bg-bg-white px-16 py-8",
          "font-sans text-16 leading-[24px] text-text-primary transition-colors",
          "hover:bg-bg-gray",
        ].join(" ")}
      >
        <span className="text-text-secondary">{label}:</span>
        <span className="font-semibold">{currentLabel}</span>
        <span
          aria-hidden="true"
          className={[
            "inline-block transition-transform",
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={`${label} options`}
          className={[
            "absolute left-0 top-[calc(100%+8px)] z-40 min-w-[220px]",
            "rounded-16 border border-border-primary bg-bg-white p-8 shadow-lg",
          ].join(" ")}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(opt.value)}
                className={[
                  "flex w-full items-center gap-12 rounded-12 px-12 py-8 text-left",
                  "text-body-s transition-colors",
                  selected
                    ? "text-brand"
                    : "text-text-primary hover:bg-bg-gray",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "relative inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-brand" : "border-border-primary",
                  ].join(" ")}
                >
                  {selected && (
                    <span className="block h-8 w-8 rounded-full bg-brand" />
                  )}
                </span>
                <span
                  className={selected ? "font-semibold" : "font-normal"}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
