"use client";

import { useState, useEffect, useCallback } from "react";
import { getScanResult, setScanResult } from "@/lib/scanStore";
import type { ScanResult } from "@/lib/types";

export function useScanResult(issueId: string) {
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    setResult(getScanResult(issueId));
  }, [issueId]);

  const store = useCallback(
    (r: ScanResult) => {
      setScanResult(issueId, r);
      setResult(r);
    },
    [issueId],
  );

  return { result, store };
}
