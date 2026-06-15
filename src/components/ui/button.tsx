"use client";

import * as React from "react";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Variant tokens ─────────────────────────────────────────────
// primary   — brand-red CTA, one per screen max
// secondary — surface-2 + border, supporting actions
// ghost     — transparent, text/icon actions in toolbars & footers
// danger    — destructive, always requires confirmation
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-active " +
    "shadow-[0_2px_12px_-2px_rgba(226,0,21,0.35)] hover:shadow-[0_4px_18px_-2px_rgba(226,0,21,0.5)]",
  secondary:
    "bg-surface-2 border border-border-strong text-white hover:brightness-110",
  ghost:
    "bg-transparent text-text-2 hover:text-white hover:bg-white/[0.08]",
  danger:
    "bg-surface-2 border border-red-500/30 text-red-500 " +
    "hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-400",
};

// Minimum touch target: sm=36px, md=44px, lg=48px
// sm is acceptable only inside dense UI with surrounding padding.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 min-w-[36px] px-4 text-sm rounded-full",
  md: "h-11 min-w-[44px] px-5 text-[15px] rounded-full",
  lg: "h-12 min-w-[48px] px-6 text-base rounded-full",
};

// ── Button ─────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows spinner; prevents duplicate submission */
  loading?: boolean;
  /** Brief success feedback — shows checkmark alongside label */
  success?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      success = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center gap-2 font-semibold select-none",
          "transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Press feedback
          "active:scale-[0.97]",
          // Keyboard focus ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70",
          "focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
          // Disabled
          "disabled:opacity-40 disabled:pointer-events-none",
          "cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        )}
        {/* Success checkmark */}
        {!loading && success && (
          <Check className="h-4 w-4 text-green-400 shrink-0" aria-hidden="true" />
        )}
        {/* Label — slightly dim when loading */}
        <span className={cn(loading && "opacity-70")}>{children}</span>
      </button>
    );
  },
);
Button.displayName = "Button";

// ── IconButton ─────────────────────────────────────────────────
// Square, icon-only. Use for toolbars, headers, and inline controls.
// ALWAYS provide aria-label — the icon alone is not accessible.
// Touch target: sm=36px (use with surrounding padding), md=40px standalone.

export type IconButtonSize = "sm" | "md";

const iconSizeClasses: Record<IconButtonSize, string> = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-10 w-10 rounded-xl",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "sm", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          "text-text-2 hover:text-white hover:bg-white/[0.08]",
          "transition-all duration-150",
          "active:scale-[0.95]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70",
          "focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
          "disabled:opacity-40 disabled:pointer-events-none",
          "cursor-pointer",
          iconSizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";
