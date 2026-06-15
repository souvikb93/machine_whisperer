import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/mongodb";

export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json({
      errorCode: "E-104",
      errorText: "Tool Failure – Replace Drill Bit",
      confidence: 94,
    });
  }

  try {
    const { image } = await request.json();
    const { analyzeImage } = await import("@/lib/gemini");

    const text = await analyzeImage(
      image,
      `This is a photo of an industrial CNC machine HMI (Human Machine Interface) display.
Extract the error code and error message exactly as shown on screen.
Return JSON only, no markdown: {"errorCode":"...","errorText":"...","confidence":0-100}
If no error visible: {"errorCode":"UNKNOWN","errorText":"Could not read display","confidence":0}`
    );

    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    return NextResponse.json(json);
  } catch (err) {
    console.error("Scan OCR error:", err);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}
