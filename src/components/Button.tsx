"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * Vamos.net Button — matches Figma component set.
 *
 * Spec (from Figma /v1/files/nodes):
 *  - Pill shape (radius-full)
 *  - Optional trailing icon-circle (↗ default) inside the right edge
 *  - Variants: primary (orange), outline (transparent on dark), ghost (transparent on light)
 *  - Sizes: sm (h-44px), md (h-53px default desktop button), lg
 *
 * Hover: primary → darker orange (#CC3D00). Outline → border becomes orange.
 *
 * Usage:
 *   <Button variant="primary">Read article</Button>
 *   <Button variant="outline" trailingIcon="arrow">Watch live</Button>
 *   <Button as={Link} href="/scores" variant="primary">Live scores</Button>
 */

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";
type TrailingIcon = "arrow" | "none";

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  trailingIcon?: TrailingIcon;
  children: ReactNode;
  className?: string;
};

type AnchorLikeProps = ButtonOwnProps & {
  as: typeof Link;
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps>;

type NativeButtonProps = ButtonOwnProps & {
  as?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

type ButtonProps = NativeButtonProps | AnchorLikeProps;

const sizeMap: Record<Size, { h: string; pl: string; pr: string; gap: string; text: string; trail: string }> = {
  // height / left-pad / right-pad / gap / label text class / trailing circle size
  sm: { h: "h-[44px]", pl: "pl-16", pr: "pr-4",  gap: "gap-12", text: "text-body-m-semibold", trail: "h-36 w-36" },
  md: { h: "h-[53px]", pl: "pl-24", pr: "pr-4",  gap: "gap-12", text: "text-body-l", trail: "h-45 w-45" },
  lg: { h: "h-[64px]", pl: "pl-32", pr: "pr-4",  gap: "gap-16", text: "text-body-l", trail: "h-56 w-56" },
};

const variantBase: Record<Variant, string> = {
  primary:
    "bg-brand text-text-contrast hover:bg-brand-dark border border-brand hover:border-brand-dark",
  outline:
    "bg-transparent text-text-contrast border border-[var(--color-border-secondary)] hover:border-brand",
  ghost:
    "bg-transparent text-text-primary border border-[var(--color-border-primary)] hover:border-brand",
  dark:
    "bg-bg-constant text-text-contrast border border-bg-constant hover:bg-text-primary",
};

const trailingBase: Record<Variant, string> = {
  primary: "bg-text-contrast text-brand",      // white circle, orange arrow
  outline: "bg-brand text-text-contrast",      // orange circle, white arrow
  ghost:   "bg-brand text-text-contrast",      // orange circle, white arrow
  dark:    "bg-brand text-text-contrast",      // orange circle, white arrow
};

function ArrowUpRight({ className }: { className?: string }) {
  // Stroke-based icon — inherits currentColor so the trailing circle class controls it.
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = "primary",
      size = "md",
      trailingIcon = "none",
      className = "",
      children,
      ...rest
    } = props as ButtonOwnProps & Record<string, unknown>;

    const sz = sizeMap[size];
    const hasIcon = trailingIcon !== "none";

    const base = [
      "inline-flex items-center justify-center select-none",
      "rounded-full",
      sz.h,
      hasIcon ? `${sz.pl} ${sz.pr}` : `${sz.pl} pr-24`,
      "gap-12",
      "font-display font-semibold",
      "transition-colors duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantBase[variant],
    ].join(" ");

    const labelCls = sz.text;

    const trailingCircle = hasIcon ? (
      <span
        className={[
          "inline-flex items-center justify-center rounded-full shrink-0",
          sz.trail,
          trailingBase[variant],
        ].join(" ")}
        aria-hidden="true"
      >
        <ArrowUpRight />
      </span>
    ) : null;

    const content = (
      <>
        <span className={labelCls}>{children}</span>
        {trailingCircle}
      </>
    );

    if ("as" in props && props.as === Link) {
      const { href, ...anchorRest } = rest as { href: string };
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={`${base} ${className}`}
          {...(anchorRest as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={`${base} ${className}`}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

export default Button;
