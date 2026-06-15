import { FileText, BookOpen, Users, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Source } from "@/lib/types";

const ICON_MAP: Record<Source["icon"], LucideIcon> = {
  file: FileText,
  book: BookOpen,
  users: Users,
  building: Building2,
};

export function SourceChip({
  source,
  checked,
  className,
}: {
  source: Pick<Source, "label" | "icon">;
  checked?: boolean;
  className?: string;
}) {
  const Icon = ICON_MAP[source.icon];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 bg-surface-2 text-text-2 text-xs px-2 py-0.5 rounded-full whitespace-nowrap border border-border",
        className,
      )}
    >
      {checked ? (
        <span className="text-green-400 font-semibold">✓</span>
      ) : (
        <Icon className="h-3 w-3" />
      )}
      {source.label}
    </span>
  );
}
