"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Camera, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

function NavTab({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-end gap-1 pb-2.5 pt-1 text-xs font-medium transition-colors",
        active ? "text-brand" : "text-grey-400 hover:text-grey-700",
      )}
    >
      <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
      {label}
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const onScan = pathname === "/scan" || pathname.startsWith("/scan/");

  return (
    <nav className="sticky bottom-0 z-30 border-t border-grey-200 bg-white overflow-visible">
      <div className="flex items-center h-16">
        <NavTab href="/dashboard" icon={Home} label="Home" active={pathname === "/dashboard"} />
        <NavTab href="/alerts" icon={Bell} label="Alerts" active={pathname === "/alerts"} />

        {/* Centre camera */}
        <div className="relative flex flex-1 flex-col items-center justify-end pb-2.5">
          <Link
            href="/scan"
            aria-label="Scan HMI"
            className={cn(
              "absolute -top-7 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-xl transition-transform active:scale-95",
              onScan ? "bg-brand/90" : "bg-brand",
            )}
          >
            <Camera className="h-7 w-7 text-white" strokeWidth={2} />
          </Link>
          <span className={cn("text-xs font-medium", onScan ? "text-brand" : "text-grey-400")}>
            Scan
          </span>
        </div>

        <NavTab href="/profile" icon={User} label="Profile" active={pathname === "/profile"} />
        <NavTab href="/settings" icon={Settings} label="Settings" active={pathname === "/settings"} />
      </div>
    </nav>
  );
}
