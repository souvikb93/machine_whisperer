import { NextResponse } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";

const FALLBACK: Record<string, unknown>[] = [
  {
    period: "today",
    timeSaved: "2.4 hrs",
    costSaved: "€1,820",
    resolved: 2,
    fixGuides: 5,
    topErrors: [
      { code: "E-104", labelEn: "Tool Failure", labelDe: "Werkzeugausfall", count: 3 },
      { code: "W-211", labelEn: "Wire Feed Issue", labelDe: "Drahtvorschubfehler", count: 1 },
    ],
    fastestFix: { name: "Klaus Brandt", mttr: "19 min" },
    resolutionRate: 67,
  },
  {
    period: "week",
    timeSaved: "14.2 hrs",
    costSaved: "€8,400",
    resolved: 18,
    fixGuides: 22,
    topErrors: [
      { code: "E-104", labelEn: "Tool Failure", labelDe: "Werkzeugausfall", count: 12 },
      { code: "W-302", labelEn: "Oil Pressure Low", labelDe: "Öldruck niedrig", count: 8 },
    ],
    fastestFix: { name: "Hans Mueller", mttr: "8 min" },
    resolutionRate: 78,
  },
  {
    period: "month",
    timeSaved: "32.9 hrs",
    costSaved: "€19,200",
    resolved: 47,
    fixGuides: 39,
    topErrors: [
      { code: "E-104", labelEn: "Spindle Overload", labelDe: "Spindelüberlastung", count: 52 },
      { code: "W-302", labelEn: "Oil Pressure Low", labelDe: "Öldruck niedrig", count: 22 },
    ],
    fastestFix: { name: "Stefan Richter", mttr: "4 min" },
    resolutionRate: 82,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "today";

  if (!isMongoConfigured()) {
    const data = FALLBACK.find(f => f.period === period) ?? FALLBACK[0];
    return NextResponse.json(data);
  }

  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();

    // Date range filter
    const now = new Date();
    let startDate = new Date(now);
    if (period === "week") startDate.setDate(now.getDate() - 7);
    else if (period === "month") startDate.setDate(now.getDate() - 30);
    else startDate.setHours(0, 0, 0, 0);

    // Aggregate top errors from shiftbook
    const topErrors = await db.collection("shiftbook").aggregate([
      { $group: {
          _id: "$error_number",
          count: { $sum: 1 },
          message: { $first: "$error_message" },
      }},
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]).toArray().catch(() => []);

    const total = await db.collection("shiftbook").countDocuments().catch(() => 0);
    const resolved = Math.min(total, Math.floor(total * 0.8));

    // ROI: €80/min downtime × avg 23 min
    const costSavedNum = resolved * 80 * 23;

    const result = {
      period,
      timeSaved: `${(resolved * 0.38).toFixed(1)} hrs`,
      costSaved: `€${costSavedNum.toLocaleString("de-DE")}`,
      resolved,
      fixGuides: Math.floor(resolved * 1.1),
      topErrors: topErrors.map(e => ({
        code: `E-${e._id}`,
        labelEn: String(e.message ?? "Unknown"),
        labelDe: String(e.message ?? "Unbekannt"),
        count: e.count as number,
      })),
      fastestFix: { name: "Klaus Brandt", mttr: "19 min" },
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 75,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Reports error:", err);
    const data = FALLBACK.find(f => f.period === period) ?? FALLBACK[0];
    return NextResponse.json(data);
  }
}
