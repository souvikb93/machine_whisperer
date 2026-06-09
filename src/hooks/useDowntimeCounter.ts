"use client";

import { useEffect, useState } from "react";
import { calcCost, formatElapsed } from "@/lib/utils";

interface DowntimeCounter {
  elapsedMs: number;
  elapsedMin: number;
  formatted: string; // HH:MM:SS
  cost: number; // estimated euro loss, live
}

/** Ticking stopwatch from `stoppedAt` → now. Updates every second. */
export function useDowntimeCounter(
  stoppedAt: Date,
  costPerMinute: number,
): DowntimeCounter {
  // Start from `stoppedAt` so the first (SSR + hydration) render is
  // deterministic — elapsed 0 — then tick from real time after mount.
  const [now, setNow] = useState<number>(() => stoppedAt.getTime());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedMs = Math.max(0, now - stoppedAt.getTime());
  const elapsedMin = elapsedMs / 60000;

  return {
    elapsedMs,
    elapsedMin,
    formatted: formatElapsed(elapsedMs),
    cost: calcCost(elapsedMin, costPerMinute),
  };
}
