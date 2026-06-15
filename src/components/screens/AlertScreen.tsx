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
import { STRINGS, MOCK_CONTENT, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
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

export function AlertScreen() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const s = STRINGS.alert;
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

  const WARRANTY_CONFIG: Record<
    WarrantyStatus,
    { icon: typeof ShieldCheck; label: string; className: string }
  > = {
    active:   { icon: ShieldCheck, label: t(s.warrantyActive, lang),   className: "text-green-400" },
    expiring: { icon: ShieldAlert, label: t(s.warrantyExpiring, lang), className: "text-amber-400" },
    expired:  { icon: ShieldOff,  label: t(s.warrantyExpired, lang),  className: "text-red-500" },
  };

  const warranty = WARRANTY_CONFIG[supplier.warrantyStatus];
  const WarrantyIcon = warranty.icon;

  // Localised machine type
  const machineContent = MOCK_CONTENT[issue.id as keyof typeof MOCK_CONTENT];
  const machineType = machineContent
    ? t((machineContent as unknown as { machineType: { en: string; de: string } }).machineType, lang)
    : machine.type;

  return (
    <AppShell
      title={t(s.title, lang)}
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
          <span className="text-sm font-semibold text-red-500">
            {t(s.criticalBanner, lang)}
          </span>
        </div>

        <div className="space-y-5 px-4 pt-4">
          {/* Downtime block */}
          <Card className="p-5 text-center">
            <div className="font-mono text-3xl font-bold text-red-500">
              {live.formatted}
            </div>
            <p className="mt-1.5 text-sm text-grey-500">
              {t(s.downtimeCaption, lang)}
            </p>
            <p className="mt-1 text-sm font-semibold text-red-600">
              {t(s.estimatedLoss, lang)} {formatEuro(live.cost)} {t(s.andCounting, lang)}
            </p>
          </Card>

          {/* Location + Machine info */}
          <div>
            <SectionLabel>{t(s.sectionLocation, lang)}</SectionLabel>
            <Card className="divide-y divide-grey-100 p-4">
              <div className="flex items-center gap-2 pb-2">
                <MapPin className="h-4 w-4 text-grey-400" />
                <span className="text-sm text-grey-700">
                  {machine.hall} · {machine.line} · {t(s.station, lang)} {machine.station}
                </span>
              </div>
              <div className="pt-2">
                <InfoRow label={t(s.machineId, lang)}    value={machine.id} />
                <InfoRow label={t(s.type, lang)}         value={machineType} />
                <InfoRow label={t(s.model, lang)}        value={machine.model} />
                <InfoRow label={t(s.serialNo, lang)}     value={machine.serialNumber} />
                <InfoRow label={t(s.installed, lang)}    value={machine.installDate} />
                <InfoRow label={t(s.lastService, lang)}  value={machine.lastMaintenance} />
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-grey-500">{t(s.statusLabel, lang)}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" /> {t(s.stopped, lang)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Supplier info */}
          <div>
            <SectionLabel>{t(s.sectionSupplier, lang)}</SectionLabel>
            <Card className="divide-y divide-grey-100 p-4">
              <div className="pb-3">
                <p className="font-semibold text-grey-900">{supplier.name}</p>
                <p className="text-sm text-grey-500">{supplier.country}</p>
              </div>
              <div className="space-y-2 pt-3">
                {supplier.partNumber && (
                  <InfoRow label={t(s.partNo, lang)} value={supplier.partNumber} />
                )}
                {supplier.leadTimeDays && (
                  <InfoRow
                    label={t(s.leadTime, lang)}
                    value={`${supplier.leadTimeDays} ${t(s.businessDays, lang)}`}
                  />
                )}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-grey-500">{t(s.warranty, lang)}</span>
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
            <p>{t(s.alertReceived, lang)}</p>
            <p>{t(s.assignedTo, lang)} {issue.technicianName}</p>
          </div>
        </div>
      </div>

      <div className="cta-footer sticky bottom-0 px-4 pt-3">
        <Link href={`/scan/${issue.id}`} className="block">
          <Button size="lg" className="w-full">
            {hasError ? t(s.ctaRescan, lang) : t(s.ctaScan, lang)}
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
