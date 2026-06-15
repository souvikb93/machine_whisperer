"use client";

import Link from "next/link";
import { Clock, ScanLine } from "lucide-react";
import { cn, formatEuro, calcCost } from "@/lib/utils";
import { useDowntimeCounter } from "@/hooks/useDowntimeCounter";
import { useScanResult } from "@/hooks/useScanResult";
import { SeverityBadge, statusToBadgeKind } from "./SeverityBadge";
import type { Issue } from "@/lib/types";

const ACCENT: Record<string, string> = {
  critical: "border-l-red-500",
  warning: "border-l-amber-400",
  resolved: "border-l-green-500",
};

export function MachineCard({ issue }: { issue: Issue }) {
  const { machine, severity, status } = issue;
  const live = useDowntimeCounter(issue.stoppedAt, machine.costPerMinute);
  const { result: scanResult } = useScanResult(issue.id);

  const isResolved = status === "resolved";
  const accentKey = isResolved ? "resolved" : severity;
  const badgeKind = statusToBadgeKind(status, severity);

  /* Error code: from scan store → issue data → unknown */
  const errorCode = scanResult?.errorCode ?? issue.errorCode;
  const errorText = scanResult?.errorText ?? issue.errorText;

  const elapsedLabel = isResolved
    ? `Resolved in ${issue.fixDurationMin} min`
    : `Stopped ${Math.max(1, Math.floor(live.elapsedMin))} min ago`;

  const lossLabel = isResolved
    ? formatEuro(calcCost(issue.fixDurationMin ?? 0, machine.costPerMinute)) + " saved"
    : formatEuro(live.cost) + " loss";

  return (
    <Link
      href={`/alert/${issue.id}`}
      className={cn(
        "block rounded-lg border border-l-4 glass-card p-4 transition-all duration-200 hover:brightness-110 hover:-translate-y-px",
        ACCENT[accentKey] ?? "border-l-grey-300",
        isResolved && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-lg font-bold text-white">{machine.id}</span>
          <span className="ml-2 text-sm text-text-2">{machine.type}</span>
        </div>
        <SeverityBadge kind={badgeKind} />
      </div>

      <p className="mt-0.5 text-sm text-text-2">
        {machine.hall} · {machine.line} · Station {machine.station}
      </p>

      {errorCode ? (
        <p className="mt-2.5 text-sm font-medium text-white">
          {errorCode} · {errorText}
        </p>
      ) : (
        <p className="mt-2.5 inline-flex items-center gap-1 text-xs text-text-2">
          <ScanLine className="h-3.5 w-3.5" />
          Scan HMI to get error code
        </p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-sm text-text-2">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>{elapsedLabel} ·</span>
        <span
          className={cn(
            "font-medium",
            isResolved
              ? "text-green-400"
              : severity === "critical"
                ? "text-red-500"
                : "text-amber-400",
          )}
        >
          {lossLabel}
        </span>
      </div>
    </Link>
  );
}
