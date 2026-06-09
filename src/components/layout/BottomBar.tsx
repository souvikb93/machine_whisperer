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
    <div className="sticky bottom-0 z-30 mt-auto border-t border-grey-200 bg-white/95 backdrop-blur">
      <div className={cn("px-4 py-3", className)}>{children}</div>
    </div>
  );
}
