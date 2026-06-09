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
    <div className="h-full" style={{ background: "#1A0005" }}>
      <div className="mx-auto flex h-full w-full max-w-lg flex-col bg-grey-50">
        {title !== undefined && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4" style={{ background: "#1A0005" }}>
            {back && (
              <button
                type="button"
                aria-label="Back"
                onClick={() => (backHref ? router.push(backHref) : router.back())}
                className="-ml-1 flex h-9 w-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1 truncate text-base font-semibold text-white">
              {title}
            </div>
            {right && <div className="text-white/80">{right}</div>}
          </header>
        )}

        <main className={cn("flex-1 min-h-0", contentClassName)}>{children}</main>

        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
