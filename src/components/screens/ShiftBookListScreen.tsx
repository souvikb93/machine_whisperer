"use client";

import Link from "next/link";
import { Clock, CheckCircle2, Euro } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { MOCK_SHIFTBOOK, MOCK_ISSUES } from "@/lib/mockData";
import { formatEuro } from "@/lib/utils";

export function ShiftBookListScreen() {
  const resolved = MOCK_ISSUES.filter((i) => i.status === "resolved");

  return (
    <AppShell title="Shift Book">
      <div className="space-y-5 px-4 pb-6 pt-4">
        {/* Today summary */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: CheckCircle2, value: "7", label: "Resolved", color: "text-green-400" },
            { icon: Clock, value: "23 min", label: "Avg fix", color: "text-text-2" },
            { icon: Euro, value: "€4,200", label: "Saved", color: "text-green-400" },
          ].map(({ icon: Icon, value, label, color }) => (
            <Card key={label} className="flex flex-col items-center p-3 text-center">
              <Icon className={`h-4 w-4 mb-1 ${color}`} />
              <span className={`text-base font-bold ${color}`}>{value}</span>
              <span className="text-xs text-text-2">{label}</span>
            </Card>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-white">Today's Entries</h2>

        {MOCK_SHIFTBOOK.map((entry) => (
          <Link key={entry.issueId} href={`/shiftbook/${entry.issueId}`}>
            <Card className="p-4 hover:brightness-110 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {entry.errorCode} · {entry.machine.id}
                  </p>
                  <p className="mt-0.5 text-sm text-text-2">
                    {entry.machine.hall} · {entry.machine.line}
                  </p>
                </div>
                <span className="text-xs text-text-2">
                  {entry.fixMinutes} min
                </span>
              </div>
              <p className="mt-2 text-sm text-text-2">{entry.rootCause}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-text-2">
                <span className="text-green-400 font-medium">
                  {formatEuro(entry.moneySaved)} saved
                </span>
                <span>·</span>
                <span>{entry.technician}</span>
              </div>
            </Card>
          </Link>
        ))}

        {resolved.map((issue) => (
          <Link key={issue.id} href={`/shiftbook/${issue.id}`}>
            <Card className="border-l-4 border-l-green-500 p-4 opacity-80 hover:brightness-110 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {issue.errorCode} · {issue.machine.id}
                  </p>
                  <p className="mt-0.5 text-sm text-text-2">
                    {issue.machine.hall} · {issue.machine.line}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                </span>
              </div>
              <p className="mt-1 text-xs text-text-2">
                Fixed in {issue.fixDurationMin} min · {issue.technicianName}
              </p>
            </Card>
          </Link>
        ))}

        {MOCK_SHIFTBOOK.length === 0 && resolved.length === 0 && (
          <p className="py-10 text-center text-sm text-text-2">
            No entries yet this shift.
          </p>
        )}
      </div>
    </AppShell>
  );
}
