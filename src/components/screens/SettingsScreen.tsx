"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Bell, Globe, Moon, Shield, ChevronRight } from "lucide-react";

const SETTINGS = [
  {
    group: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", value: "All alerts on" },
      { icon: Moon, label: "Appearance", value: "System default" },
      { icon: Globe, label: "Language", value: "English" },
    ],
  },
  {
    group: "Account",
    items: [
      { icon: Shield, label: "Privacy & Security", value: "" },
    ],
  },
];

export function SettingsScreen() {
  return (
    <AppShell title="Settings">
      <div className="space-y-5 px-4 pb-6 pt-4">
        {SETTINGS.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
              {group}
            </p>
            <Card className="divide-y divide-grey-100 p-0">
              {items.map(({ icon: Icon, label, value }) => (
                <button
                  key={label}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <Icon className="h-5 w-5 shrink-0 text-grey-400" />
                  <span className="flex-1 text-sm font-medium text-grey-900">{label}</span>
                  {value && <span className="text-xs text-grey-400">{value}</span>}
                  <ChevronRight className="h-4 w-4 shrink-0 text-grey-300" />
                </button>
              ))}
            </Card>
          </div>
        ))}

        <p className="text-center text-xs text-grey-400">MachineWhisperer v0.1.0</p>
      </div>
    </AppShell>
  );
}
