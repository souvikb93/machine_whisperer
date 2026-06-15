"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Share2,
  FileText,
  Link2,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BottomBar } from "@/components/layout/BottomBar";
import { Button, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIssueById } from "@/lib/mockData";
import { STRINGS, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotFoundScreen } from "./NotFoundScreen";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-grey-500">{label}</span>
      <span className="text-right font-medium text-grey-900">{value}</span>
    </div>
  );
}

export function ShiftBookScreen() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const s = STRINGS.shiftbook;
  const issue = getIssueById(id);
  if (!issue) return <NotFoundScreen />;
  const { machine } = issue;

  return (
    <AppShell
      title={t(s.title, lang)}
      back
      backHref={`/capture/${issue.id}`}
      right={
        <IconButton aria-label="Share report">
          <Share2 className="h-4 w-4" />
        </IconButton>
      }
    >
      <div className="pb-28">
        {/* Published banner */}
        <div className="flex items-center gap-2 border-b border-green-100 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="text-sm font-semibold text-green-400">
            {t(s.published, lang)}
          </span>
        </div>

        <div className="space-y-4 px-4 pt-4">
          {/* Entry card */}
          <Card className="rounded-xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-grey-900">
                {t(s.incidentReport, lang)}
              </h2>
              <span className="text-xs text-grey-500">
                09 Jun 2026 · 12:04 PM
              </span>
            </div>
            <div className="divide-y divide-grey-100">
              <Row
                label={t(s.incident, lang)}
                value={`${issue.errorCode} · ${machine.id} · ${machine.line} · ${machine.station}`}
              />
              <Row label={t(s.rootCause, lang)}  value={t(s.rootCauseValue, lang)} />
              <Row label={t(s.resolution, lang)} value={t(s.resolutionValue, lang)} />
              <Row label={t(s.fixTime, lang)}    value={t(s.fixTimeValue, lang)} />
              <Row label={t(s.technician, lang)} value={issue.technicianName} />
            </div>

            {/* Photos */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[t(s.before, lang), t(s.after, lang)].map((l) => (
                <div
                  key={l}
                  className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg bg-grey-100 text-grey-400"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-xs">{l}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="mt-4 rounded-md bg-grey-50 p-3 text-sm italic text-grey-600">
              {t(s.entryNote, lang)}
            </p>
          </Card>

          {/* Linked knowledge */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-grey-700">
              {t(s.knowledgeLinked, lang)}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <FileText className="h-4 w-4 text-grey-400" />
                OEM Manual — Section 12.4 (Spindle Maintenance)
              </div>
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <Link2 className="h-4 w-4 text-grey-400" />
                {lang === "de" ? "Ähnlich: Werk Hamburg · Klaus W. · Feb 2025" : "Similar: Plant Hamburg · Klaus W. · Feb 2025"}
              </div>
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <Link2 className="h-4 w-4 text-grey-400" />
                {lang === "de" ? "Ähnlich: Werk München · Nov 2024" : "Similar: Plant Munich · Nov 2024"}
              </div>
            </div>
          </div>

          {/* AI knowledge graph */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-300">
              <Sparkles className="h-4 w-4" /> {t(s.kgUpdated, lang)}
            </div>
            <p className="text-sm text-navy-300/80">{t(s.kgBody1, lang)}</p>
            <p className="mt-1 text-sm text-navy-300/80">{t(s.kgBody2, lang)}</p>
          </div>

          {/* Savings summary */}
          <div className="rounded-lg bg-green-50 p-4 text-green-400">
            <p className="text-sm font-medium">{t(s.savedSummary, lang)} €1,340 · 47 min</p>
            <p className="mt-0.5 text-sm">{t(s.shiftTotal, lang)}</p>
          </div>
        </div>
      </div>

      <BottomBar>
        <div className="space-y-2">
          <Button variant="secondary" size="lg" className="w-full">
            {t(s.shareTeam, lang)}
          </Button>
          <Link href="/dashboard" className="block">
            <Button variant="ghost" size="lg" className="w-full">
              {t(s.backDashboard, lang)}
            </Button>
          </Link>
        </div>
      </BottomBar>
    </AppShell>
  );
}
