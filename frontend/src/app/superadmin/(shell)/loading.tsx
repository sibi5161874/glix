import React from "react";

export default function SuperadminLoading(): React.JSX.Element {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <div className="bg-muted h-8 w-56 rounded-md" />
          <div className="bg-muted/60 h-4 w-80 rounded-md" />
        </div>
        <div className="bg-muted h-9 w-32 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border bg-card h-28 space-y-3 rounded-xl border p-4">
            <div className="bg-muted h-4 w-28 rounded" />
            <div className="bg-muted h-7 w-20 rounded" />
          </div>
        ))}
      </div>

      <div className="border-border bg-card h-72 rounded-xl border p-6" />
    </div>
  );
}
