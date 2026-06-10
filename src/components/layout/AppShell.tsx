"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";

export function AppShell({
  title,
  back = false,
  backHref,
  right,
  children,
  contentClassName,
  hideBottomNav = false,
}: {
  title?: React.ReactNode;
  back?: boolean;
  backHref?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  hideBottomNav?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="relative h-full" style={{ background: "#F3F2EE" }}>
      <div className="app-mesh" aria-hidden="true" />
      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col">
        {title !== undefined && (
          <header className="glass-nav sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-black/[0.06] px-4">
            {back && (
              <button
                type="button"
                aria-label="Back"
                onClick={() => (backHref ? router.push(backHref) : router.back())}
                className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 transition-colors hover:bg-black/[0.05]"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1 truncate text-base font-semibold text-ink">
              {title}
            </div>
            {right && <div className="text-ink-muted">{right}</div>}
          </header>
        )}

        <main className={cn("flex-1 min-h-0", contentClassName ?? "overflow-y-auto")}>
          {children}
        </main>

        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
