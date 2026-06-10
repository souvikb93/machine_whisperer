"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Euro, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STRINGS, t } from "@/lib/i18n";

export function ProfileScreen() {
  const { lang } = useLanguage();
  const s = STRINGS.profile;

  return (
    <AppShell title={t(s.title, lang)}>
      <div className="space-y-5 px-4 pb-6 pt-4">
        {/* Avatar + name */}
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white">
            HM
          </span>
          <div>
            <p className="text-lg font-bold text-grey-900">Hans Mueller</p>
            <p className="text-sm text-grey-500">{t(s.role, lang)}</p>
            <p className="text-sm text-grey-500">{t(s.zone, lang)}</p>
          </div>
        </Card>

        {/* Shift info */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
            {t(s.currentShift, lang)}
          </p>
          <Card className="divide-y divide-grey-100 p-4">
            {[
              { label: t(s.shift, lang),  value: t(s.shiftValue, lang) },
              { label: t(s.hours, lang),  value: t(s.hoursValue, lang) },
              { label: t(s.date, lang),   value: t(s.dateValue, lang) },
              { label: t(s.plant, lang),  value: t(s.plantValue, lang) },
              { label: t(s.zone2, lang),  value: t(s.zoneValue, lang) },
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
            {t(s.statsToday, lang)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Wrench,        value: "3",      label: t(s.issuesHandled, lang), color: "text-brand" },
              { icon: CheckCircle2,  value: "2",      label: t(s.resolved, lang),      color: "text-green-600" },
              { icon: Clock,         value: "19 min", label: t(s.avgFixTime, lang),    color: "text-grey-700" },
              { icon: Euro,          value: "€1,820", label: t(s.costSaved, lang),     color: "text-green-600" },
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
            {t(s.certifications, lang)}
          </p>
          <Card className="divide-y divide-grey-100 p-4">
            {[
              { name: t(s.cert1, lang), expiry: "Dec 2027" },
              { name: t(s.cert2, lang), expiry: "Mar 2026" },
              { name: t(s.cert3, lang), expiry: "Jan 2027" },
            ].map(({ name, expiry }) => (
              <div key={name} className="flex justify-between py-1.5">
                <span className="text-sm text-grey-700">{name}</span>
                <span className="text-xs text-grey-400">{t(s.until, lang)} {expiry}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
