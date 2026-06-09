export type Severity = "critical" | "warning" | "info";
export type IssueStatus = "open" | "in-progress" | "resolved";
export type Difficulty = "easy" | "medium" | "hard";
export type WarrantyStatus = "active" | "expiring" | "expired";

export interface Supplier {
  name: string;
  country: string;
  partNumber?: string;
  supportPhone?: string;
  supportEmail?: string;
  warrantyStatus: WarrantyStatus;
  warrantyExpiry: string;
  leadTimeDays?: number;
}

export interface Machine {
  id: string;
  type: string;
  model: string;
  serialNumber: string;
  hall: string;
  line: string;
  station: string;
  installDate: string;
  lastMaintenance: string;
  costPerMinute: number;
  supplier: Supplier;
}

export interface Issue {
  id: string;
  machine: Machine;
  severity: Severity;
  status: IssueStatus;
  stoppedAt: Date;
  errorCode?: string;
  errorText?: string;
  scanConfidence?: number;
  causes?: Cause[];
  resolvedCauseIndex?: number;
  fixDurationMin?: number;
  technicianName: string;
}

export interface Cause {
  id: string;
  title: string;
  description: string;
  probability: number; // 0-100
  estMinutes: number;
  difficulty: Difficulty;
  sources: Source[];
  steps: Step[];
}

export interface Source {
  label: string;
  type: "manual" | "shiftbook" | "log" | "plant";
  icon: "file" | "book" | "users" | "building";
}

export interface Step {
  number: number;
  title: string;
  instruction: string;
  photoUrl?: string;
  expectedCondition: string;
  tools?: string[];
  safetyNote?: string;
  safetyLevel?: "warning" | "danger";
  ifPositive?: string;
  ifNegative?: string;
}

export interface ShiftBookEntry {
  issueId: string;
  errorCode: string;
  machine: Machine;
  rootCause: string;
  resolution: string;
  fixMinutes: number;
  technician: string;
  timestamp: Date;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  partsUsed: string[];
  notes: string;
  linkedManualSection?: string;
  relatedIncidents?: string[];
  moneySaved: number;
  timeSavedMin: number;
}

export interface ScanResult {
  errorCode: string;
  errorText: string;
  confidence: number;
}
