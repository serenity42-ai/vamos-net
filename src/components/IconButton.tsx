"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * Vamos.net IconButton — circular 40-48px button, 4 variants matching Figma.
 *
 * Spec (from ButtonLive + Cell component sets in Figma):
 *  - ghost-dark: transparent w/ white-10% border, dark icon → hover #EBE9E9
 *  - light:     #FFFFFF/#F5F4F4 fill, dark icon → hover #EBE9E9
 *  - primary:   #FE4C00 fill, white icon → hover #CC3D00
 *  - primary-light: #FFE6DB fill, orange icon (Live "Default" state)
 *
 * Sizes:
 *  - sm: 40px
 *  - md: 44px
 *  - lg: 56px (Figma ButtonLive default)
 */

type Variant = "ghost-dark" | "light" | "primary" | "primary-light";
type Size = "sm" | "md" | "lg";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon: ReactNode;
  label: string; // accessible label
};

const sizeMap: Record<Size, string> = {
  sm: "h-40 w-40",
  md: "h-44 w-44",
  lg: "h-56 w-56",
};

const variantMap: Record<Variant, string> = {
  "ghost-dark":
    "bg-transparent text-text-contrast border border-[var(--color-border-secondary)] hover:bg-bg-gray hover:text-text-primary",
  light:
    "bg-bg-white text-text-primary hover:bg-bg-gray border border-border-primary",
  primary:
    "bg-brand text-text-contrast hover:bg-brand-dark border border-brand hover:border-brand-dark",
  "primary-light":
    "bg-brand-light text-brand hover:bg-brand hover:text-text-contrast border-2 border-brand",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = "light",
      size = "md",
      icon,
      label,
      className = "",
      ...rest
    },
    ref
  ) {
    const base = [
      "inline-flex items-center justify-center select-none rounded-full",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      sizeMap[size],
      variantMap[variant],
    ].join(" ");

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={`${base} ${className}`}
        {...rest}
      >
        {icon}
      </button>
    );
  }
);

export default IconButton;
