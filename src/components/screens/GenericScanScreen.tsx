"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { VideoOff, Phone, Mail, ShieldCheck, Check, Pencil } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { setScanResult } from "@/lib/scanStore";
import { cn } from "@/lib/utils";

const MOCK_RESULT = {
  machine: "CNC-05",
  issueId: "issue-001",
  errorCode: "E-104",
  errorText: "Tool Failure – Replace Drill Bit",
  confidence: 94,
  supplier: {
    name: "DMG MORI AG",
    country: "Germany",
    partNumber: "DMU50-DRILL-D12",
    warranty: "Active · until Mar 2027",
    phone: "+49 7461 86-0",
    email: "service@dmgmori.com",
  },
};

const CHECKS = [
  "OEM Manual",
  "Shift Book (12 entries)",
  "Maintenance Logs",
];

type EditableField = "machine" | "errorCode" | "errorText";

function EditableRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    onChange(draft.trim() || value);
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5 gap-2">
      <span className="shrink-0 text-xs text-grey-500">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        {editing ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-full min-w-0 rounded border border-brand bg-brand/5 px-1.5 py-0.5 text-right text-xs font-medium text-grey-900 outline-none"
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); commit(); }}
              className="shrink-0 rounded-full p-0.5 text-brand"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <span className="truncate text-xs font-medium text-grey-900">{value}</span>
            <button
              type="button"
              onClick={startEdit}
              className="shrink-0 rounded-full p-0.5 text-grey-300 hover:text-grey-500 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function GenericScanScreen() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
  const [edits, setEdits] = useState<Pick<typeof MOCK_RESULT, EditableField>>({
    machine: MOCK_RESULT.machine,
    errorCode: MOCK_RESULT.errorCode,
    errorText: MOCK_RESULT.errorText,
  });
  const [diagnosing, setDiagnosing] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      .then((s) => {
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => {
        if (active) setCameraError(e.message ?? "Camera unavailable");
      });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capture() {
    setScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
    }
    setTimeout(() => {
      setScanning(false);
      const r = MOCK_RESULT;
      setResult(r);
      setEdits({ machine: r.machine, errorCode: r.errorCode, errorText: r.errorText });
    }, 1200);
  }

  function confirm() {
    if (!result) return;
    setScanResult(result.issueId, {
      errorCode: edits.errorCode,
      errorText: edits.errorText,
      confidence: result.confidence,
    });
    setDiagnosing(true);
    setCheckedCount(0);
    CHECKS.forEach((_, i) => {
      setTimeout(() => {
        setCheckedCount(i + 1);
        if (i === CHECKS.length - 1) {
          setTimeout(() => router.push(`/diagnose/${result.issueId}`), 700);
        }
      }, (i + 1) * 850);
    });
  }

  return (
    <AppShell title="Scan HMI" back backHref="/dashboard" hideBottomNav contentClassName="flex flex-col">
      {/* Edge-to-edge camera */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-black">
        {cameraError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/50">
            <VideoOff className="h-10 w-10" />
            <span className="text-sm">Camera unavailable</span>
            <span className="text-xs opacity-60">{cameraError}</span>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* Dark vignette edges */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />

        {/* Centered scanning guide */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative h-52 w-72">
            {[
              "left-0 top-0 border-l-2 border-t-2 rounded-tl-sm",
              "right-0 top-0 border-r-2 border-t-2 rounded-tr-sm",
              "left-0 bottom-0 border-l-2 border-b-2 rounded-bl-sm",
              "right-0 bottom-0 border-r-2 border-b-2 rounded-br-sm",
            ].map((c) => (
              <span key={c} className={`absolute h-8 w-8 border-white ${c}`} />
            ))}
          </div>
          {!cameraError && !scanning && !result && (
            <p className="mt-4 rounded-full bg-black/40 px-4 py-1.5 text-center text-xs text-white/80 backdrop-blur-sm">
              Align HMI screen within the frame
            </p>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 border-t border-grey-200 bg-white px-4 py-3">
        <Button size="lg" className="w-full" onClick={capture} disabled={scanning}>
          {scanning ? "Scanning…" : "Scan HMI for Diagnosis"}
        </Button>
      </div>

      {/* Full-screen diagnosis loader */}
      <AnimatePresence>
        {diagnosing && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-grey-200 border-t-brand" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-grey-900">Preparing Diagnosis</h2>
            <p className="mb-8 text-sm text-grey-400">Pulling context from all sources…</p>
            <div className="flex flex-col gap-5 w-full max-w-xs">
              {CHECKS.map((label, i) => {
                const done = checkedCount > i;
                const active = checkedCount === i;
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 24 }}
                    className="flex items-center gap-3"
                  >
                    {done ? (
                      <Check className="h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <span className={cn(
                        "h-5 w-5 shrink-0 rounded-full border-2 transition-colors duration-300",
                        active ? "border-brand" : "border-grey-300",
                      )}>
                        {active && (
                          <span className="flex h-full w-full items-center justify-center">
                            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                          </span>
                        )}
                      </span>
                    )}
                    <span className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      done ? "text-green-600" : active ? "text-grey-900" : "text-grey-300",
                    )}>
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result sheet */}
      <AnimatePresence>
        {result && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !diagnosing && setResult(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-grey-200" />

              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-grey-900">Machine Detected</h2>
                <span className="text-sm font-medium text-green-600">{result.confidence}% confident</span>
              </div>
              <Progress value={result.confidence} className="mt-2" fillClassName="bg-green-500" />

              {/* Editable error info */}
              <div className="mt-4 divide-y divide-grey-100 rounded-lg border border-grey-100">
                <EditableRow
                  label="Machine"
                  value={edits.machine}
                  onChange={(v) => setEdits((p) => ({ ...p, machine: v }))}
                />
                <EditableRow
                  label="Error Code"
                  value={edits.errorCode}
                  onChange={(v) => setEdits((p) => ({ ...p, errorCode: v }))}
                />
                <EditableRow
                  label="Error Text"
                  value={edits.errorText}
                  onChange={(v) => setEdits((p) => ({ ...p, errorText: v }))}
                />
              </div>

              {/* Supplier info — read only */}
              <div className="mt-3 divide-y divide-grey-100 rounded-lg border border-grey-100">
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-grey-900">{result.supplier.name}</p>
                    <p className="text-[11px] text-grey-400">{result.supplier.country} · Part: {result.supplier.partNumber}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-green-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {result.supplier.warranty}
                  </span>
                </div>
                <a href={`tel:${result.supplier.phone}`} className="flex items-center gap-2 px-3 py-2.5 text-xs text-blue-600">
                  <Phone className="h-3.5 w-3.5" />{result.supplier.phone}
                </a>
                <a href={`mailto:${result.supplier.email}`} className="flex items-center gap-2 px-3 py-2.5 text-xs text-blue-600">
                  <Mail className="h-3.5 w-3.5" />{result.supplier.email}
                </a>
              </div>

              <Button size="lg" className="mt-4 w-full" onClick={confirm}>
                Start Diagnosis →
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
