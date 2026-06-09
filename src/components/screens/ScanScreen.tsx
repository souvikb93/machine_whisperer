"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, VideoOff } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useScanResult } from "@/hooks/useScanResult";
import { getIssueById } from "@/lib/mockData";
import type { ScanResult } from "@/lib/types";
import { NotFoundScreen } from "./NotFoundScreen";

/* Mock OCR result — replace with real API call once key is set */
const MOCK_SCAN: ScanResult = {
  errorCode: "E-104",
  errorText: "Tool Failure – Replace Drill Bit",
  confidence: 94,
};

function Field({
  label,
  value,
  locked,
}: {
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-grey-100 py-2.5 last:border-0">
      <div className="min-w-0">
        <div className="text-xs text-grey-500">{label}</div>
        <div
          className={
            locked
              ? "text-sm text-grey-400"
              : "text-sm font-medium text-grey-900"
          }
        >
          {value}
        </div>
      </div>
      {!locked && (
        <button className="shrink-0 text-grey-400 hover:text-grey-700">
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  /* Start camera on mount */
  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } } })
      .then((s) => {
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      })
      .catch((e) => {
        if (active) setCameraError(e.message ?? "Camera unavailable");
      });
    return () => {
      active = false;
      setStream((s) => { s?.getTracks().forEach((t) => t.stop()); return null; });
    };
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
      /* base64 ready for real API: canvas.toDataURL("image/jpeg", 0.8) */
    }
    /* Simulate processing delay then show mock result */
    setTimeout(() => {
      setScanning(false);
      setResult(MOCK_SCAN);
    }, 1200);
  }

  function confirm() {
    if (!result) return;
    store(result);
    router.push(`/diagnose/${id}`);
  }

  if (!issue) return <NotFoundScreen />;

  return (
    <AppShell title="Scan HMI" back backHref={`/alert/${issue.id}`} contentClassName="flex flex-col">
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4 min-h-0">
        {/* Camera viewport */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-xl bg-grey-900">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/60">
              <VideoOff className="h-8 w-8" />
              <span className="text-sm">Camera unavailable</span>
              <span className="text-xs opacity-60">{cameraError}</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />

          {/* Corner brackets */}
          {["left-3 top-3 border-l-2 border-t-2",
            "right-3 top-3 border-r-2 border-t-2",
            "left-3 bottom-3 border-l-2 border-b-2",
            "right-3 bottom-3 border-r-2 border-b-2",
          ].map((c) => (
            <span key={c} className={`absolute h-8 w-8 border-white/80 ${c}`} />
          ))}

          {!cameraError && (
            <p className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-xs text-white/70">
              Align HMI error display within frame
            </p>
          )}

          {/* Shutter */}
          <button
            type="button"
            onClick={capture}
            disabled={scanning}
            aria-label="Capture"
            className="absolute bottom-4 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white/40 bg-white disabled:opacity-50"
          >
            {scanning ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-grey-400 border-t-brand" />
            ) : (
              <span className="h-5 w-5 rounded-full bg-brand" />
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-grey-500">
          {cameraError
            ? "Grant camera permission and reload."
            : "Point camera at the HMI error screen, then tap the shutter."}
        </p>
      </div>

      {/* Result sheet */}
      <AnimatePresence>
        {result && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResult(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-grey-200" />
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-grey-900">
                  Scan Result
                </h2>
                <span className="text-sm font-medium text-green-600">
                  {result.confidence}% confident
                </span>
              </div>
              <Progress
                value={result.confidence}
                className="mt-2"
                fillClassName="bg-green-500"
              />
              <div className="mt-4">
                <Field label="Error Code" value={result.errorCode} />
                <Field label="Error Text" value={result.errorText} />
                <Field label="Machine" value={issue.machine.id} locked />
                <Field label="Line" value={issue.machine.line} locked />
                <Field label="Station" value={issue.machine.station} locked />
              </div>
              <p className="mt-3 text-xs text-grey-500">Tap any field to correct.</p>
              <Button size="lg" className="mt-4 w-full" onClick={confirm}>
                Confirm &amp; Start Diagnosis →
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </AppShell>
  );
}
