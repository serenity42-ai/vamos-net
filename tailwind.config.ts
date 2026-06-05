import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: "var(--color-brand-primary)",
          dark: "var(--color-brand-primary-dark)",
          light: "var(--color-brand-primary-light)",
        },
        // Background
        bg: {
          page: "var(--color-bg-page)",
          white: "var(--color-bg-white)",
          overlay: "var(--color-bg-overlay)",
          gray: "var(--color-bg-gray)",
          constant: "var(--color-bg-constant)",
        },
        // Text
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
          contrast: "var(--color-text-contrast)",
          error: "var(--color-text-error)",
        },
        // Border
        border: {
          primary: "var(--color-border-primary)",
          secondary: "var(--color-border-secondary)",
          color: "var(--color-border-color)",
          error: "var(--color-border-error)",
        },
        // Icon
        icon: {
          primary: "var(--color-icon-primary)",
          secondary: "var(--color-icon-secondary)",
          tertiary: "var(--color-icon-tertiary)",
          contrast: "var(--color-icon-contrast)",
          error: "var(--color-icon-error)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Archivo", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Token sizes mapped, line-height included
        "12": ["12px", { lineHeight: "16px" }],
        "14": ["14px", { lineHeight: "20px" }],
        "16": ["16px", { lineHeight: "24px" }],
        "20": ["20px", { lineHeight: "28px" }],
        "24": ["24px", { lineHeight: "30px" }],
        "28": ["28px", { lineHeight: "30px" }],
        "32": ["32px", { lineHeight: "32px" }],
        "40": ["40px", { lineHeight: "40px" }],
      },
      spacing: {
        // Match Figma token scale; numerics align with px values.
        // Includes Figma-spec sizes (4/8/12/16/.../80) plus the widget
        // dimensions used across v3 components.
        "4": "4px",   "5": "5px",   "8": "8px",
        "12": "12px", "14": "14px", "15": "15px",
        "16": "16px", "20": "20px", "24": "24px",
        "28": "28px", "32": "32px", "36": "36px",
        "40": "40px", "43": "43px", "44": "44px",
        "45": "45px", "48": "48px", "52": "52px",
        "53": "53px", "56": "56px", "60": "60px",
        "64": "64px", "72": "72px", "80": "80px",
        "90": "90px", "96": "96px",
      },
      borderRadius: {
        "4": "4px",   "8": "8px",   "12": "12px",
        "16": "16px", "20": "20px", "24": "24px",
        "32": "32px", "40": "40px",
        full: "9999px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
