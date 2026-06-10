"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Mic, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIssueById } from "@/lib/mockData";
import { STRINGS, MOCK_CONTENT, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { NotFoundScreen } from "./NotFoundScreen";

export function CaptureScreen() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const s = STRINGS.capture;
  const issue = getIssueById(id);

  const PARTS_KEYS = ["compressedAir", "drillBit", "toolHolder"] as const;

  const [rootCause, setRootCause] = useState(2);
  const [selectedParts, setSelectedParts] = useState<string[]>(["compressedAir"]);
  const [notes, setNotes] = useState(t(s.defaultNotes, lang));

  if (!issue) return <NotFoundScreen />;
  const causes = issue.causes ?? [];

  // Localised cause titles
  const issueContent = MOCK_CONTENT[issue.id as keyof typeof MOCK_CONTENT];
  const causesContent = issueContent && "causes" in issueContent
    ? (issueContent as unknown as { causes: Record<string, { title: { en: string; de: string } }> }).causes
    : null;

  function getLocalCauseTitle(causeId: string, fallback: string) {
    if (!causesContent || !(causeId in causesContent)) return fallback;
    return t(causesContent[causeId].title, lang);
  }

  function togglePart(key: string) {
    setSelectedParts((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  }

  return (
    <AppShell title={t(s.title, lang)} hideBottomNav contentClassName="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Success header */}
        <div className="border-b border-green-100 bg-green-50 px-4 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold text-green-700">
              {issue.machine.id} {t(s.backOnline, lang)}
            </span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            {t(s.downtime, lang)}
          </p>
        </div>

        <div className="space-y-5 px-4 py-4">
          {/* Savings */}
          <Card className="border-2 border-green-400 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-green-700">
                  €1,340 {t(s.recovered, lang)}
                </div>
                <p className="mt-1 text-xs text-grey-500">
                  {t(s.lineRate, lang)}
                </p>
              </div>
              <div className="text-right text-sm text-grey-600">
                47 {t(s.minSaved, lang)}
                <br />
                {t(s.vsManual, lang)}
              </div>
            </div>
          </Card>

          {/* Root cause */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-grey-700">
              {t(s.whatFixed, lang)}
            </h3>
            <div className="space-y-2">
              {causes.map((c, i) => {
                const selected = rootCause === i;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setRootCause(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                      selected
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-grey-200 bg-white text-grey-700",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                        selected ? "border-green-500 bg-green-500" : "border-grey-300",
                      )}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    {getLocalCauseTitle(c.id, c.title)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parts */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-grey-700">
              {t(s.partsUsed, lang)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {PARTS_KEYS.map((key) => {
                const on = selectedParts.includes(key);
                const label = t(s.parts[key], lang);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => togglePart(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                      on
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-grey-200 bg-white text-grey-600",
                    )}
                  >
                    <span>{on ? "✓" : "○"}</span>
                    {label}
                  </button>
                );
              })}
              <button className="inline-flex items-center gap-1 rounded-full border border-grey-200 bg-white px-3 py-1 text-xs text-grey-600">
                <Plus className="h-3 w-3" /> {t(s.add, lang)}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-grey-700">
                {t(s.whatHappened, lang)}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs text-grey-500">
                <Mic className="h-3.5 w-3.5" /> {t(s.voiceInput, lang)}
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border border-grey-200 bg-white p-3 text-sm text-grey-800 outline-none focus:border-grey-400"
            />
          </div>

          {/* Auto-filled summary */}
          <div className="rounded-lg bg-grey-100 p-4 text-xs text-grey-600">
            <dl className="grid grid-cols-2 gap-y-1.5">
              <dt>{t(s.error, lang)}</dt>
              <dd className="text-right text-grey-800">{issue.errorCode}</dd>
              <dt>{t(s.machine, lang)}</dt>
              <dd className="text-right text-grey-800">{issue.machine.id}</dd>
              <dt>{t(s.line, lang)}</dt>
              <dd className="text-right text-grey-800">{issue.machine.line}</dd>
              <dt>{t(s.station, lang)}</dt>
              <dd className="text-right text-grey-800">{issue.machine.station}</dd>
              <dt>{t(s.technician, lang)}</dt>
              <dd className="text-right text-grey-800">{issue.technicianName}</dd>
              <dt>{t(s.duration, lang)}</dt>
              <dd className="text-right text-grey-800">18 min</dd>
              <dt>{t(s.causesAttempted, lang)}</dt>
              <dd className="text-right text-grey-800">{rootCause + 1}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="cta-footer shrink-0 px-4 pt-3">
        <Link href={`/shiftbook/${issue.id}`} className="block">
          <Button size="lg" className="w-full">
            {t(s.publishCta, lang)}
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
