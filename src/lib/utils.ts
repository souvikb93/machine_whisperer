import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format milliseconds as HH:MM:SS */
export function formatElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Estimated loss = elapsed minutes * rate per minute. Returns rounded euros. */
export function calcCost(minutes: number, ratePerMin: number): number {
  return Math.round(minutes * ratePerMin);
}

/** €1,394 style formatting */
export function formatEuro(value: number): string {
  return "€" + Math.round(value).toLocaleString("en-US");
}

/** "11:42 AM · 09 Jun 2026" */
export function formatTimestamp(date: Date): string {
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const day = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${time} · ${day}`;
}
