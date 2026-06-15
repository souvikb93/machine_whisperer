import { NextResponse } from "next/server";
import { isMongoConfigured, isGeminiConfigured } from "@/lib/mongodb";

export async function POST(request: Request) {
  const { issueId, resolution, technicianName, fixMinutes, errorCode, errorText } =
    await request.json();

  if (!isMongoConfigured()) {
    return NextResponse.json({ success: true, saved: false });
  }

  try {
    const { getDb } = await import("@/lib/mongodb");
    const db = await getDb();

    const entry: Record<string, unknown> = {
      record_id: issueId,
      resolved_at: new Date().toISOString(),
      technician: technicianName ?? "Technician",
      fix_minutes: fixMinutes ?? 0,
      resolution: resolution ?? "",
      error_code: errorCode,
      error_message: errorText,
      status: "resolved",
    };

    // Embed the resolution text for future vector search
    if (isGeminiConfigured() && resolution) {
      try {
        const { embedDocument } = await import("@/lib/gemini");
        entry.embedding = await embedDocument(
          `${errorCode} ${errorText}: ${resolution}`
        );
      } catch {
        // non-fatal
      }
    }

    await db.collection("resolutions").insertOne(entry);

    // Remove from open_issues if it exists there
    await db.collection("open_issues").deleteOne({ record_id: issueId }).catch(() => {});

    return NextResponse.json({ success: true, saved: true });
  } catch (err) {
    console.error("Resolve error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
