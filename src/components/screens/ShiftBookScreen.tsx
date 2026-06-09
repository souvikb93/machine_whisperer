"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Share2,
  FileText,
  Link2,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BottomBar } from "@/components/layout/BottomBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getIssueById } from "@/lib/mockData";
import { NotFoundScreen } from "./NotFoundScreen";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-grey-500">{label}</span>
      <span className="text-right font-medium text-grey-900">{value}</span>
    </div>
  );
}

export function ShiftBookScreen() {
  const { id } = useParams<{ id: string }>();
  const issue = getIssueById(id);
  if (!issue) return <NotFoundScreen />;
  const { machine } = issue;

  return (
    <AppShell
      title="Shift Book"
      back
      backHref={`/capture/${issue.id}`}
      right={
        <button className="flex h-9 w-9 items-center justify-center rounded-md text-grey-600 hover:bg-grey-100">
          <Share2 className="h-4 w-4" />
        </button>
      }
    >
      <div className="pb-28">
        {/* Published banner */}
        <div className="flex items-center gap-2 border-b border-green-100 bg-green-50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Entry Published · Shared with Morning Shift
          </span>
        </div>

        <div className="space-y-4 px-4 pt-4">
          {/* Entry card */}
          <Card className="rounded-xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-grey-900">
                Incident Report
              </h2>
              <span className="text-xs text-grey-500">
                09 Jun 2026 · 12:04 PM
              </span>
            </div>
            <div className="divide-y divide-grey-100">
              <Row
                label="Incident"
                value={`${issue.errorCode} · ${machine.id} · ${machine.line} · ${machine.station}`}
              />
              <Row label="Root Cause" value="Spindle cooling fan blocked by dust" />
              <Row label="Resolution" value="Cleaned fan with compressed air" />
              <Row label="Fix Time" value="18 minutes" />
              <Row label="Technician" value={issue.technicianName} />
            </div>

            {/* Photos */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Before", "After"].map((l) => (
                <div
                  key={l}
                  className="flex h-24 flex-col items-center justify-center gap-1 rounded-lg bg-grey-100 text-grey-400"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-xs">{l}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="mt-4 rounded-md bg-grey-50 p-3 text-sm italic text-grey-600">
              &ldquo;E-104 indicated drill bit failure but actual cause was dust
              blocking the spindle cooling fan.&rdquo;
            </p>
          </Card>

          {/* Linked knowledge */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-grey-700">
              Knowledge linked
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <FileText className="h-4 w-4 text-grey-400" />
                OEM Manual — Section 12.4 (Spindle Maintenance)
              </div>
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <Link2 className="h-4 w-4 text-grey-400" />
                Similar: Plant Hamburg · Klaus W. · Feb 2025
              </div>
              <div className="flex items-center gap-2 text-sm text-grey-700">
                <Link2 className="h-4 w-4 text-grey-400" />
                Similar: Plant Munich · Nov 2024
              </div>
            </div>
          </div>

          {/* AI knowledge graph */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" /> Knowledge graph updated
            </div>
            <p className="text-sm text-blue-800">
              E-104 + CNC-series → Cooling fan blockage now ranked #2 cause (was
              #3).
            </p>
            <p className="mt-1 text-sm text-blue-800">
              Future technicians will see this fix first when probability
              matches.
            </p>
          </div>

          {/* Savings summary */}
          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            <p className="text-sm font-medium">This fix saved: €1,340 · 47 min</p>
            <p className="mt-0.5 text-sm">
              Today&apos;s shift total: €4,200 saved · 7 issues resolved
            </p>
          </div>
        </div>
      </div>

      <BottomBar>
        <div className="space-y-2">
          <Button variant="secondary" size="lg" className="w-full">
            Share with team
          </Button>
          <Link href="/dashboard" className="block">
            <Button variant="ghost" size="lg" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </BottomBar>
    </AppShell>
  );
}
