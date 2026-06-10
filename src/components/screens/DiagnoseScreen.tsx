"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Wrench, BookOpen, FileText, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useDowntimeCounter } from "@/hooks/useDowntimeCounter";
import { getIssueById } from "@/lib/mockData";
import { STRINGS, MOCK_CONTENT, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { NotFoundScreen } from "./NotFoundScreen";
import type { Cause, Source } from "@/lib/types";

function sourceLabel(s: Source, lang: "en" | "de"): { icon: React.ElementType; label: string } {
  const sd = STRINGS.diagnose;
  if (s.type === "manual")   return { icon: BookOpen,     label: t(sd.oemManual, lang) };
  if (s.type === "shiftbook")return { icon: ClipboardList,label: t(sd.shiftLog, lang) };
  if (s.type === "log")      return { icon: FileText,     label: t(sd.maintLog, lang) };
  if (s.type === "plant")    return { icon: ClipboardList,label: t(sd.plantLog, lang) };
  return { icon: ClipboardList, label: t(sd.shiftLog, lang) };
}

function probabilityClasses(p: number) {
  if (p >= 50) return "bg-green-50 text-green-700 border-green-200";
  if (p >= 20) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-600 border-red-200";
}

function CauseCard({
  cause,
  localTitle,
  localDescription,
  selected,
  onSelect,
  lang,
}: {
  cause: Cause;
  localTitle: string;
  localDescription: string;
  selected: boolean;
  onSelect: () => void;
  lang: "en" | "de";
}) {
  const primarySource = cause.sources[0];
  const { icon: SrcIcon, label: srcLabel } = primarySource
    ? sourceLabel(primarySource, lang)
    : { icon: FileText, label: "Source" };

  const sd = STRINGS.diagnose;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border-2 bg-white p-4 text-left shadow-sm transition-all duration-200",
        selected
          ? "border-brand bg-brand/5 shadow-md"
          : "border-grey-200 hover:border-grey-300",
      )}
    >
      {/* Top row: combined pill + radio */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            probabilityClasses(cause.probability),
          )}
        >
          <span className="text-sm font-bold">{cause.probability}%</span>
          <span className="h-3.5 w-px bg-current opacity-30" />
          <SrcIcon className="h-3.5 w-3.5" />
          {srcLabel}
        </span>
        {/* Radio indicator */}
        <span
          className={cn(
            "h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
            selected ? "border-brand" : "border-grey-300",
          )}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          )}
        </span>
      </div>

      {/* Title + description */}
      <div className="mt-3">
        <h3 className="font-semibold text-grey-900">{localTitle}</h3>
        <p className="mt-1 text-sm text-grey-500">{localDescription}</p>
      </div>

      {/* Time + difficulty */}
      <div className="mt-3 flex items-center gap-4 text-xs text-grey-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {cause.estMinutes} {t(sd.min, lang)}
        </span>
        <span className="inline-flex items-center gap-1 capitalize">
          <Wrench className="h-3.5 w-3.5" /> {cause.difficulty}
        </span>
      </div>
    </button>
  );
}

export function DiagnoseScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang } = useLanguage();
  const s = STRINGS.diagnose;
  const issue = getIssueById(id);
  const live = useDowntimeCounter(
    issue?.stoppedAt ?? new Date(),
    issue?.machine.costPerMinute ?? 0,
  );
  const [selected, setSelected] = useState<number | null>(null);

  if (!issue) return <NotFoundScreen />;
  const causes = issue.causes ?? [];

  // Pull localised content for this issue
  const issueContent = MOCK_CONTENT[issue.id as keyof typeof MOCK_CONTENT];
  const causesContent = issueContent && "causes" in issueContent
    ? (issueContent as unknown as { causes: Record<string, { title: { en: string; de: string }; description: { en: string; de: string } }> }).causes
    : null;

  function getLocalCause(causeId: string) {
    if (!causesContent || !(causeId in causesContent)) return null;
    return causesContent[causeId];
  }

  function startFix() {
    if (selected === null) return;
    router.push(`/fix/${issue!.id}/${selected}/1`);
  }

  return (
    <AppShell
      title={t(s.title, lang)}
      back
      backHref={`/alert/${issue.id}`}
      hideBottomNav
      contentClassName="flex flex-col"
      right={
        <span className="rounded-md bg-grey-100 px-2 py-1 text-xs font-semibold text-grey-700">
          {issue.machine.id}
        </span>
      }
    >
      <div className="flex-1 space-y-4 px-4 pb-4 pt-4 overflow-y-auto">
        {/* Context strip */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-600">
            {issue.machine.id} · {issue.machine.line} · {t(s.station, lang)} {issue.machine.station}
          </span>
          <span className="font-mono text-sm text-red-600">{live.formatted}</span>
        </div>

        <p className="text-xs text-grey-400">
          {t(s.subtitle, lang)}
        </p>

        {/* Cause cards */}
        <div className="flex flex-col gap-3">
          {causes.map((cause, idx) => {
            const local = getLocalCause(cause.id);
            const localTitle       = local ? t(local.title, lang)       : cause.title;
            const localDescription = local ? t(local.description, lang) : cause.description;

            return (
              <motion.div
                key={cause.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: idx * 0.07 }}
              >
                <CauseCard
                  cause={cause}
                  localTitle={localTitle}
                  localDescription={localDescription}
                  selected={selected === idx}
                  onSelect={() => setSelected(idx)}
                  lang={lang}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="cta-footer shrink-0 px-4 pt-3">
        <Button
          size="lg"
          className="w-full"
          disabled={selected === null}
          onClick={startFix}
        >
          {t(s.startFix, lang)}
        </Button>
      </div>
    </AppShell>
  );
}
