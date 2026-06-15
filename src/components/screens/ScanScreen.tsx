"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, VideoOff, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useScanResult } from "@/hooks/useScanResult";
import { getIssueById } from "@/lib/mockData";
import type { ScanResult } from "@/lib/types";
import { NotFoundScreen } from "./NotFoundScreen";

const MOCK_SCAN: ScanResult = {
  errorCode: "E-104",
  errorText: "Tool Failure – Replace Drill Bit",
  confidence: 94,
};

function Field({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-text-2">{label}</p>
        <p className={locked ? "text-sm text-text-2 mt-0.5" : "text-sm font-semibold text-white mt-0.5"}>
          {value}
        </p>
      </div>
      {!locked && (
        <button className="shrink-0 text-text-2 hover:text-white mt-0.5">
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ScanScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const issue = getIssueById(id);
  const { store } = useScanResult(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((s) => {
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => { if (active) setCameraError(e.message ?? "Camera unavailable"); });
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  async function capture() {
    if (scanning) return;
    setScanning(true);

    // Flash feedback
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

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

    // Stop camera stream
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 ?? "" }),
      });
      const data = await res.json();
      setResult(data.errorCode ? (data as ScanResult) : MOCK_SCAN);
    } catch {
      setResult(MOCK_SCAN);
    } finally {
      setScanning(false);
    }
  }

  function retake() {
    setCapturedImage(null);
    setResult(null);
    setScanning(false);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      .then((s) => {
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => setCameraError(e.message ?? "Camera unavailable"));
  }

  function confirm() {
    if (!result) return;
    store(result);
    router.push(`/diagnose/${id}`);
  }

  if (!issue) return <NotFoundScreen />;

  /* ── Phase 2: frozen photo + results ── */
  if (result) {
    return (
      <AppShell title="Scan HMI" back backHref={`/alert/${issue.id}`} hideBottomNav contentClassName="flex flex-col">
        <canvas ref={canvasRef} className="hidden" />

        {/* Frozen photo */}
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
          <div className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-green-400 backdrop-blur-sm">
            {result.confidence}% confident
          </div>
        </div>

        {/* Results panel */}
        <div className="flex flex-1 flex-col bg-surface overflow-hidden">
          <div className="px-5 pt-4 pb-2 shrink-0">
            <Progress value={result.confidence} fillClassName="bg-green-500" />
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <Field label="Error Code" value={result.errorCode} />
            <Field label="Error Description" value={result.errorText} />
            <Field label="Machine" value={issue.machine.id} locked />
            <Field label="Line" value={issue.machine.line} locked />
            <Field label="Station" value={issue.machine.station} locked />
            <p className="mt-1 pb-4 text-xs text-text-2">Tap editable fields to correct.</p>
          </div>
          <div className="shrink-0 border-t border-border px-5 py-4">
            <Button size="lg" className="w-full" onClick={confirm}>
              Confirm &amp; Start Diagnosis →
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ── Phase 1: live camera ── */
  return (
    <AppShell title="Scan HMI" back backHref={`/alert/${issue.id}`} hideBottomNav contentClassName="flex flex-col">
      <div className="flex flex-1 flex-col min-h-0">

        {/* Camera viewport — no interactive elements inside */}
        <div className="relative flex-1 min-h-0 mx-4 mt-4 overflow-hidden rounded-xl bg-black">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
              <VideoOff className="h-8 w-8" />
              <span className="text-sm">Camera unavailable</span>
              <span className="text-xs opacity-60">{cameraError}</span>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />

          {/* Corner brackets */}
          {["left-3 top-3 border-l-2 border-t-2",
            "right-3 top-3 border-r-2 border-t-2",
            "left-3 bottom-3 border-l-2 border-b-2",
            "right-3 bottom-3 border-r-2 border-b-2",
          ].map((c) => (
            <span key={c} className={`absolute h-8 w-8 border-white/80 pointer-events-none ${c}`} />
          ))}
          <p className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-xs text-white/70 pointer-events-none">
            Align HMI error display within frame
          </p>

          {/* White flash on capture */}
          {flash && <div className="absolute inset-0 bg-white animate-pulse pointer-events-none" />}
        </div>

        {/* Shutter row — OUTSIDE camera div, no z-index fights */}
        <div className="flex flex-col items-center gap-2 py-5 shrink-0">
          <button
            type="button"
            onClick={capture}
            disabled={scanning || !!cameraError}
            aria-label="Capture"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-white disabled:opacity-40 active:scale-95 transition-transform"
          >
            {scanning ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
            ) : (
              <span className="h-6 w-6 rounded-full bg-brand" />
            )}
          </button>
          <p className="text-xs text-text-2">
            {cameraError ? "Grant camera permission and reload." : scanning ? "Analysing…" : "Tap to capture HMI screen"}
          </p>
        </div>

      </div>
    </AppShell>
  );
}
