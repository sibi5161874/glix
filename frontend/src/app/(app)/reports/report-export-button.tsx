"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000";
const FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF" },
] as const;

export function ReportExportButton({
  endpoint,
  filename,
}: {
  endpoint: string;
  filename: string;
}): React.JSX.Element {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(format: (typeof FORMATS)[number]["value"]): Promise<void> {
    if (!session?.accessToken) return;
    setIsExporting(true);
    try {
      const sep = endpoint.includes("?") ? "&" : "?";
      const res = await fetch(`${API_URL}${endpoint}${sep}format=${format}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed. Try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? "Preparing..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FORMATS.map((f) => (
          <DropdownMenuItem key={f.value} onSelect={() => void handleExport(f.value)}>
            {f.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
