import { cn } from "@/lib/utils";

type BadgeKind =
  | "critical"
  | "warning"
  | "resolved"
  | "in-progress"
  | "info";

const KIND_LABEL: Record<BadgeKind, string> = {
  critical: "CRITICAL",
  warning: "WARNING",
  resolved: "RESOLVED",
  "in-progress": "IN PROGRESS",
  info: "INFO",
};

const KIND_CLASSES: Record<BadgeKind, string> = {
  critical: "bg-red-50 text-red-600 border-red-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-100",
  "in-progress": "bg-blue-50 text-blue-700 border-blue-100",
  info: "bg-grey-100 text-grey-600 border-grey-200",
};

export function SeverityBadge({
  kind,
  label,
  className,
}: {
  kind: BadgeKind;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wide whitespace-nowrap",
        KIND_CLASSES[kind],
        className,
      )}
    >
      {kind === "critical" && (
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mw-pulse" />
      )}
      {label ?? KIND_LABEL[kind]}
    </span>
  );
}

/** Map an Issue's status/severity to the badge kind shown on cards. */
export function statusToBadgeKind(
  status: "open" | "in-progress" | "resolved",
  severity: "critical" | "warning" | "info",
): BadgeKind {
  if (status === "resolved") return "resolved";
  if (status === "in-progress") return "in-progress";
  if (severity === "critical") return "critical";
  if (severity === "warning") return "warning";
  return "info";
}
