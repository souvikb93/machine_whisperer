import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  fillClassName?: string;
}

export function Progress({ value, className, fillClassName }: ProgressProps) {
  return (
    <div
      className={cn(
        "w-full bg-grey-100 rounded-full h-1.5 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "h-full bg-brand rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          fillClassName,
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
