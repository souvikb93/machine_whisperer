// ============================================================
//  ShiftAssist — EN / DE string catalogue
//  All user-visible strings live here. Import `useT()` in any
//  screen; it returns the correct locale object automatically.
// ============================================================

export type Lang = "en" | "de";

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------
export const STRINGS = {
  // ── Bottom nav ──────────────────────────────────────────────────────────
  nav: {
    home:     { en: "Home",     de: "Start" },
    alerts:   { en: "Alerts",   de: "Alarme" },
    scan:     { en: "Scan",     de: "Scan" },
    profile:  { en: "Profile",  de: "Profil" },
    settings: { en: "Settings", de: "Einstellungen" },
  },

  // ── Dashboard ────────────────────────────────────────────────────────────
  dashboard: {
    periods:        { en: ["Today", "This Week", "This Month"] as const, de: ["Heute", "Diese Woche", "Dieser Monat"] as const },
    timeSaved:      { en: "TIME SAVED",       de: "ZEIT GESPART" },
    costSaved:      { en: "COST SAVED",       de: "KOSTEN GESPART" },
    resolved:       { en: "RESOLVED",         de: "GELÖST" },
    fixGuides:      { en: "FIX GUIDES",       de: "FIX-GUIDES" },
    topErrors:      { en: "Top {n} Error Codes", de: "Top {n} Fehlercodes" },
    incidents:      { en: "incidents",        de: "Vorfälle" },
    fastestFix:     { en: "Fastest Fix",      de: "Schnellste Reparatur" },
    resolutionRate: { en: "Resolution Rate",  de: "Lösungsrate" },
    mttr:           { en: "MTTR",             de: "MTTR" },
  },

  // ── Alert screen ─────────────────────────────────────────────────────────
  alert: {
    title:           { en: "Alert",                           de: "Alarm" },
    criticalBanner:  { en: "CRITICAL · MACHINE STOPPED",      de: "KRITISCH · MASCHINE GESTOPPT" },
    downtimeCaption: { en: "Machine stopped · Downtime counting", de: "Maschine gestoppt · Ausfallzeit läuft" },
    estimatedLoss:   { en: "Estimated loss:",                 de: "Geschätzter Verlust:" },
    andCounting:     { en: "and counting",                    de: "und steigt" },
    sectionLocation: { en: "Location & Machine",              de: "Standort & Maschine" },
    sectionSupplier: { en: "Supplier",                        de: "Lieferant" },
    machineId:       { en: "Machine ID",                      de: "Maschinen-ID" },
    type:            { en: "Type",                            de: "Typ" },
    model:           { en: "Model",                           de: "Modell" },
    serialNo:        { en: "Serial No.",                      de: "Seriennr." },
    installed:       { en: "Installed",                       de: "Installiert" },
    lastService:     { en: "Last Service",                    de: "Letzter Service" },
    statusLabel:     { en: "Status",                          de: "Status" },
    stopped:         { en: "STOPPED",                         de: "GESTOPPT" },
    partNo:          { en: "Part No.",                        de: "Teilenr." },
    leadTime:        { en: "Lead Time",                       de: "Lieferzeit" },
    businessDays:    { en: "business days",                   de: "Werktage" },
    warranty:        { en: "Warranty",                        de: "Garantie" },
    warrantyActive:  { en: "Active",                          de: "Aktiv" },
    warrantyExpiring:{ en: "Expiring soon",                   de: "Läuft bald ab" },
    warrantyExpired: { en: "Expired",                         de: "Abgelaufen" },
    alertReceived:   { en: "Alert received: Auto-sensor",     de: "Alarm empfangen: Automatischer Sensor" },
    assignedTo:      { en: "Assigned to: Morning Shift ·",    de: "Zugewiesen an: Frühschicht ·" },
    ctaRescan:       { en: "Re-scan HMI →",                   de: "HMI erneut scannen →" },
    ctaScan:         { en: "Scan HMI to Diagnose →",          de: "HMI scannen für Diagnose →" },
    station:         { en: "Station",                         de: "Station" },
  },

  // ── Diagnose screen ──────────────────────────────────────────────────────
  diagnose: {
    title:       { en: "Diagnosis",                                            de: "Diagnose" },
    subtitle:    { en: "Select the most likely root cause to begin the fix.",  de: "Wählen Sie die wahrscheinlichste Ursache aus, um mit der Reparatur zu beginnen." },
    startFix:    { en: "Start Fix →",                                          de: "Reparatur starten →" },
    oemManual:   { en: "OEM Manual",                                           de: "OEM-Handbuch" },
    shiftLog:    { en: "Shift Log",                                            de: "Schichtprotokoll" },
    maintLog:    { en: "Maintenance Log",                                      de: "Wartungsprotokoll" },
    plantLog:    { en: "Plant Record",                                         de: "Werksdatensatz" },
    station:     { en: "Station",                                              de: "Station" },
    error:       { en: "Error:",                                               de: "Fehler:" },
    min:         { en: "min",                                                  de: "Min." },
  },

  // ── Guided fix screen ────────────────────────────────────────────────────
  fix: {
    step:          { en: "Step",            de: "Schritt" },
    toolsNeeded:   { en: "Tools needed:",   de: "Benötigte Werkzeuge:" },
    rareCase:      { en: "Rare case · Klaus W. · Plant Hamburg · Feb 2025", de: "Seltener Fall · Klaus W. · Werk Hamburg · Feb 2025" },
    rareQuote:     { en: "“Looked like a tool failure but the spindle was just running hot — cleaning the fan cleared it instantly.”",
                    de: "„Sah aus wie ein Werkzeugausfall, aber die Spindel lief nur heiß — das Reinigen des Lüfters hat es sofort behoben.“" },
    machineFix:    { en: "Fixed",         de: "Behoben" },
    didntFix:      { en: "Try Next",      de: "Weiter" },
    stepDone:      { en: "Continue",      de: "Weiter" },
    error:         { en: "Error:",                 de: "Fehler:" },
    min:           { en: "min",                    de: "Min." },
  },

  // ── Capture screen ───────────────────────────────────────────────────────
  capture: {
    title:          { en: "Capture Knowledge",          de: "Wissen erfassen" },
    backOnline:     { en: "Back Online!",               de: "Wieder online!" },
    downtime:       { en: "Downtime: 18 minutes · Production resumed", de: "Ausfallzeit: 18 Minuten · Produktion wieder aufgenommen" },
    recovered:      { en: "recovered",                  de: "eingespart" },
    lineRate:       { en: "Based on €320/min line rate", de: "Basierend auf €320/min Linienrate" },
    minSaved:       { en: "min saved",                  de: "Min. gespart" },
    vsManual:       { en: "vs manual search",           de: "vs. manuelle Suche" },
    whatFixed:      { en: "What actually fixed it?",    de: "Was hat das Problem wirklich behoben?" },
    partsUsed:      { en: "Parts used",                 de: "Verwendete Teile" },
    add:            { en: "Add",                        de: "Hinzufügen" },
    whatHappened:   { en: "What actually happened?",    de: "Was ist tatsächlich passiert?" },
    voiceInput:     { en: "Voice input",                de: "Spracheingabe" },
    error:          { en: "Error",                      de: "Fehler" },
    machine:        { en: "Machine",                    de: "Maschine" },
    line:           { en: "Line",                       de: "Linie" },
    station:        { en: "Station",                    de: "Station" },
    technician:     { en: "Technician",                 de: "Techniker" },
    duration:       { en: "Duration",                   de: "Dauer" },
    causesAttempted:{ en: "Causes attempted",           de: "Versuchte Ursachen" },
    publishCta:     { en: "Publish to Shift Book →", de: "Im Schichtbuch veröffentlichen →" },
    defaultNotes:   {
      en: "E-104 indicated drill bit failure but actual root cause was dust blocking spindle cooling fan. Cleaning fan with compressed air resolved issue.",
      de: "E-104 zeigte Bohrspitzenausfall an, aber die tatsächliche Ursache war Staub, der das Spindelkühlgebläse blockierte. Das Reinigen des Lüfters mit Druckluft behob das Problem.",
    },
    parts: {
      compressedAir: { en: "Compressed Air",    de: "Druckluft" },
      drillBit:      { en: "Drill Bit D12",     de: "Bohrspitze D12" },
      toolHolder:    { en: "Tool Holder",       de: "Werkzeughalter" },
    },
  },

  // ── Shift Book screen ────────────────────────────────────────────────────
  shiftbook: {
    title:           { en: "Shift Book",                              de: "Schichtbuch" },
    published:       { en: "Entry Published · Shared with Morning Shift", de: "Eintrag veröffentlicht · Mit Frühschicht geteilt" },
    incidentReport:  { en: "Incident Report",                         de: "Störungsprotokoll" },
    incident:        { en: "Incident",                                de: "Vorfall" },
    rootCause:       { en: "Root Cause",                              de: "Grundursache" },
    resolution:      { en: "Resolution",                              de: "Lösung" },
    fixTime:         { en: "Fix Time",                                de: "Reparaturzeit" },
    technician:      { en: "Technician",                              de: "Techniker" },
    minutes:         { en: "minutes",                                 de: "Minuten" },
    before:          { en: "Before",                                  de: "Vorher" },
    after:           { en: "After",                                   de: "Nachher" },
    entryNote:       {
      en: "“E-104 indicated drill bit failure but actual cause was dust blocking the spindle cooling fan.”",
      de: "„E-104 zeigte Bohrspitzenausfall an, aber die tatsächliche Ursache war Staub, der das Spindelühlgebäse blockierte.“",
    },
    knowledgeLinked: { en: "Knowledge linked",                        de: "Verknüpftes Wissen" },
    kgUpdated:       { en: "Knowledge graph updated",                 de: "Wissensgraph aktualisiert" },
    kgBody1:         {
      en: "E-104 + CNC-series → Cooling fan blockage now ranked #2 cause (was #3).",
      de: "E-104 + CNC-Serie → Kühlgebläse-Blockierung jetzt auf Platz 2 (vorher #3).",
    },
    kgBody2:         {
      en: "Future technicians will see this fix first when probability matches.",
      de: "Künftige Techniker sehen diese Lösung zuerst, wenn die Wahrscheinlichkeit übereinstimmt.",
    },
    savedSummary:    { en: "This fix saved:",                          de: "Diese Reparatur sparte:" },
    shiftTotal:      { en: "Today’s shift total: €4,200 saved · 7 issues resolved", de: "Heutiger Schichtgesamtwert: €4.200 gespart · 7 Probleme behoben" },
    shareTeam:       { en: "Share with team",                          de: "Mit Team teilen" },
    backDashboard:   { en: "Back to Dashboard",                        de: "Zurück zum Dashboard" },
    rootCauseValue:  { en: "Spindle cooling fan blocked by dust",      de: "Spindelkühlgebläse durch Staub blockiert" },
    resolutionValue: { en: "Cleaned fan with compressed air",          de: "Lüfter mit Druckluft gereinigt" },
    fixTimeValue:    { en: "18 minutes",                               de: "18 Minuten" },
  },

  // ── Profile screen ───────────────────────────────────────────────────────
  profile: {
    title:          { en: "Profile",            de: "Profil" },
    role:           { en: "Senior Technician",  de: "Leitender Techniker" },
    zone:           { en: "Morning Shift · Hall A & B", de: "Frühschicht · Halle A & B" },
    currentShift:   { en: "Current Shift",      de: "Aktuelle Schicht" },
    shift:          { en: "Shift",              de: "Schicht" },
    shiftValue:     { en: "Morning Shift",      de: "Frühschicht" },
    hours:          { en: "Hours",              de: "Stunden" },
    hoursValue:     { en: "06:00 – 14:00",      de: "06:00 – 14:00" },
    date:           { en: "Date",               de: "Datum" },
    dateValue:      { en: "09 Jun 2026",        de: "09. Jun 2026" },
    plant:          { en: "Plant",              de: "Werk" },
    plantValue:     { en: "Bosch Berlin",       de: "Bosch Berlin" },
    zone2:          { en: "Zone",               de: "Zone" },
    zoneValue:      { en: "Hall A + Hall B",    de: "Halle A + Halle B" },
    statsToday:     { en: "My Stats Today",     de: "Meine heutigen Statistiken" },
    issuesHandled:  { en: "Issues handled",     de: "Behandelte Probleme" },
    resolved:       { en: "Resolved",           de: "Behoben" },
    avgFixTime:     { en: "Avg fix time",       de: "Durchschn. Reparaturzeit" },
    costSaved:      { en: "Cost saved",         de: "Kosten gespart" },
    certifications: { en: "Certifications",     de: "Zertifizierungen" },
    until:          { en: "Until",              de: "Bis" },
    cert1:          { en: "CNC Operations Level 3",       de: "CNC-Betrieb Stufe 3" },
    cert2:          { en: "Electrical Safety (BGV A3)",   de: "Elektrische Sicherheit (BGV A3)" },
    cert3:          { en: "Bosch Safety Induction",       de: "Bosch Sicherheitseinführung" },
  },

  // ── Settings screen ──────────────────────────────────────────────────────
  settings: {
    title:          { en: "Settings",           de: "Einstellungen" },
    preferences:    { en: "Preferences",        de: "Präferenzen" },
    notifications:  { en: "Notifications",      de: "Benachrichtigungen" },
    notifValue:     { en: "All alerts on",      de: "Alle Alarme aktiv" },
    appearance:     { en: "Appearance",         de: "Erscheinungsbild" },
    appearValue:    { en: "System default",     de: "Systemstandard" },
    language:       { en: "Language",           de: "Sprache" },
    account:        { en: "Account",            de: "Konto" },
    privacy:        { en: "Privacy & Security", de: "Datenschutz & Sicherheit" },
    version:        { en: "ShiftAssist v0.1.0", de: "ShiftAssist v0.1.0" },
    langEnglish:    { en: "English",            de: "Englisch" },
    langGerman:     { en: "German",             de: "Deutsch" },
  },

  // ── Scan screen ──────────────────────────────────────────────────────────
  scan: {
    title:           { en: "Diagnose HMI Fault",                      de: "HMI-Fehler diagnostizieren" },
    cameraUnavail:   { en: "Camera unavailable",                      de: "Kamera nicht verfügbar" },
    alignPrompt:     { en: "Aim at the fault display",                de: "Kamera auf die Fehleranzeige richten" },
    scanning:        { en: "Reading the fault code…",                 de: "Fehlercode wird gelesen…" },
    ctaScan:         { en: "Take a picture of the HMI error screen",  de: "HMI-Fehlerbildschirm fotografieren" },
    preparing:       { en: "Finding Solutions",                       de: "Lösungen werden gesucht" },
    pulling:         { en: "Checking manuals, logs & shift history…", de: "Handbücher, Protokolle & Schichtverlauf werden geprüft…" },
    checkOem:        { en: "OEM Manual",                              de: "OEM-Handbuch" },
    checkShift:      { en: "Shift Book (12 entries)",                 de: "Schichtbuch (12 Einträge)" },
    checkMaint:      { en: "Maintenance Logs",                        de: "Wartungsprotokolle" },
    machineDetected: { en: "Error Detected",                          de: "Fehler erkannt" },
    confident:       { en: "% match",                                 de: "% Übereinstimmung" },
    fieldMachine:    { en: "Machine",                                 de: "Maschine" },
    fieldErrorCode:  { en: "Error Code",                              de: "Fehlercode" },
    fieldErrorText:  { en: "Error Description",                       de: "Fehlerbeschreibung" },
    ctaStart:        { en: "Show me the fix →",                       de: "Lösung anzeigen →" },
    errorText:       { en: "Tool Failure – Replace Drill Bit",        de: "Werkzeugausfall – Bohrspitze ersetzen" },
  },
} as const;

