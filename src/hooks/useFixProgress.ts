"use client";

import { useCallback, useState } from "react";

interface FixProgress {
  completedSteps: number[];
  currentStep: number;
  setCurrentStep: (n: number) => void;
  isStepComplete: (n: number) => boolean;
  markComplete: (n: number) => void;
  unmarkComplete: (n: number) => void;
  toggleComplete: (n: number) => void;
}

/** Tracks which step numbers are checked off for the current cause. */
export function useFixProgress(initialStep = 1): FixProgress {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const isStepComplete = useCallback(
    (n: number) => completedSteps.includes(n),
    [completedSteps],
  );

  const markComplete = useCallback((n: number) => {
    setCompletedSteps((prev) => (prev.includes(n) ? prev : [...prev, n]));
  }, []);

  const unmarkComplete = useCallback((n: number) => {
    setCompletedSteps((prev) => prev.filter((s) => s !== n));
  }, []);

  const toggleComplete = useCallback((n: number) => {
    setCompletedSteps((prev) =>
      prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n],
    );
  }, []);

  return {
    completedSteps,
    currentStep,
    setCurrentStep,
    isStepComplete,
    markComplete,
    unmarkComplete,
    toggleComplete,
  };
}
