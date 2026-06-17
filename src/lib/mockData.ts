import type { Issue, ShiftBookEntry } from "./types";

export const MOCK_ISSUES: Issue[] = [
  {
    id: "issue-001",
    severity: "critical",
    status: "open",
    stoppedAt: new Date(Date.now() - 4 * 60 * 1000),
    technicianName: "Hans Mueller",
    machine: {
      id: "CNC-05",
      type: "CNC Milling Station",
      model: "DMG MORI DMU 50",
      serialNumber: "DMU50-2019-00472",
      hall: "Hall A",
      line: "Line 3",
      station: "B12",
      installDate: "12 Mar 2019",
      lastMaintenance: "14 May 2026",
      costPerMinute: 320,
      supplier: {
        name: "DMG MORI AG",
        country: "Germany",
        partNumber: "DMU50-DRILL-D12",
        supportPhone: "+49 7461 70 0",
        supportEmail: "service@dmgmori.com",
        warrantyStatus: "active",
        warrantyExpiry: "12 Mar 2027",
        leadTimeDays: 3,
      },
    },
    // errorCode intentionally absent — revealed only after HMI scan
    causes: [
      {
        id: "cause-1",
        title: "Drill bit damaged or worn",
        description:
          "Physical damage to drill bit triggers tool failure sensor. Most common cause in CNC-series machines.",
        probability: 62,
        estMinutes: 8,
        difficulty: "easy",
        sources: [
          { label: "OEM Manual p.247", type: "manual", icon: "file" },
          { label: "8 Shift Book entries", type: "shiftbook", icon: "book" },
        ],
        steps: [
          {
            number: 1,
            title: "Inspect the drill bit visually",
            instruction:
              "Open the drill bit guard panel (lever on left side of spindle head). Examine the cutting edge under flashlight. Look for chips, cracks, bent tip, or unusual wear patterns. Rotate bit slowly by hand to check all edges.",
            expectedCondition:
              "Healthy bit = clean sharp edge, no chips or deformation",
            tools: ["Flashlight", "Safety Gloves"],
            safetyNote: "Power down spindle before proceeding",
            safetyLevel: "warning",
            photoUrl: "/steps/step-1-1.png",
            ifPositive: "Bit damaged → continue to Step 2",
            ifNegative: "Bit intact → tap \"This didn't fix it\"",
          },
          {
            number: 2,
            title: "Remove the damaged drill bit",
            instruction:
              "Insert torque wrench into holder locking bolt (top of spindle head). Turn counter-clockwise to loosen (3–4 turns). Grip drill bit firmly with gloved hand. Pull straight out — do not twist. Place old bit in red disposal bin.",
            expectedCondition: "Bit slides out smoothly with no resistance",
            tools: ["Torque Wrench", "Safety Gloves"],
            safetyNote: "Confirm spindle is fully stopped before touching holder",
            safetyLevel: "warning",
            photoUrl: "/steps/step-1-2.png",
          },
          {
            number: 3,
            title: "Install replacement drill bit",
            instruction:
              "Take replacement D12 drill bit from parts cabinet Row C. Align shank with holder bore — flat side faces locking bolt. Push straight in until fully seated (click felt). Tighten locking bolt clockwise. Torque spec: 12 Nm — do not overtighten.",
            expectedCondition:
              "Bit does not wobble when held — fully locked at 12 Nm",
            tools: ["Torque Wrench", "Replacement Drill Bit D12"],
            safetyNote: "Match drill bit diameter — D12 only for CNC-05",
            safetyLevel: "warning",
            photoUrl: "/steps/step-1-3.png",
          },
          {
            number: 4,
            title: "Test and verify",
            instruction:
              "Close drill bit guard panel — must click shut. Power spindle back on (green button, control panel). Run test cycle: press TEST on HMI (Menu → Diagnostics → Test Run). Watch for smooth rotation, no vibration, no error codes. Confirm HMI clears E-104.",
            expectedCondition:
              "HMI shows READY · No error codes · Spindle runs smooth",
            tools: [],
            safetyNote: "Stand clear of spindle during test run",
            safetyLevel: "warning",
          },
        ],
      },
      {
        id: "cause-2",
        title: "Tool holder locking mechanism loose",
        description:
          "Loose holder causes micro-vibrations which trigger the same E-104 sensor error even when the drill bit is undamaged.",
        probability: 24,
        estMinutes: 15,
        difficulty: "medium",
        sources: [
          { label: "Maintenance Log · March 2025", type: "log", icon: "file" },
        ],
        steps: [
          {
            number: 1,
            title: "Check tool holder for play",
            instruction:
              "Grip tool holder firmly with both hands. Attempt to wiggle left-right and forward-back. Any movement = loose holder. Check locking bolt visually — look for gap between holder and spindle nose.",
            expectedCondition:
              "Zero movement. Holder fully seated, no gap visible.",
            tools: ["Flashlight", "Safety Gloves"],
            safetyNote: "Spindle must be off",
            safetyLevel: "warning",
            photoUrl: "/steps/step-2-1.png",
            ifPositive: "Movement detected → continue to Step 2",
            ifNegative: "No play → tap \"This didn't fix it\"",
          },
          {
            number: 2,
            title: "Tighten tool holder locking bolt",
            instruction:
              "Locate locking bolt on spindle nose (front, centre). Insert torque wrench. Tighten clockwise. Torque spec: 25 Nm. Re-check play — wiggle holder again to confirm zero movement.",
            expectedCondition: "No movement after tightening. 25 Nm confirmed.",
            tools: ["Torque Wrench"],
            safetyNote: "Do not overtighten — damages spindle thread",
            safetyLevel: "danger",
            photoUrl: "/steps/step-2-2.png",
          },
          {
            number: 3,
            title: "Inspect holder seating surface",
            instruction:
              "Remove tool holder completely. Wipe spindle taper bore with clean cloth. Check for metal shavings, debris, scoring marks. Wipe holder taper clean. Reseat holder firmly — push and twist clockwise until locked.",
            expectedCondition:
              "Clean bore, no debris, no score marks. Holder reseated firmly.",
            tools: ["Clean Cloth", "Flashlight"],
          },
          {
            number: 4,
            title: "Test and verify",
            instruction:
              "Power spindle back on. Run test cycle via HMI (Menu → Diagnostics → Test Run). Confirm E-104 cleared and spindle runs smooth.",
            expectedCondition: "HMI shows READY · No error codes",
            tools: [],
            safetyNote: "Stand clear of spindle during test run",
            safetyLevel: "warning",
          },
        ],
      },
      {
        id: "cause-3",
        title: "Spindle cooling fan blocked by dust",
        description:
          "Dust buildup causes sensor overheating, which fires a misleading E-104 even though drill bit and holder are fine. Rare but validated.",
        probability: 14,
        estMinutes: 20,
        difficulty: "medium",
        sources: [
          {
            label: "Plant Hamburg · Klaus W. · Feb 2025",
            type: "plant",
            icon: "building",
          },
          { label: "Plant Munich · Nov 2024", type: "plant", icon: "building" },
          { label: "Shift Book (3 entries)", type: "shiftbook", icon: "book" },
        ],
        steps: [
          {
            number: 1,
            title: "Locate cooling fan vent",
            instruction:
              "Walk to rear of CNC-05. Locate ventilation grille on spindle housing (marked with fan icon). Shine flashlight into grille. Look for dust buildup, lint, or debris blocking airflow.",
            expectedCondition:
              "Vent should be clear — mesh visible, airflow unobstructed.",
            tools: ["Flashlight"],
            photoUrl: "/steps/step-3-1.png",
          },
          {
            number: 2,
            title: "Clean the cooling fan",
            instruction:
              "Put on safety goggles. Insert compressed air nozzle into vent grille. Blast 3–4 short bursts (1–2 seconds each). Use brush to loosen stubborn debris around grille edges. Repeat until airflow is visible through grille.",
            expectedCondition: "Grille clear — fan blades visible through mesh.",
            tools: ["Compressed Air Can", "Brush", "Safety Goggles"],
            safetyNote:
              "Wear goggles — dust blows back. Do NOT use water near electrical components.",
            safetyLevel: "danger",
            photoUrl: "/steps/step-3-2.png",
          },
          {
            number: 3,
            title: "Allow cooldown and test",
            instruction:
              "Wait 5 minutes — allow temperature sensor to normalise. Power spindle back on. Run HMI test cycle (Menu → Diagnostics → Test Run). Confirm E-104 cleared.",
            expectedCondition:
              "HMI shows READY · Green status · No error codes.",
            tools: [],
            photoUrl: "/steps/step-3-3.png",
          },
        ],
      },
    ],
  },
  {
    id: "issue-002",
    severity: "warning",
    status: "in-progress",
    stoppedAt: new Date(Date.now() - 12 * 60 * 1000),
    technicianName: "Maria Schmidt",
    machine: {
      id: "WLD-02",
      type: "Welding Station",
      model: "KUKA KR 6 R900",
      serialNumber: "KUKA-WLD-2021-00831",
      hall: "Hall B",
      line: "Line 1",
      station: "A04",
      installDate: "05 Nov 2021",
      lastMaintenance: "02 Jun 2026",
      costPerMinute: 210,
      supplier: {
        name: "KUKA AG",
        country: "Germany",
        partNumber: "KR6-WIRE-FEED-UNIT",
        supportPhone: "+49 821 797 0",
        supportEmail: "support@kuka.com",
        warrantyStatus: "expiring",
        warrantyExpiry: "05 Nov 2026",
        leadTimeDays: 5,
      },
    },
    errorCode: "W-211",
    errorText: "Wire Feed Inconsistency",
  },
  {
    id: "issue-003",
    severity: "warning",
    status: "resolved",
    stoppedAt: new Date(Date.now() - 31 * 60 * 1000),
    technicianName: "Klaus Weber",
    machine: {
      id: "CNV-07",
      type: "Conveyor System",
      model: "Siemens SIMATIC ET 200SP",
      serialNumber: "SIE-CNV-2020-00214",
      hall: "Hall A",
      line: "Line 2",
      station: "C08",
      installDate: "18 Jan 2020",
      lastMaintenance: "28 May 2026",
      costPerMinute: 180,
      supplier: {
        name: "Siemens AG",
        country: "Germany",
        partNumber: "ET200SP-BELT-TENSION",
        supportPhone: "+49 89 636 0",
        supportEmail: "industry.support@siemens.com",
        warrantyStatus: "expired",
        warrantyExpiry: "18 Jan 2026",
        leadTimeDays: 7,
      },
    },
    errorCode: "C-033",
    errorText: "Belt Tension Alert",
    fixDurationMin: 14,
  },
];

export const DASHBOARD_METRICS = {
  activeIssues: 2,
  resolvedToday: 7,
  avgFixTimeMin: 23,
  costSavedToday: 4200,
};

export const MOCK_SHIFTBOOK: ShiftBookEntry[] = [
  {
    issueId: "issue-003",
    errorCode: "C-033",
    machine: MOCK_ISSUES[2].machine,
    rootCause: "Belt tension sensor misaligned after last maintenance",
    resolution: "Re-aligned tension sensor and recalibrated to spec",
    fixMinutes: 14,
    technician: "Klaus Weber",
    timestamp: new Date(Date.now() - 17 * 60 * 1000),
    partsUsed: [],
    notes: "Sensor had drifted 2mm from mounting bracket. No parts needed.",
    moneySaved: 2520,
    timeSavedMin: 31,
  },
];

export function getIssueById(id: string): Issue | undefined {
  return MOCK_ISSUES.find((i) => i.id === id);
}