// ---------------------------------------------------------------------------
// Localised mock-data content
// Screens import `getLocalizedContent(lang)` instead of reading MOCK_ISSUES
// directly for any translatable string.
// ---------------------------------------------------------------------------
export const MOCK_CONTENT = {
  // issue-001 ----------------------------------------------------------------
  "issue-001": {
    machineType:  { en: "CNC Milling Station",  de: "CNC-Frässtation" },
    errorText:    { en: "Tool Failure – Replace Drill Bit", de: "Werkzeugausfall – Bohrspitze ersetzen" },
    causes: {
      "cause-1": {
        title:       { en: "Drill bit damaged or worn",   de: "Bohrspitze beschädigt oder abgenutzt" },
        description: {
          en: "Physical damage to drill bit triggers tool failure sensor. Most common cause in CNC-series machines.",
          de: "Physische Schäden an der Bohrspitze lösen den Werkzeugausfallsensor aus. Häufigste Ursache bei CNC-Serienmaschinen.",
        },
        steps: [
          {
            title:             { en: "Inspect the drill bit visually",  de: "Bohrspitze sichtprüfen" },
            instruction: {
              en: "Open the drill bit guard panel (lever on left side of spindle head). Examine the cutting edge under flashlight. Look for chips, cracks, bent tip, or unusual wear patterns. Rotate bit slowly by hand to check all edges.",
              de: "Öffnen Sie die Bohrspitzenschutzabdeckung (Hebel auf der linken Seite des Spindelkopfs). Untersuchen Sie die Schneidkante mit einer Taschenlampe. Achten Sie auf Absplitterungen, Risse, verbogene Spitze oder ungewöhnliche Verschleißmuster. Drehen Sie die Spitze langsam von Hand, um alle Kanten zu prüfen.",
            },
            expectedCondition: { en: "Healthy bit = clean sharp edge, no chips or deformation",  de: "Intakte Spitze = saubere scharfe Kante, keine Absplitterungen oder Verformungen" },
            safetyNote:        { en: "Power down spindle before proceeding",                      de: "Spindel vor dem Fortfahren ausschalten" },
            ifPositive:        { en: "Bit damaged → continue to Step 2",                          de: "Spitze beschädigt → weiter zu Schritt 2" },
            ifNegative:        { en: "Bit intact → tap \"This didn't fix it\"",                    de: "Spitze intakt → \"Nicht behoben\" antippen" },
          },
          {
            title:             { en: "Remove the damaged drill bit",  de: "Beschädigte Bohrspitze entfernen" },
            instruction: {
              en: "Insert torque wrench into holder locking bolt (top of spindle head). Turn counter-clockwise to loosen (3–4 turns). Grip drill bit firmly with gloved hand. Pull straight out — do not twist. Place old bit in red disposal bin.",
              de: "Drehmomentschlüssel in den Halteverriegelungsbolzen (oben am Spindelkopf) einsetzen. Gegen den Uhrzeigersinn drehen zum Lösen (3–4 Umdrehungen). Bohrspitze fest mit behandschuhter Hand greifen. Gerade herausziehen – nicht verdrehen. Alte Spitze in den roten Entsorgungsbehälter legen.",
            },
            expectedCondition: { en: "Bit slides out smoothly with no resistance",                de: "Spitze gleitet ohne Widerstand heraus" },
            safetyNote:        { en: "Confirm spindle is fully stopped before touching holder",   de: "Sicherstellen, dass die Spindel vollständig gestoppt ist, bevor der Halter berührt wird" },
          },
          {
            title:             { en: "Install replacement drill bit",  de: "Ersatz-Bohrspitze einbauen" },
            instruction: {
              en: "Take replacement D12 drill bit from parts cabinet Row C. Align shank with holder bore — flat side faces locking bolt. Push straight in until fully seated (click felt). Tighten locking bolt clockwise. Torque spec: 12 Nm — do not overtighten.",
              de: "Ersatz-D12-Bohrspitze aus Teileregal Reihe C entnehmen. Schaft mit Halterbohrung ausrichten — flache Seite zeigt zum Verriegelungsbolzen. Gerade eindrücken, bis vollständig eingesetzt (Klicken spürbar). Verriegelungsbolzen im Uhrzeigersinn festziehen. Drehmomentvorgabe: 12 Nm – nicht überziehen.",
            },
            expectedCondition: { en: "Bit does not wobble when held — fully locked at 12 Nm",    de: "Spitze wackelt nicht wenn gehalten – vollständig bei 12 Nm gesichert" },
            safetyNote:        { en: "Match drill bit diameter — D12 only for CNC-05",            de: "Bohrspitzendurchmesser beachten – nur D12 für CNC-05" },
          },
          {
            title:             { en: "Test and verify",  de: "Testen und überprüfen" },
            instruction: {
              en: "Close drill bit guard panel — must click shut. Power spindle back on (green button, control panel). Run test cycle: press TEST on HMI (Menu → Diagnostics → Test Run). Watch for smooth rotation, no vibration, no error codes. Confirm HMI clears E-104.",
              de: "Bohrspitzenschutzabdeckung schließen – muss einrasten. Spindel wieder einschalten (grüner Knopf, Steuerfeld). Testzyklus starten: TEST am HMI drücken (Menü → Diagnose → Testlauf). Auf gleichmäßige Rotation, keine Vibration, keine Fehlercodes achten. Bestätigen, dass HMI E-104 löscht.",
            },
            expectedCondition: { en: "HMI shows READY · No error codes · Spindle runs smooth",   de: "HMI zeigt BEREIT · Keine Fehlercodes · Spindel läuft gleichmäßig" },
            safetyNote:        { en: "Stand clear of spindle during test run",                    de: "Während des Testlaufs Abstand zur Spindel halten" },
          },
        ],
        tools: {
          "Flashlight":              { en: "Flashlight",              de: "Taschenlampe" },
          "Safety Gloves":           { en: "Safety Gloves",           de: "Schutzhandschuhe" },
          "Torque Wrench":           { en: "Torque Wrench",           de: "Drehmomentschlüssel" },
          "Replacement Drill Bit D12": { en: "Replacement Drill Bit D12", de: "Ersatz-Bohrspitze D12" },
        },
      },
      "cause-2": {
        title:       { en: "Tool holder locking mechanism loose",   de: "Spannmechanismus des Werkzeughalters gelöst" },
        description: {
          en: "Loose holder causes micro-vibrations which trigger the same E-104 sensor error even when the drill bit is undamaged.",
          de: "Ein loser Halter verursacht Mikrovibrationen, die denselben E-104-Sensorfehler auslösen, selbst wenn die Bohrspitze unbeschädigt ist.",
        },
        steps: [
          {
            title:             { en: "Check tool holder for play",   de: "Werkzeughalter auf Spiel prüfen" },
            instruction: {
              en: "Grip tool holder firmly with both hands. Attempt to wiggle left-right and forward-back. Any movement = loose holder. Check locking bolt visually — look for gap between holder and spindle nose.",
              de: "Werkzeughalter mit beiden Händen fest greifen. Versuchen, links-rechts und vorwärts-rückwärts zu wackeln. Jede Bewegung = loser Halter. Verriegelungsbolzen sichtprüfen – auf Spalt zwischen Halter und Spindelnase achten.",
            },
            expectedCondition: { en: "Zero movement. Holder fully seated, no gap visible.",      de: "Keine Bewegung. Halter vollständig eingesetzt, kein Spalt sichtbar." },
            safetyNote:        { en: "Spindle must be off",                                       de: "Spindel muss ausgeschaltet sein" },
            ifPositive:        { en: "Movement detected → continue to Step 2",                   de: "Bewegung festgestellt → weiter zu Schritt 2" },
            ifNegative:        { en: "No play → tap \"This didn't fix it\"",                      de: "Kein Spiel → \"Nicht behoben\" antippen" },
          },
          {
            title:             { en: "Tighten tool holder locking bolt",  de: "Verriegelungsbolzen des Werkzeughalters anziehen" },
            instruction: {
              en: "Locate locking bolt on spindle nose (front, centre). Insert torque wrench. Tighten clockwise. Torque spec: 25 Nm. Re-check play — wiggle holder again to confirm zero movement.",
              de: "Verriegelungsbolzen an der Spindelnase (vorne, Mitte) finden. Drehmomentschlüssel einsetzen. Im Uhrzeigersinn anziehen. Drehmomentvorgabe: 25 Nm. Spiel erneut prüfen – Halter wieder wackeln, um keine Bewegung zu bestätigen.",
            },
            expectedCondition: { en: "No movement after tightening. 25 Nm confirmed.",           de: "Keine Bewegung nach dem Anziehen. 25 Nm bestätigt." },
            safetyNote:        { en: "Do not overtighten — damages spindle thread",               de: "Nicht überziehen – beschädigt das Spindelgewinde" },
          },
          {
            title:             { en: "Inspect holder seating surface",  de: "Sitzfläche des Halters prüfen" },
            instruction: {
              en: "Remove tool holder completely. Wipe spindle taper bore with clean cloth. Check for metal shavings, debris, scoring marks. Wipe holder taper clean. Reseat holder firmly — push and twist clockwise until locked.",
              de: "Werkzeughalter vollständig entfernen. Spindelkegelbohrung mit sauberem Tuch abwischen. Auf Metallspäne, Schmutz, Kratzer prüfen. Halterkonus sauber abwischen. Halter fest wiedereinsetzen – drücken und im Uhrzeigersinn drehen, bis gesichert.",
            },
            expectedCondition: { en: "Clean bore, no debris, no score marks. Holder reseated firmly.", de: "Saubere Bohrung, kein Schmutz, keine Kratzer. Halter fest wiedereingesetzt." },
          },
          {
            title:             { en: "Test and verify",  de: "Testen und überprüfen" },
            instruction: {
              en: "Power spindle back on. Run test cycle via HMI (Menu → Diagnostics → Test Run). Confirm E-104 cleared and spindle runs smooth.",
              de: "Spindel wieder einschalten. Testzyklus über HMI starten (Menü → Diagnose → Testlauf). Bestätigen, dass E-104 gelöscht und Spindel gleichmäßig läuft.",
            },
            expectedCondition: { en: "HMI shows READY · No error codes",  de: "HMI zeigt BEREIT · Keine Fehlercodes" },
            safetyNote:        { en: "Stand clear of spindle during test run",  de: "Während des Testlaufs Abstand zur Spindel halten" },
          },
        ],
        tools: {
          "Flashlight":   { en: "Flashlight",   de: "Taschenlampe" },
          "Safety Gloves":{ en: "Safety Gloves",de: "Schutzhandschuhe" },
          "Torque Wrench":{ en: "Torque Wrench",de: "Drehmomentschlüssel" },
          "Clean Cloth":  { en: "Clean Cloth",  de: "Sauberes Tuch" },
        },
      },
      "cause-3": {
        title:       { en: "Spindle cooling fan blocked by dust",  de: "Spindelkühlgebläse durch Staub blockiert" },
        description: {
          en: "Dust buildup causes sensor overheating, which fires a misleading E-104 even though drill bit and holder are fine. Rare but validated.",
          de: "Staubansammlungen verursachen Sensorüberhitzung, die ein irreführendes E-104 auslöst, obwohl Bohrspitze und Halter in Ordnung sind. Selten, aber bestätigt.",
        },
        steps: [
          {
            title:             { en: "Locate cooling fan vent",  de: "Kühlgebläse-Lüftungsöffnung lokalisieren" },
            instruction: {
              en: "Walk to rear of CNC-05. Locate ventilation grille on spindle housing (marked with fan icon). Shine flashlight into grille. Look for dust buildup, lint, or debris blocking airflow.",
              de: "Zur Rückseite von CNC-05 gehen. Lüftungsgitter am Spindelgehäuse (mit Lüftersymbol markiert) lokalisieren. Taschenlampe in das Gitter leuchten. Auf Staubansammlungen, Flusen oder Schmutz achten, der den Luftstrom blockiert.",
            },
            expectedCondition: { en: "Vent should be clear — mesh visible, airflow unobstructed.", de: "Lüftung sollte frei sein – Gitter sichtbar, Luftstrom ungehindert." },
          },
          {
            title:             { en: "Clean the cooling fan",  de: "Kühlgebläse reinigen" },
            instruction: {
              en: "Put on safety goggles. Insert compressed air nozzle into vent grille. Blast 3–4 short bursts (1–2 seconds each). Use brush to loosen stubborn debris around grille edges. Repeat until airflow is visible through grille.",
              de: "Schutzbrille aufsetzen. Druckluftdüse in das Lüftungsgitter einführen. 3–4 kurze Stöße geben (je 1–2 Sekunden). Bürste verwenden, um hartnäckigen Schmutz an den Gitterrändern zu lösen. Wiederholen, bis Luftstrom durch das Gitter sichtbar ist.",
            },
            expectedCondition: { en: "Grille clear — fan blades visible through mesh.",  de: "Gitter frei – Lüfterblätter durch das Netz sichtbar." },
            safetyNote:        { en: "Wear goggles — dust blows back. Do NOT use water near electrical components.", de: "Schutzbrille tragen – Staub bläst zurück. KEIN Wasser in der Nähe elektrischer Komponenten verwenden." },
          },
          {
            title:             { en: "Allow cooldown and test",  de: "Abkühlung abwarten und testen" },
            instruction: {
              en: "Wait 5 minutes — allow temperature sensor to normalise. Power spindle back on. Run HMI test cycle (Menu → Diagnostics → Test Run). Confirm E-104 cleared.",
              de: "5 Minuten warten – Temperatursensor normalisieren lassen. Spindel wieder einschalten. HMI-Testzyklus starten (Menü → Diagnose → Testlauf). Bestätigen, dass E-104 gelöscht ist.",
            },
            expectedCondition: { en: "HMI shows READY · Green status · No error codes.", de: "HMI zeigt BEREIT · Grüner Status · Keine Fehlercodes." },
          },
        ],
        tools: {
          "Flashlight":           { en: "Flashlight",           de: "Taschenlampe" },
          "Compressed Air Can":   { en: "Compressed Air Can",   de: "Druckluftdose" },
          "Brush":                { en: "Brush",                de: "Bürste" },
          "Safety Goggles":       { en: "Safety Goggles",       de: "Schutzbrille" },
        },
      },
    },
  },

  // issue-002 ----------------------------------------------------------------
  "issue-002": {
    machineType: { en: "Welding Station",  de: "Schweißstation" },
    errorText:   { en: "Wire Feed Inconsistency", de: "Drahtvorschub-Unregelmäßigkeit" },
  },

  // issue-003 ----------------------------------------------------------------
  "issue-003": {
    machineType: { en: "Conveyor System",  de: "Fördersystem" },
    errorText:   { en: "Belt Tension Alert", de: "Riemenspannungsalarm" },
  },
} as const;

// ---------------------------------------------------------------------------
// Helper — pick the right string for the current language
// ---------------------------------------------------------------------------
export function t<T extends { en: string; de: string }>(obj: T, lang: Lang): string {
  return obj[lang];
}
