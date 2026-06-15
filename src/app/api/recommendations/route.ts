import { NextResponse } from "next/server";
import { isGeminiConfigured, isMongoConfigured } from "@/lib/mongodb";

const MOCK_CAUSES = [
  {
    id: "cause-1",
    title: "Tool Wear Threshold Exceeded",
    description: "The cutting tool has reached end-of-life. The CNC controller detected abnormal torque indicating wear beyond acceptable limits.",
    probability: 75,
    estMinutes: 15,
    difficulty: "easy",
    sources: [{ type: "manual", label: "Flexium Manual §4.2" }],
    steps: [
      {
        id: "step-1",
        title: "Press E-STOP and wait",
        instruction: "Press the E-STOP button and wait for the spindle to fully stop (indicator lamp green, RPM = 0).",
        safetyNote: "Never open guards until spindle is confirmed stopped.",
        tools: ["E-STOP button"],
        expectedCondition: "Spindle at rest, door interlock released.",
        ifPositive: "Continue to step 2.",
        ifNegative: "Call maintenance — spindle brake may be faulty.",
      },
      {
        id: "step-2",
        title: "Open tool magazine and remove worn tool",
        instruction: "Navigate to Tool Management on HMI. Select the flagged tool position. Use the tool release button to eject. Remove with gloves.",
        tools: ["Safety gloves", "Tool holder key"],
        expectedCondition: "Tool releases cleanly from holder.",
        ifPositive: "Inspect tip — proceed to replacement.",
        ifNegative: "Tool stuck — lubricate with WD-40 and retry.",
      },
      {
        id: "step-3",
        title: "Insert new tool and calibrate",
        instruction: "Insert replacement drill bit (same spec). Secure to rated torque (35 Nm). Run Tool Length Measurement cycle from HMI.",
        tools: ["Torque wrench 35 Nm", "Replacement drill bit"],
        expectedCondition: "TLM completes with green status.",
        ifPositive: "Reset alarm E-104 and resume program.",
        ifNegative: "Re-seat tool and repeat TLM.",
      },
    ],
  },
  {
    id: "cause-2",
    title: "Incorrect Feed Rate Parameter",
    description: "Program parameter mismatch — the feed rate exceeds the tool manufacturer specification for this material, triggering the overload alarm.",
    probability: 20,
    estMinutes: 10,
    difficulty: "medium",
    sources: [{ type: "shiftbook", label: "Shift Log #SB-2024-0891" }],
    steps: [
      {
        id: "step-1",
        title: "Review active NC program",
        instruction: "Go to Program Manager on HMI. Open the active program and navigate to the block that was executing when the alarm fired.",
        tools: ["HMI touchscreen"],
        expectedCondition: "Block with F (feed) and S (speed) values visible.",
        ifPositive: "Compare to tool data sheet — proceed.",
        ifNegative: "Contact process engineer for program access.",
      },
      {
        id: "step-2",
        title: "Correct feed rate in NC block",
        instruction: "Reduce F value by 20%. Save program. Clear alarm E-104. Run a test cycle in dry-run mode first.",
        tools: ["NC editor", "Tool data sheet"],
        expectedCondition: "Dry run completes without alarm.",
        ifPositive: "Switch to production mode and resume.",
        ifNegative: "Reduce feed by another 10% and retry.",
      },
    ],
  },
];

function buildPrompt(errorCode: string, errorText: string, context: string): string {
  return `You are an expert CNC machine diagnostics AI for Bosch's manufacturing plant.

Error detected: ${errorCode} — "${errorText}"

${context ? `Reference data from past incidents and manuals:\n${context}\n` : ""}

Generate 2-3 probable root causes for this CNC error. For each cause, provide step-by-step repair instructions a factory technician can follow.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "causes": [
    {
      "id": "cause-1",
      "title": "Short cause title (max 8 words)",
      "description": "One paragraph explaining why this causes the error.",
      "probability": 75,
      "estMinutes": 15,
      "difficulty": "easy",
      "sources": [{"type": "manual", "label": "Source reference"}],
      "steps": [
        {
          "id": "step-1",
          "title": "Action title",
          "instruction": "Detailed instruction for the technician.",
          "safetyNote": "Optional safety warning or null",
          "tools": ["Tool 1", "Tool 2"],
          "expectedCondition": "What success looks like",
          "ifPositive": "Next action if OK",
          "ifNegative": "Next action if NOT OK"
        }
      ]
    }
  ]
}

Rules:
- Probabilities must sum to ≤100
- difficulty: "easy" | "medium" | "hard"
- sources type: "manual" | "shiftbook" | "log"
- At least 2 steps per cause
- safetyNote: string or omit the key
- Be specific to CNC/industrial context`;
}

export async function POST(request: Request) {
  const { errorCode = "UNKNOWN", errorText = "", supplier } = await request.json();

  if (!isGeminiConfigured()) {
    return NextResponse.json({ causes: MOCK_CAUSES });
  }

  let context = "";

  if (isMongoConfigured()) {
    try {
      const { vectorSearch } = await import("@/lib/search");
      const results = await vectorSearch(`${errorCode} ${errorText}`, supplier, 5);
      context = results
        .map((r) => {
          if (r.source === "manual") {
            return `Manual [${r.error_no}]: ${r.description}. Causes: ${r.causes}. Fix: ${r.resolution}`;
          }
          return `Past incident [${r.error_number}]: ${r.description}`;
        })
        .join("\n\n");
    } catch (e) {
      console.error("Vector search failed:", e);
    }
  }

  try {
    const { generateText } = await import("@/lib/gemini");
    const raw = await generateText(buildPrompt(errorCode, errorText, context));
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    if (!Array.isArray(json.causes) || json.causes.length === 0) {
      return NextResponse.json({ causes: MOCK_CAUSES });
    }

    return NextResponse.json(json);
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json({ causes: MOCK_CAUSES });
  }
}
