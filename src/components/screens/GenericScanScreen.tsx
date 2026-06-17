"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { VideoOff, Phone, Mail, ShieldCheck, Check, Pencil, RefreshCw, Camera } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { setScanResult } from "@/lib/scanStore";
import { STRINGS, t } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
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
    warrantyEn: "Active · until Mar 2027",
    warrantyDe: "Aktiv · bis März 2027",
    phone: "+49 7461 86-0",
    email: "service@dmgmori.com",
  },
};

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
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0 gap-3">
      <span className="shrink-0 text-xs text-text-2">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        {editing ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="min-w-0 rounded border border-brand bg-brand/10 px-2 py-0.5 text-right text-xs font-medium text-white outline-none"
            />
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); commit(); }}
              className="shrink-0 text-brand"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <span className="truncate text-xs font-semibold text-white">{value}</span>
            <button
              type="button"
              onClick={startEdit}
              className="shrink-0 text-text-2 hover:text-white transition-colors"
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
  const { lang } = useLanguage();
  const s = STRINGS.scan;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
  const [edits, setEdits] = useState<Record<EditableField, string>>({
    machine: MOCK_RESULT.machine,
    errorCode: MOCK_RESULT.errorCode,
    errorText: MOCK_RESULT.errorText,
  });
  const [diagnosing, setDiagnosing] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  const CHECKS = [
    t(s.checkOem, lang),
    t(s.checkShift, lang),
    t(s.checkMaint, lang),
  ];

  // Start camera
  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => {
        if (active) setCameraError(e.message ?? t(s.cameraUnavail, lang));
      });
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capture() {
    if (scanning) return;
    setScanning(true);

    // White flash
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    // Freeze frame
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let base64: string | null = null;

    if (canvas && video) {
      const w = video.videoWidth || video.clientWidth || 640;
      const h = video.videoHeight || video.clientHeight || 480;
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(video, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
      base64 = dataUrl.split(",")[1];
    }

    // Stop stream immediately
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Call API or fall back to mock
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 ?? "" }),
    })
      .then((r) => r.json())
      .then((data) => {
        // Always use MOCK_RESULT as base — API response only carries errorCode/errorText/confidence
        const detected = data.errorCode
          ? { ...MOCK_RESULT, errorCode: data.errorCode, errorText: data.errorText, confidence: data.confidence ?? MOCK_RESULT.confidence }
          : MOCK_RESULT;
        setResult(detected);
        setEdits({
          machine: detected.machine,
          errorCode: detected.errorCode,
          errorText: detected.errorText,
        });
      })
      .catch(() => {
        setResult(MOCK_RESULT);
        setEdits({ machine: MOCK_RESULT.machine, errorCode: MOCK_RESULT.errorCode, errorText: MOCK_RESULT.errorText });
      })
      .finally(() => setScanning(false));
  }

  function retake() {
    setCapturedImage(null);
    setResult(null);
    setScanning(false);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => setCameraError(e.message ?? t(s.cameraUnavail, lang)));
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

  /* ── Phase 2: frozen image + results ── */
  if (result) {
    return (
      <AppShell title={t(s.title, lang)} back backHref="/dashboard" hideBottomNav contentClassName="flex flex-col">
        <canvas ref={canvasRef} className="hidden" />

        {/* Frozen captured photo */}
        <div className="relative w-full bg-black shrink-0" style={{ height: "42%" }}>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured HMI" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/40 text-sm">No preview</div>
          )}
          <button
            onClick={retake}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retake
          </button>
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {result.machine}
            </span>
            <span className="rounded-full bg-green-900/70 px-3 py-1 text-xs font-semibold text-green-400 backdrop-blur-sm">
              {result.confidence}% confident
            </span>
          </div>
        </div>

        {/* Results panel */}
        <div className="flex flex-1 flex-col bg-surface overflow-hidden">
          <div className="px-5 pt-3 pb-2 shrink-0">
            <Progress value={result.confidence} fillClassName="bg-green-500" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {/* Editable error info */}
            <div className="mb-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-text-2">Detected</p>
              <EditableRow label="Error Code" value={edits.errorCode} onChange={(v) => setEdits((p) => ({ ...p, errorCode: v }))} />
              <EditableRow label="Description" value={edits.errorText} onChange={(v) => setEdits((p) => ({ ...p, errorText: v }))} />
              <EditableRow label="Machine" value={edits.machine} onChange={(v) => setEdits((p) => ({ ...p, machine: v }))} />
              <p className="mt-1 text-[10px] text-text-2">Tap <Pencil className="inline h-2.5 w-2.5" /> to correct any field.</p>
            </div>

            {/* Supplier info */}
            <div className="rounded-xl bg-surface-2 p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-white">{result.supplier.name}</p>
                  <p className="text-[11px] text-text-2">{result.supplier.country} · {result.supplier.partNumber}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-medium text-green-400 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {lang === "de" ? result.supplier.warrantyDe : result.supplier.warrantyEn}
                </span>
              </div>
              <div className="flex gap-3 pt-1 border-t border-border">
                <a href={`tel:${result.supplier.phone}`} className="flex items-center gap-1.5 text-xs text-brand">
                  <Phone className="h-3.5 w-3.5" />{result.supplier.phone}
                </a>
                <a href={`mailto:${result.supplier.email}`} className="flex items-center gap-1.5 text-xs text-brand">
                  <Mail className="h-3.5 w-3.5" />{result.supplier.email}
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-border px-5 py-4">
            <Button size="lg" className="w-full" onClick={confirm}>
              {t(s.ctaStart, lang)}
            </Button>
          </div>
        </div>

        {/* Diagnosis loading overlay */}
        <AnimatePresence>
          {diagnosing && (
            <motion.div
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nav px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand/15">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-brand" />
              </div>
              <h2 className="mb-1 text-lg font-bold text-white">{t(s.preparing, lang)}</h2>
              <p className="mb-8 text-sm text-text-2">{t(s.pulling, lang)}</p>
              <div className="flex flex-col gap-5 w-fit">
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
                        <Check className="h-5 w-5 shrink-0 text-green-400" />
                      ) : (
                        <span className={cn(
                          "h-5 w-5 shrink-0 rounded-full border-2 transition-colors duration-300 flex items-center justify-center",
                          active ? "border-brand" : "border-border-strong",
                        )}>
                          {active && (
                            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                          )}
                        </span>
                      )}
                      <span className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        done ? "text-green-400" : active ? "text-white" : "text-text-2",
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
      </AppShell>
    );
  }

  /* ── Phase 1: live camera ── */
  return (
    <AppShell title={t(s.title, lang)} back backHref="/dashboard" hideBottomNav contentClassName="flex flex-col">
      <div className="flex flex-1 flex-col min-h-0">

        {/* Camera viewport — no interactive elements inside */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-black">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
              <VideoOff className="h-10 w-10" />
              <span className="text-sm">{t(s.cameraUnavail, lang)}</span>
              <span className="text-xs opacity-60">{cameraError}</span>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />

          {/* Dark vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />

          {/* Scanning guide brackets */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative h-52 w-72">
              {[
                "left-0 top-0 border-l-2 border-t-2",
                "right-0 top-0 border-r-2 border-t-2",
                "left-0 bottom-0 border-l-2 border-b-2",
                "right-0 bottom-0 border-r-2 border-b-2",
              ].map((c) => (
                <span key={c} className={`absolute h-8 w-8 border-white/80 ${c}`} />
              ))}
            </div>
            {!scanning && (
              <p className="mt-4 rounded-full bg-black/40 px-4 py-1.5 text-center text-xs text-white/80 backdrop-blur-sm">
                {t(s.alignPrompt, lang)}
              </p>
            )}
          </div>

          {/* White flash */}
          {flash && <div className="absolute inset-0 bg-white pointer-events-none" />}
        </div>

        {/* Shutter row — OUTSIDE camera, no z-index fights */}
        <div className="flex flex-col items-center gap-2 py-5 shrink-0 bg-nav">
          <button
            type="button"
            onClick={capture}
            disabled={scanning || !!cameraError}
            aria-label="Capture"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand shadow-xl disabled:opacity-40 active:scale-95 transition-transform"
          >
            {scanning ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Camera className="h-7 w-7 text-white" strokeWidth={2} />
            )}
          </button>
          <p className="text-xs text-text-2 text-center px-6">
            {cameraError ? "Allow camera access and reload." : scanning ? "Reading error screen…" : t(s.ctaScan, lang)}
          </p>
        </div>

      </div>
    </AppShell>
  );
}
