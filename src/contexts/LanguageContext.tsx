"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Lang } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------
interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sa_lang") as Lang | null;
      if (stored === "en" || stored === "de") setLangState(stored);
    } catch {
      // storage unavailable — stay with default
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("sa_lang", l);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------
export function useLanguage() {
  return useContext(LanguageContext);
}
