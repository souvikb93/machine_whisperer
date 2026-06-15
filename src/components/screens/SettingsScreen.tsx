"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Bell, Globe, Moon, Shield, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { STRINGS, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
          value: null,
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-2">
              {group}
            </p>
            <Card className="divide-y divide-border p-0">
              {items.map((item) => {
                const { icon: Icon, label } = item;

                /* Language row — EN/DE pill toggle */
                if ("isLanguage" in item && item.isLanguage) {
                  return (
                    <div
                      key={label}
                      className="flex w-full items-center gap-3 px-4 py-3.5"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-text-2" />
                      <span className="flex-1 text-sm font-medium text-white">{label}</span>
                      {/* Pill toggle */}
                      <div className="flex items-center rounded-full border border-border bg-surface-2 p-0.5">
                        {(["en", "de"] as const).map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setLang(code)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150",
                              lang === code
                                ? "bg-white text-nav shadow-sm"
                                : "text-text-2 hover:text-white",
                            )}
                          >
                            {code.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                /* Standard settings row */
                return (
                  <button
                    key={label}
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-text-2" />
                    <span className="flex-1 text-sm font-medium text-white">{label}</span>
                    {item.value && (
                      <span className="text-xs text-text-2">{item.value}</span>
                    )}
                    <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        <p className="text-center text-xs text-text-muted">{t(s.version, lang)}</p>
      </div>
    </AppShell>
  );
}
