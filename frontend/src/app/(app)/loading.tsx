import React from "react";

export default function AppLoading(): React.JSX.Element {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="bg-muted h-8 w-48 rounded-md" />
          <div className="bg-muted/60 h-4 w-72 rounded-md" />
        </div>
        <div className="bg-muted h-9 w-28 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border bg-card h-28 space-y-3 rounded-xl border p-4">
            <div className="bg-muted h-4 w-24 rounded" />
            <div className="bg-muted h-7 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="border-border bg-card space-y-4 rounded-xl border p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="bg-muted h-5 w-36 rounded" />
          <div className="bg-muted h-8 w-48 rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="bg-muted h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <div className="bg-muted h-4 w-32 rounded" />
                  <div className="bg-muted/60 h-3 w-20 rounded" />
                </div>
              </div>
              <div className="bg-muted h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
