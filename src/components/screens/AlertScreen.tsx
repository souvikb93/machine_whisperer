"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, ShieldOff, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDowntimeCounter } from "@/hooks/useDowntimeCounter";
import { useScanResult } from "@/hooks/useScanResult";
import { getIssueById } from "@/lib/mockData";
import { formatEuro } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { WarrantyStatus } from "@/lib/types";
import { NotFoundScreen } from "./NotFoundScreen";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-grey-500">{label}</span>
      <span className="text-sm font-medium text-grey-900">{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
      {children}
    </p>
  );
}

const WARRANTY_CONFIG: Record<
  WarrantyStatus,
  { icon: typeof ShieldCheck; label: string; className: string }
> = {
  active: { icon: ShieldCheck, label: "Active", className: "text-green-600" },
  expiring: { icon: ShieldAlert, label: "Expiring soon", className: "text-amber-600" },
  expired: { icon: ShieldOff, label: "Expired", className: "text-red-600" },
};

export function AlertScreen() {
  const { id } = useParams<{ id: string }>();
  const issue = getIssueById(id);
  const { result: scanResult } = useScanResult(id ?? "");
  const live = useDowntimeCounter(
    issue?.stoppedAt ?? new Date(),
    issue?.machine.costPerMinute ?? 0,
  );

  if (!issue) return <NotFoundScreen />;
  const { machine } = issue;
  const supplier = machine.supplier;

  const hasError = !!(scanResult?.errorCode ?? issue.errorCode);

  const warranty = WARRANTY_CONFIG[supplier.warrantyStatus];
  const WarrantyIcon = warranty.icon;

  return (
    <AppShell
      title="Alert"
      back
      backHref="/dashboard"
      hideBottomNav
      right={
        <span className="rounded-md bg-grey-100 px-2 py-1 text-xs font-semibold text-grey-700">
          {machine.id}
        </span>
      }
    >
      <div className="pb-4">
        {/* Severity banner */}
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-red-500 mw-pulse" />
          <span className="text-sm font-semibold text-red-600">
            CRITICAL · MACHINE STOPPED
          </span>
        </div>

        <div className="space-y-5 px-4 pt-4">
          {/* Downtime block */}
          <Card className="p-5 text-center">
            <div className="font-mono text-3xl font-bold text-red-600">
              {live.formatted}
            </div>
            <p className="mt-1.5 text-sm text-grey-500">
              Machine stopped · Downtime counting
            </p>
            <p className="mt-1 text-sm font-semibold text-red-600">
              Estimated loss: {formatEuro(live.cost)} and counting
            </p>
          </Card>

          {/* Location + Machine info */}
          <div>
            <SectionLabel>Location &amp; Machine</SectionLabel>
            <Card className="divide-y divide-grey-100 p-4">
              <div className="flex items-center gap-2 pb-2">
                <MapPin className="h-4 w-4 text-grey-400" />
                <span className="text-sm text-grey-700">
                  {machine.hall} · {machine.line} · Station {machine.station}
                </span>
              </div>
              <div className="pt-2">
                <InfoRow label="Machine ID" value={machine.id} />
                <InfoRow label="Type" value={machine.type} />
                <InfoRow label="Model" value={machine.model} />
                <InfoRow label="Serial No." value={machine.serialNumber} />
                <InfoRow label="Installed" value={machine.installDate} />
                <InfoRow label="Last Service" value={machine.lastMaintenance} />
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-grey-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> STOPPED
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Supplier info */}
          <div>
            <SectionLabel>Supplier</SectionLabel>
            <Card className="divide-y divide-grey-100 p-4">
              <div className="pb-3">
                <p className="font-semibold text-grey-900">{supplier.name}</p>
                <p className="text-sm text-grey-500">{supplier.country}</p>
              </div>
              <div className="space-y-2 pt-3">
                {supplier.partNumber && (
                  <InfoRow label="Part No." value={supplier.partNumber} />
                )}
                {supplier.leadTimeDays && (
                  <InfoRow
                    label="Lead Time"
                    value={`${supplier.leadTimeDays} business days`}
                  />
                )}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-grey-500">Warranty</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium",
                      warranty.className,
                    )}
                  >
                    <WarrantyIcon className="h-4 w-4" />
                    {warranty.label} · {supplier.warrantyExpiry}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* System info */}
          <div className="space-y-1 text-sm text-grey-500 pb-2">
            <p>Alert received: Auto-sensor</p>
            <p>Assigned to: Morning Shift · {issue.technicianName}</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-grey-200 bg-white px-4 py-3">
        <Link href={`/scan/${issue.id}`} className="block">
          <Button size="lg" className="w-full">
            {hasError ? "Re-scan HMI →" : "Scan HMI to Diagnose →"}
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
