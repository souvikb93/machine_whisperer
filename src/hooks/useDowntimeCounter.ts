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
  stoppedAt: Date | string,
  costPerMinute: number,
): DowntimeCounter {
  const stoppedDate = stoppedAt instanceof Date ? stoppedAt : new Date(stoppedAt);
  const [now, setNow] = useState<number>(() => stoppedDate.getTime());

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedMs = Math.max(0, now - stoppedDate.getTime());
  const elapsedMin = elapsedMs / 60000;

  return {
    elapsedMs,
    elapsedMin,
    formatted: formatElapsed(elapsedMs),
    cost: calcCost(elapsedMin, costPerMinute),
  };
}
