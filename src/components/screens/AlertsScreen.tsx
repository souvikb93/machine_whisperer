"use client";

import { motion } from "framer-motion";
import { CircleAlert, CheckCircle2, Clock, Euro } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/shared/MetricCard";
import { MachineCard } from "@/components/shared/MachineCard";
import { MOCK_ISSUES, DASHBOARD_METRICS } from "@/lib/mockData";
import { formatEuro } from "@/lib/utils";

export function AlertsScreen() {
  const activeCount = MOCK_ISSUES.filter((i) => i.status !== "resolved").length;

  return (
    <AppShell title="Alerts">
      <div className="space-y-5 px-4 pb-6 pt-4">
        <p className="text-sm text-grey-500">
          Bosch Plant Berlin · 09 Jun 2026 · 06:00–14:00
        </p>

        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={CircleAlert}
            iconClassName="text-red-500"
            value={String(DASHBOARD_METRICS.activeIssues)}
            valueClassName="text-red-600"
            label="Active Issues"
          />
          <MetricCard
            icon={CheckCircle2}
            iconClassName="text-green-500"
            value={String(DASHBOARD_METRICS.resolvedToday)}
            label="Resolved Today"
          />
          <MetricCard
            icon={Clock}
            iconClassName="text-grey-400"
            value={`${DASHBOARD_METRICS.avgFixTimeMin} min`}
            label="Avg Fix Time"
          />
          <MetricCard
            icon={Euro}
            iconClassName="text-green-500"
            value={formatEuro(DASHBOARD_METRICS.costSavedToday)}
            label="Cost Saved"
          />
        </div>

        {/* Active issues */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-grey-900">Active Issues</h2>
          <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs font-semibold text-grey-600">
            {activeCount}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_ISSUES.map((issue, idx) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.07 }}
            >
              <MachineCard issue={issue} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
