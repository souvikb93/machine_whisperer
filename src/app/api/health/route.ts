import { NextResponse } from "next/server";
import { isGeminiConfigured, isMongoConfigured } from "@/lib/mongodb";

export async function GET() {
  const mongoOk = isMongoConfigured();
  const geminiOk = isGeminiConfigured();

  let mongoConnected = false;
  if (mongoOk) {
    try {
      const { getDb } = await import("@/lib/mongodb");
      const db = await getDb();
      await db.command({ ping: 1 });
      mongoConnected = true;
    } catch {
      mongoConnected = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    gemini: geminiOk ? "configured" : "missing_key",
    mongo: mongoOk ? (mongoConnected ? "connected" : "error") : "missing_uri",
    timestamp: new Date().toISOString(),
  });
}
