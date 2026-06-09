import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export function NotFoundScreen() {
  return (
    <AppShell title="Not found" back backHref="/dashboard">
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="text-sm text-grey-500">
          This issue could not be found.
        </p>
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    </AppShell>
  );
}
