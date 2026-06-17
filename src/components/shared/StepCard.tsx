import { CheckCircle2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step } from "@/lib/types";

export function StepCard({
  step,
  stepNumber,
  className,
}: {
  step: Step;
  stepNumber?: number;
  className?: string;
}) {
  const displayNumber = (stepNumber ?? step.number ?? 1).toString().padStart(2, "0");

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface border border-border rounded-xl p-5",
        className,
      )}
    >
      {/* Big background step number */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-3 right-4 text-[48px] font-bold leading-none text-white/10 select-none"
      >
        {displayNumber}
      </span>

      <div className="relative z-10 space-y-4">
        <h2 className="text-[17px] font-semibold text-white pr-12">
          {step.title}
        </h2>

        <p className="text-base text-text-2 leading-relaxed">
          {step.instruction}
        </p>

        {/* Photo area */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-surface-2">
          {step.photoUrl ? (
            <img
              src={step.photoUrl}
              alt={step.title ?? "Reference photo"}
              className="h-full w-full object-cover"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                t.nextElementSibling?.removeAttribute("hidden");
              }}
            />
          ) : null}
          <div
            hidden={!!step.photoUrl}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-2"
          >
            <ImageIcon className="h-7 w-7" />
            <span className="text-xs">Reference photo</span>
          </div>
        </div>

        {/* Expected condition */}
        <div className="flex items-start gap-2 rounded-md border border-green-700/40 bg-green-900/25 p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
          <div className="text-sm text-green-300">
            <span className="font-semibold">Expected: </span>
            {step.expectedCondition}
          </div>
        </div>
      </div>
    </div>
  );
}
