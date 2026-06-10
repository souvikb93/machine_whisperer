"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Bell, Globe, Moon, Shield, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STRINGS, t } from "@/lib/i18n";

export function SettingsScreen() {
  const { lang, setLang } = useLanguage();
  const s = STRINGS.settings;

  const SETTINGS = [
    {
      group: t(s.preferences, lang),
      items: [
        {
          icon: Bell,
          label: t(s.notifications, lang),
          value: t(s.notifValue, lang),
          onClick: undefined,
        },
        {
          icon: Moon,
          label: t(s.appearance, lang),
          value: t(s.appearValue, lang),
          onClick: undefined,
        },
        {
          icon: Globe,
          label: t(s.language, lang),
          value: null, // rendered as toggle below
          isLanguage: true,
        },
      ],
    },
    {
      group: t(s.account, lang),
      items: [
        {
          icon: Shield,
          label: t(s.privacy, lang),
          value: "",
          onClick: undefined,
        },
      ],
    },
  ];

  return (
    <AppShell title={t(s.title, lang)}>
      <div className="space-y-5 px-4 pb-6 pt-4">
        {SETTINGS.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-grey-400">
              {group}
            </p>
            <Card className="divide-y divide-grey-100 p-0">
              {items.map((item) => {
                const { icon: Icon, label } = item;

                // Language row — custom toggle UI
                if ("isLanguage" in item && item.isLanguage) {
                  return (
                    <div
                      key={label}
                      className="flex w-full items-center gap-3 px-4 py-3.5"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-grey-400" />
                      <span className="flex-1 text-sm font-medium text-grey-900">{label}</span>
                      {/* Pill toggle */}
                      <div className="flex items-center rounded-full border border-grey-200 bg-grey-100 p-0.5">
                        <button
                          type="button"
                          onClick={() => setLang("en")}
                          className={
                            lang === "en"
                              ? "rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white transition-all"
                              : "rounded-full px-3 py-1 text-xs font-medium text-grey-500 transition-all hover:text-grey-700"
                          }
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => setLang("de")}
                          className={
                            lang === "de"
                              ? "rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white transition-all"
                              : "rounded-full px-3 py-1 text-xs font-medium text-grey-500 transition-all hover:text-grey-700"
                          }
                        >
                          DE
                        </button>
                      </div>
                    </div>
                  );
                }

                // Standard row
                return (
                  <button
                    key={label}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-grey-400" />
                    <span className="flex-1 text-sm font-medium text-grey-900">{label}</span>
                    {item.value && (
                      <span className="text-xs text-grey-400">{item.value}</span>
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-grey-300" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        <p className="text-center text-xs text-grey-400">{t(s.version, lang)}</p>
      </div>
    </AppShell>
  );
}
