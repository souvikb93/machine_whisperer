"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wrench, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SafetyBanner } from "@/components/shared/SafetyBanner";
import { StepCard } from "@/components/shared/StepCard";
import { getIssueById } from "@/lib/mockData";
import { STRINGS, MOCK_CONTENT, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotFoundScreen } from "./NotFoundScreen";
import type { Step } from "@/lib/types";

// Helper: apply localised overrides to a step
function localiseStep(step: Step, stepIdx: number, causeLocal: LocalCause | null, lang: "en" | "de"): Step {
  if (!causeLocal) return step;
  const sl = causeLocal.steps[stepIdx];
  if (!sl) return step;
  return {
    ...step,
    title:             t(sl.title, lang),
    instruction:       t(sl.instruction, lang),
    expectedCondition: sl.expectedCondition ? t(sl.expectedCondition, lang) : step.expectedCondition,
    safetyNote:        sl.safetyNote        ? t(sl.safetyNote, lang)        : step.safetyNote,
    ifPositive:        sl.ifPositive        ? t(sl.ifPositive, lang)        : step.ifPositive,
    ifNegative:        sl.ifNegative        ? t(sl.ifNegative, lang)        : step.ifNegative,
    tools:             (step.tools ?? []).map((tool) => {
      const toolMap = causeLocal.tools as Record<string, { en: string; de: string }>;
      return toolMap[tool] ? t(toolMap[tool], lang) : tool;
    }),
  };
}

type LocalStep = {
  title:             { en: string; de: string };
  instruction:       { en: string; de: string };
  expectedCondition?: { en: string; de: string };
  safetyNote?:       { en: string; de: string };
  ifPositive?:       { en: string; de: string };
  ifNegative?:       { en: string; de: string };
};

type LocalCause = {
  title:       { en: string; de: string };
  description: { en: string; de: string };
  steps:       LocalStep[];
  tools:       Record<string, { en: string; de: string }>;
};

export function GuidedFixScreen() {
  const params = useParams<{ id: string; causeIndex: string; step: string }>();
  const router = useRouter();
  const { lang } = useLanguage();
  const s = STRINGS.fix;

  const issue = getIssueById(params.id);
  const causeIndex = Number(params.causeIndex);
  const stepNo = Number(params.step);

  const cause = issue?.causes?.[causeIndex];
  const step = cause?.steps?.[stepNo - 1];
  if (!issue || !cause || !step) return <NotFoundScreen />;

  // Localised content
  const issueContent = MOCK_CONTENT[issue.id as keyof typeof MOCK_CONTENT];
  const causesContent = issueContent && "causes" in issueContent
    ? (issueContent as unknown as { causes: Record<string, LocalCause> }).causes
    : null;
  const causeLocal = causesContent ? causesContent[cause.id] ?? null : null;

  const localCauseTitle = causeLocal ? t(causeLocal.title, lang) : cause.title;
  const localStep = localiseStep(step, stepNo - 1, causeLocal, lang);

  const totalSteps = cause.steps.length;
  const isFirst = stepNo <= 1;
  const isLast = stepNo >= totalSteps;
  const causes = issue.causes ?? [];
  const hasNextCause = causeIndex + 1 < causes.length;

  function advance() {
    if (isLast) router.push(`/capture/${issue!.id}`);
    else router.push(`/fix/${issue!.id}/${causeIndex}/${stepNo + 1}`);
  }

  function didntFix() {
    if (hasNextCause) router.push(`/fix/${issue!.id}/${causeIndex + 1}/1`);
    else router.push(`/diagnose/${issue!.id}`);
  }

  return (
    <AppShell
      title={<span className="truncate">{localCauseTitle}</span>}
      back
      backHref={`/diagnose/${issue.id}`}
      hideBottomNav
      contentClassName="flex flex-col"
      right={
        <span className="shrink-0 text-sm font-medium text-grey-500">
          {t(s.step, lang)} {stepNo}/{totalSteps}
        </span>
      }
    >
      {/* Progress bar */}
      <Progress value={(stepNo / totalSteps) * 100} className="h-1 shrink-0 rounded-none" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-4 pt-4">

        {/* Context strip */}
        <div className="flex items-center justify-between text-sm text-grey-500">
          <span>{issue.machine.id} · {t(s.error, lang)} {issue.errorCode}</span>
          <span>~{cause.estMinutes} {t(s.min, lang)}</span>
        </div>

        {/* Rare case banner */}
        {causeIndex === 2 && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
            <div className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
              <Lightbulb className="h-4 w-4" /> {t(s.rareCase, lang)}
            </div>
            <p className="text-sm italic text-purple-700">
              {t(s.rareQuote, lang)}
            </p>
          </div>
        )}

        {/* Tools */}
        {localStep.tools && localStep.tools.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-grey-500">{t(s.toolsNeeded, lang)}</p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
              {localStep.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-grey-100 px-2.5 py-1 text-xs text-grey-700"
                >
                  <Wrench className="h-3 w-3" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safety */}
        {localStep.safetyNote && (
          <SafetyBanner level={localStep.safetyLevel ?? "warning"} text={localStep.safetyNote} />
        )}

        {/* Step card — pass localised step */}
        <motion.div
          key={`${causeIndex}-${stepNo}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <StepCard step={localStep} />
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="cta-footer shrink-0 px-4 pt-3">
        {isLast ? (
          <div className="flex gap-2">
            <Button
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={advance}
            >
              <CheckCircle2 className="h-5 w-5" />
              {t(s.machineFix, lang)}
            </Button>
            <button
              type="button"
              onClick={didntFix}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-grey-200 py-2.5 text-sm font-medium text-grey-500 transition-colors hover:border-red-200 hover:text-red-500"
            >
              <XCircle className="h-4 w-4" />
              {t(s.didntFix, lang)}
            </button>
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={advance}
          >
            <CheckCircle2 className="h-5 w-5" />
            {t(s.stepDone, lang)}
          </Button>
        )}
      </div>
    </AppShell>
  );
}
