import type { ScanResult } from "./types";

const KEY = (id: string) => `mw_scan_${id}`;

export function getScanResult(issueId: string): ScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY(issueId));
    return raw ? (JSON.parse(raw) as ScanResult) : null;
  } catch {
    return null;
  }
}

export function setScanResult(issueId: string, result: ScanResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(issueId), JSON.stringify(result));
}
