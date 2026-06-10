import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-brand active:bg-brand-active",
  secondary:
    "bg-white border border-line text-ink hover:bg-surface-2",
  ghost: "bg-transparent text-ink hover:bg-surface-2",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-5 text-[15px] rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-40 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
