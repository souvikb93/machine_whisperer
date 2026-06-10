"use client";

import { useState } from "react";
import { Clock, Euro, CheckCircle2, BookOpen, Menu } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { STRINGS, t } from "@/lib/i18n";

type PeriodIndex = 0 | 1 | 2;

const DATA: Record<PeriodIndex, {
  timeSaved: string;
  costSaved: string;
  resolved: number;
  fixGuides: number;
  topErrors: { code: string; labelEn: string; labelDe: string; count: number }[];
  fastestFix: { name: string; mttr: string };
  resolutionRate: number;
}> = {
  0: {
    timeSaved: "2.4 hrs",
    costSaved: "€1,820",
    resolved: 2,
    fixGuides: 5,
    topErrors: [
      { code: "E-104", labelEn: "Tool Failure",     labelDe: "Werkzeugausfall",      count: 3 },
      { code: "W-211", labelEn: "Wire Feed Issue",  labelDe: "Drahtvorschubfehler",  count: 1 },
    ],
    fastestFix: { name: "Klaus Brandt", mttr: "19 min" },
    resolutionRate: 67,
  },
  1: {
    timeSaved: "14.2 hrs",
    costSaved: "€8,400",
    resolved: 18,
    fixGuides: 22,
    topErrors: [
      { code: "E-104", labelEn: "Tool Failure",       labelDe: "Werkzeugausfall",             count: 12 },
      { code: "W-302", labelEn: "Oil Pressure Low",   labelDe: "Öldruck niedrig",             count: 8 },
      { code: "E-041", labelEn: "Axis Limit Overrun", labelDe: "Achsgrenzwert überschritten", count: 5 },
      { code: "E-101", labelEn: "Emergency Stop",     labelDe: "Notaus",                      count: 3 },
    ],
    fastestFix: { name: "Hans Mueller", mttr: "8 min" },
    resolutionRate: 78,
  },
  2: {
    timeSaved: "32.9 hrs",
    costSaved: "€19,200",
    resolved: 47,
    fixGuides: 39,
    topErrors: [
      { code: "E-104", labelEn: "Spindle Overload",    labelDe: "Spindelüberlastung",          count: 52 },
      { code: "W-302", labelEn: "Oil Pressure Low",    labelDe: "Öldruck niedrig",             count: 22 },
      { code: "E-041", labelEn: "Axis Limit Overrun",  labelDe: "Achsgrenzwert überschritten", count: 13 },
      { code: "E-101", labelEn: "Emergency Stop",      labelDe: "Notaus",                      count: 9 },
      { code: "W-210", labelEn: "Lubrication Warning", labelDe: "Schmierungswarnung",          count: 4 },
    ],
    fastestFix: { name: "Stefan Richter", mttr: "4 min" },
    resolutionRate: 82,
  },
};

export function DashboardScreen() {
  const { lang } = useLanguage();
  const s = STRINGS.dashboard;
  const [periodIdx, setPeriodIdx] = useState<PeriodIndex>(0);
  const d = DATA[periodIdx];
  const maxCount = Math.max(...d.topErrors.map((e) => e.count));

  const periods = s.periods[lang];

  const METRICS = [
    { key: "timeSaved" as const,  label: t(s.timeSaved, lang),  icon: Clock,        iconClass: "text-brand",      tint: "bg-brand/10" },
    { key: "costSaved" as const,  label: t(s.costSaved, lang),  icon: Euro,         iconClass: "text-green-600",  tint: "bg-green-500/10" },
    { key: "resolved" as const,   label: t(s.resolved, lang),   icon: CheckCircle2, iconClass: "text-blue-500",   tint: "bg-blue-500/10" },
    { key: "fixGuides" as const,  label: t(s.fixGuides, lang),  icon: BookOpen,     iconClass: "text-purple-500", tint: "bg-purple-500/10" },
  ];

  return (
    <AppShell
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-[0_2px_10px_-2px_rgba(226,0,21,0.55)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.5 2L5 11h6l-2.5 7L17 9h-6l.5-7z" fill="white" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-lg font-bold tracking-tight text-ink">ShiftAssist</p>
        </div>
      }
      right={
        <button
          type="button"
          aria-label="Menu"
          className="-mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-black/[0.05]"
        >
          <Menu className="h-5 w-5" />
        </button>
      }
    >
      <div className="space-y-4 px-4 pb-8 pt-4">

        {/* Period tabs */}
        <div className="flex gap-2">
          {periods.map((p, i) => (
            <button
              key={p}
              onClick={() => setPeriodIdx(i as PeriodIndex)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                periodIdx === i
                  ? "bg-grey-900 text-white"
                  : "bg-grey-100 text-grey-500 hover:bg-grey-200",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(({ key, label, icon: Icon, iconClass, tint }) => (
            <Card key={key} className="p-4">
              <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl", tint)}>
                <Icon className={cn("h-[18px] w-[18px]", iconClass)} />
              </div>
              <p className="text-[26px] font-bold leading-none tracking-tight text-ink tabular-nums">
                {String(d[key])}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Top error codes */}
        <Card className="p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
            {t(s.topErrors, lang).replace("{n}", String(d.topErrors.length))}
          </p>
          <div className="space-y-3">
            {d.topErrors.map(({ code, labelEn, labelDe, count }) => (
              <div key={code}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-grey-800">
                    {code}{" "}
                    <span className="font-normal text-grey-500">
                      ({lang === "de" ? labelDe : labelEn})
                    </span>
                  </span>
                  <span className="text-xs text-grey-500">
                    {count} {t(s.incidents, lang)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-grey-100">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Fastest fix */}
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-400">
              {t(s.fastestFix, lang)} {periods[periodIdx]}
            </p>
            <p className="mt-0.5 text-base font-bold text-grey-900">
              {d.fastestFix.name}
            </p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
            {d.fastestFix.mttr} {t(s.mttr, lang)}
          </span>
        </Card>

        {/* Resolution rate */}
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-400">
              {t(s.resolutionRate, lang)}
            </p>
            <p className="text-xl font-bold text-grey-900">{d.resolutionRate}%</p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-grey-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${d.resolutionRate}%` }}
            />
          </div>
        </Card>

      </div>
    </AppShell>
  );
}
