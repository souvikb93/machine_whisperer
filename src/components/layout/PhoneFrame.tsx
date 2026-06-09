"use client";

import { useEffect, useState } from "react";

function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px 4px",
        background: "#1A0005",
        flexShrink: 0,
      }}
    >
      {/* Time */}
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.2, color: "#fff" }}>
        {time}
      </span>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.6" fill="#fff" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" fill="#fff" />
          <rect x="9" y="3" width="3" height="9" rx="0.6" fill="#fff" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.6" fill="#fff" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 9.5z" fill="#fff" />
          <path d="M4.6 7.2a4.8 4.8 0 0 1 6.8 0" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2 4.6a8 8 0 0 1 12 0" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        </svg>

        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 22,
              height: 11,
              border: "1.5px solid #fff",
              borderRadius: 3,
              padding: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ width: "75%", height: "100%", background: "#fff", borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, background: "#fff", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <>{children}</>;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "min(430px, calc(100vh * 0.462))",
          border: "6px solid #111",
          borderRadius: 48,
          overflow: "hidden",
          boxShadow: "0 0 0 1px #333",
          display: "flex",
          flexDirection: "column",
          transform: "translateZ(0)",
        }}
      >
        {/* Status bar — not scrollable */}
        <StatusBar />

        {/* App content — AppShell manages its own scroll */}
        <div style={{ flex: 1, overflow: "hidden", background: "#1A0005", display: "flex", flexDirection: "column" }}>
          {children}
        </div>

        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 112,
            height: 4,
            borderRadius: 99,
            background: "rgba(0,0,0,0.2)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
