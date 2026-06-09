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
import { NotFoundScreen } from "./NotFoundScreen";

export function GuidedFixScreen() {
  const params = useParams<{ id: string; causeIndex: string; step: string }>();
  const router = useRouter();

  const issue = getIssueById(params.id);
  const causeIndex = Number(params.causeIndex);
  const stepNo = Number(params.step);

  const cause = issue?.causes?.[causeIndex];
  const step = cause?.steps?.[stepNo - 1];
  if (!issue || !cause || !step) return <NotFoundScreen />;

  const totalSteps = cause.steps.length;
  const isFirst = stepNo <= 1;
  const isLast = stepNo >= totalSteps;
  const causes = issue.causes ?? [];
  const hasNextCause = causeIndex + 1 < causes.length;
  const ruledOut = causes.slice(0, causeIndex).map((c) => c.title);

  function advance() {
    if (isLast) router.push(`/capture/${issue!.id}`);
    else router.push(`/fix/${issue!.id}/${causeIndex}/${stepNo + 1}`);
  }

  function didntFix() {
    if (hasNextCause) router.push(`/fix/${issue!.id}/${causeIndex + 1}/1`);
    else router.push(`/diagnose/${issue!.id}`);
  }

  function goBack() {
    router.push(`/fix/${issue!.id}/${causeIndex}/${stepNo - 1}`);
  }

  return (
    <AppShell
      title={<span className="truncate">{cause.title}</span>}
      back
      backHref={`/diagnose/${issue.id}`}
      hideBottomNav
      contentClassName="flex flex-col"
      right={
        <span className="shrink-0 text-sm font-medium text-grey-500">
          Step {stepNo}/{totalSteps}
        </span>
      }
    >
      {/* Progress bar */}
      <Progress value={(stepNo / totalSteps) * 100} className="h-1 shrink-0 rounded-none" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-4 pt-4">

        {/* Context strip */}
        <div className="flex items-center justify-between text-sm text-grey-500">
          <span>{issue.machine.id} · Error: {issue.errorCode}</span>
          <span>~{cause.estMinutes} min</span>
        </div>


        {/* Rare case banner */}
        {causeIndex === 2 && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
            <div className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700">
              <Lightbulb className="h-4 w-4" /> Rare case · Klaus W. · Plant Hamburg · Feb 2025
            </div>
            <p className="text-sm italic text-purple-700">
              &ldquo;Looked like a tool failure but the spindle was just running hot — cleaning the fan cleared it instantly.&rdquo;
            </p>
          </div>
        )}

        {/* Tools */}
        {step.tools && step.tools.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-grey-500">Tools needed:</p>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
              {step.tools.map((tool) => (
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
        {step.safetyNote && (
          <SafetyBanner level={step.safetyLevel ?? "warning"} text={step.safetyNote} />
        )}

        {/* Step card */}
        <motion.div
          key={`${causeIndex}-${stepNo}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <StepCard step={step} />
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-grey-200 bg-white px-4 py-3">
        {isLast ? (
          /* Last step: two side-by-side buttons */
          <div className="flex gap-2">
            <Button
              size="lg"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={advance}
            >
              <CheckCircle2 className="h-5 w-5" />
              Machine Fixed!
            </Button>
            <button
              type="button"
              onClick={didntFix}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-grey-200 py-2.5 text-sm font-medium text-grey-500 transition-colors hover:border-red-200 hover:text-red-500"
            >
              <XCircle className="h-4 w-4" />
              Didn&apos;t fix it
            </button>
          </div>
        ) : (
          /* All other steps: single primary CTA */
          <Button
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={advance}
          >
            <CheckCircle2 className="h-5 w-5" />
            Step Done — Continue
          </Button>
        )}
      </div>
    </AppShell>
  );
}
