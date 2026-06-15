import { TriangleAlert, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function SafetyBanner({
  level,
  text,
  className,
}: {
  level: "warning" | "danger";
  text: string;
  className?: string;
}) {
  const isDanger = level === "danger";
  const Icon = isDanger ? OctagonAlert : TriangleAlert;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border p-3",
        isDanger
          ? "bg-red-100 border-red-200"
          : "bg-amber-100 border-amber-200",
        className,
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 mt-0.5",
          isDanger ? "text-red-500" : "text-amber-400",
        )}
      />
      <p
        className={cn(
          "text-sm font-medium",
          isDanger ? "text-red-500" : "text-amber-400",
        )}
      >
        {text}
      </p>
    </div>
  );
}
