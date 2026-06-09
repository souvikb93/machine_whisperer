"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Euro, Wrench } from "lucide-react";

export function ProfileScreen() {
  return (
    <AppShell title="Profile">
      <div className="space-y-5 px-4 pb-6 pt-4">
        {/* Avatar + name */}
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
            HM
          </span>
          <div>
            <p className="text-lg font-bold text-grey-900">Hans Mueller</p>
            <p className="text-sm text-grey-500">Senior Technician</p>
            <p className="text-sm text-grey-500">Morning Shift · Hall A &amp; B</p>
          </div>
        </Card>

        {/* Shift info */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
            Current Shift
          </p>
          <Card className="divide-y divide-grey-100 p-4">
            {[
              { label: "Shift", value: "Morning Shift" },
              { label: "Hours", value: "06:00 – 14:00" },
              { label: "Date", value: "09 Jun 2026" },
              { label: "Plant", value: "Bosch Berlin" },
              { label: "Zone", value: "Hall A + Hall B" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5">
                <span className="text-sm text-grey-500">{label}</span>
                <span className="text-sm font-medium text-grey-900">{value}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Today's stats */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
            My Stats Today
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Wrench, value: "3", label: "Issues handled", color: "text-brand" },
              { icon: CheckCircle2, value: "2", label: "Resolved", color: "text-green-600" },
              { icon: Clock, value: "19 min", label: "Avg fix time", color: "text-grey-700" },
              { icon: Euro, value: "€1,820", label: "Cost saved", color: "text-green-600" },
            ].map(({ icon: Icon, value, label, color }) => (
              <Card key={label} className="p-4">
                <Icon className={`h-5 w-5 mb-1 ${color}`} />
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-grey-500">{label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
            Certifications
          </p>
          <Card className="divide-y divide-grey-100 p-4">
            {[
              { name: "CNC Operations Level 3", expiry: "Dec 2027" },
              { name: "Electrical Safety (BGV A3)", expiry: "Mar 2026" },
              { name: "Bosch Safety Induction", expiry: "Jan 2027" },
            ].map(({ name, expiry }) => (
              <div key={name} className="flex justify-between py-1.5">
                <span className="text-sm text-grey-700">{name}</span>
                <span className="text-xs text-grey-400">Until {expiry}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
