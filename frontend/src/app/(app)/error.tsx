"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    // Log client error report to monitoring
    console.error("App workspace error:", error);
  }, [error]);

  return (
    <div className="border-border bg-card flex min-h-[400px] flex-col items-center justify-center rounded-xl border p-8 text-center shadow-sm">
      <div className="bg-destructive/10 mb-3 rounded-full p-3">
        <AlertTriangle className="text-destructive h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {error.message || "An unexpected error occurred while loading this workspace section."}
      </p>
      {error.digest ? (
        <p className="text-muted-foreground mt-1 font-mono text-xs">Digest: {error.digest}</p>
      ) : null}
      <div className="mt-6">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
