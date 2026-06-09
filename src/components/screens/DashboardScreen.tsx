"use client";

import { useState } from "react";
import { Clock, Euro, CheckCircle2, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PERIODS = ["Today", "This Week", "This Month"] as const;
type Period = (typeof PERIODS)[number];

const DATA: Record<Period, {
  timeSaved: string;
  costSaved: string;
  resolved: number;
  fixGuides: number;
  topErrors: { code: string; label: string; count: number }[];
  fastestFix: { name: string; mttr: string };
  resolutionRate: number;
}> = {
  Today: {
    timeSaved: "2.4 hrs",
    costSaved: "€1,820",
    resolved: 2,
    fixGuides: 5,
    topErrors: [
      { code: "E-104", label: "Tool Failure", count: 3 },
      { code: "W-211", label: "Wire Feed Issue", count: 1 },
    ],
    fastestFix: { name: "Klaus Brandt", mttr: "19 min" },
    resolutionRate: 67,
  },
  "This Week": {
    timeSaved: "14.2 hrs",
    costSaved: "€8,400",
    resolved: 18,
    fixGuides: 22,
    topErrors: [
      { code: "E-104", label: "Tool Failure", count: 12 },
      { code: "W-302", label: "Oil Pressure Low", count: 8 },
      { code: "E-041", label: "Axis Limit Overrun", count: 5 },
      { code: "E-101", label: "Emergency Stop", count: 3 },
    ],
    fastestFix: { name: "Hans Mueller", mttr: "8 min" },
    resolutionRate: 78,
  },
  "This Month": {
    timeSaved: "32.9 hrs",
    costSaved: "€19,200",
    resolved: 47,
    fixGuides: 39,
    topErrors: [
      { code: "E-104", label: "Spindle Overload", count: 52 },
      { code: "W-302", label: "Oil Pressure Low", count: 22 },
      { code: "E-041", label: "Axis Limit Overrun", count: 13 },
      { code: "E-101", label: "Emergency Stop", count: 9 },
      { code: "W-210", label: "Lubrication Warning", count: 4 },
    ],
    fastestFix: { name: "Stefan Richter", mttr: "4 min" },
    resolutionRate: 82,
  },
};

const METRICS = [
  {
    key: "timeSaved" as const,
    label: "TIME SAVED",
    icon: Clock,
    iconClass: "text-brand",
  },
  {
    key: "costSaved" as const,
    label: "COST SAVED",
    icon: Euro,
    iconClass: "text-green-600",
  },
  {
    key: "resolved" as const,
    label: "RESOLVED",
    icon: CheckCircle2,
    iconClass: "text-blue-500",
  },
  {
    key: "fixGuides" as const,
    label: "FIX GUIDES",
    icon: BookOpen,
    iconClass: "text-purple-500",
  },
];

export function DashboardScreen() {
  const [period, setPeriod] = useState<Period>("Today");
  const d = DATA[period];
  const maxCount = Math.max(...d.topErrors.map((e) => e.count));

  return (
    <AppShell
      title={
        <div className="flex items-center gap-2.5">
          {/* ShiftAssist logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand ring-1 ring-white/20">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {/* Bolt / instant-fix shape */}
              <path d="M11.5 2L5 11h6l-2.5 7L17 9h-6l.5-7z" fill="white" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-lg font-bold tracking-tight text-white">ShiftAssist</p>
        </div>
      }
    >
      <div className="space-y-4 px-4 pb-8 pt-4">

        {/* Period tabs */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                period === p
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
          {METRICS.map(({ key, label, icon: Icon, iconClass }) => (
            <Card key={key} className="p-4">
              <Icon className={cn("mb-2 h-5 w-5", iconClass)} />
              <p className="text-2xl font-bold text-grey-900">
                {String(d[key])}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Top error codes */}
        <Card className="p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-grey-400">
            Top {d.topErrors.length} Error Codes
          </p>
          <div className="space-y-3">
            {d.topErrors.map(({ code, label, count }) => (
              <div key={code}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-grey-800">
                    {code}{" "}
                    <span className="font-normal text-grey-500">({label})</span>
                  </span>
                  <span className="text-xs text-grey-500">{count} incidents</span>
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
              Fastest Fix {period === "Today" ? "Today" : period === "This Week" ? "This Week" : "This Month"}
            </p>
            <p className="mt-0.5 text-base font-bold text-grey-900">
              {d.fastestFix.name}
            </p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
            {d.fastestFix.mttr} MTTR
          </span>
        </Card>

        {/* Resolution rate */}
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-grey-400">
              Resolution Rate
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
