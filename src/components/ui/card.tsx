import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-grey-200 rounded-lg shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
