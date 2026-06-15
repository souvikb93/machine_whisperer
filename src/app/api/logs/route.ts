import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";
import { MOCK_ISSUES, DASHBOARD_METRICS } from "@/lib/mockData";

const SEVERITY_MAP: Record<string, string> = {
  "critical": "critical",
  "warning":  "warning",
  "ok":       "ok",
};

function inferSeverity(errorMsg: string): "critical" | "warning" | "ok" {
  const msg = errorMsg.toLowerCase();
  if (msg.includes("failure") || msg.includes("error") || msg.includes("emergency")) return "critical";
  if (msg.includes("warning") || msg.includes("low") || msg.includes("worn")) return "warning";
  return "warning";
}

function shiftbookToIssue(doc: Record<string, unknown>, idx: number) {
  const id = doc._id ? String(doc._id) : `sb-${idx}`;
  const errorNum = String(doc.error_number ?? "");
  const errorMsg = String(doc.error_message ?? "Unknown error");
  const lineNo = String(doc.line_number ?? "1");
  const stationNo = String(doc.station_number ?? "1");
  const supplier = String(doc.supplier ?? "Unknown");
  const location = String(doc.location ?? "Hall A");
  const dateStr = String(doc.date ?? "");
  const timeStr = String(doc.time ?? "00:00");

  return {
    id,
    errorCode: errorNum ? `E-${errorNum}` : "E-000",
    errorText: errorMsg,
    status: "open" as const,
    severity: inferSeverity(errorMsg),
    machine: {
      id: `CNC-${lineNo.padStart(2, "0")}`,
      name: `${supplier} CNC`,
      hall: location,
      line: `Line ${lineNo}`,
      station: `St.${stationNo}`,
      costPerMinute: 80,
    },
    stoppedAt: new Date(`${dateStr} ${timeStr}`).toISOString(),
    causes: [],
    supplier,
  };
}

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      issues: MOCK_ISSUES,
      metrics: DASHBOARD_METRICS,
    });
  }

  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();

    // Try open_issues collection first, fall back to recent shiftbook entries
    let issues: ReturnType<typeof shiftbookToIssue>[] = [];

    const openIssues = await db.collection("open_issues")
      .find({})
      .sort({ date: -1, time: -1 })
      .limit(20)
      .toArray()
      .catch(() => []);

    if (openIssues.length > 0) {
      issues = openIssues.map((d, i) => shiftbookToIssue(d as Record<string, unknown>, i));
    } else {
      // Use recent shiftbook entries as "open" issues for demo
      const sbDocs = await db.collection("shiftbook")
        .find({})
        .sort({ _id: -1 })
        .limit(10)
        .toArray()
        .catch(() => []);

      issues = sbDocs.map((d, i) => shiftbookToIssue(d as Record<string, unknown>, i));
    }

    // Compute metrics
    const resolved = await db.collection("shiftbook")
      .countDocuments({ status: "resolved" })
      .catch(() => 7);

    const metrics = {
      activeIssues: issues.length,
      resolvedToday: resolved || 7,
      avgFixTimeMin: 23,
      costSavedToday: issues.length * 4200,
    };

    return NextResponse.json({ issues, metrics });
  } catch (err) {
    console.error("Logs error:", err);
    return NextResponse.json({ issues: MOCK_ISSUES, metrics: DASHBOARD_METRICS });
  }
}
