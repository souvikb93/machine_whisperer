import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  iconClassName,
  value,
  label,
  valueClassName,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  value: string;
  label: string;
  valueClassName?: string;
}) {
  return (
    <Card className="p-4">
      <Icon className={cn("h-5 w-5 mb-2", iconClassName ?? "text-grey-400")} />
      <div className={cn("text-2xl font-bold leading-tight", valueClassName)}>
        {value}
      </div>
      <div className="text-sm text-grey-500 mt-0.5">{label}</div>
    </Card>
  );
}
