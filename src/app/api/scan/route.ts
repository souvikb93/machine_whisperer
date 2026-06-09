import { NextResponse } from "next/server";

/* Stub — wire real Claude vision once ANTHROPIC_API_KEY is set in .env.local */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    /* Return mock result so demo works without a key */
    return NextResponse.json({
      errorCode: "E-104",
      errorText: "Tool Failure – Replace Drill Bit",
      confidence: 94,
    });
  }

  try {
    const { image } = await request.json(); // base64 JPEG from client
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: image },
            },
            {
              type: "text",
              text: `This is a photo of an industrial machine HMI (Human Machine Interface) display showing an error.
Extract the error code and error message text exactly as shown on screen.
Respond with JSON only: {"errorCode":"...","errorText":"...","confidence":0-100}
If no error code is visible, use {"errorCode":"UNKNOWN","errorText":"Could not read display","confidence":0}`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const json = JSON.parse(text.match(/\{.*\}/s)?.[0] ?? "{}");

    return NextResponse.json(json);
  } catch (err) {
    console.error("Scan OCR error:", err);
    return NextResponse.json(
      { error: "OCR failed" },
      { status: 500 },
    );
  }
}
