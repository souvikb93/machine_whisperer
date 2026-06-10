import { cn } from "@/lib/utils";

/** Fixed bottom CTA bar, centered to the max-w-lg column. */
export function BottomBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="cta-footer sticky bottom-0 z-30 mt-auto">
      <div className={cn("px-4 pt-3", className)}>{children}</div>
    </div>
  );
}
