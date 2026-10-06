"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import type { ImportSummary } from "./types";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000";

export default function ImportExportPage(): React.JSX.Element {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  async function handleImport(file: File): Promise<void> {
    if (!session?.accessToken) return;
    setIsImporting(true);
    setSummary(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/v1/employees/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) throw new ApiError(body.error ?? "Import failed", body.code ?? "UNKNOWN");
      const result = body.data as ImportSummary;
      setSummary(result);
      toast.success(`Imported ${result.imported} of ${result.total} rows.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Import failed.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleExport(): Promise<void> {
    if (!session?.accessToken) return;
    setIsExporting(true);
    try {
      const res = await fetch(`${API_URL}/v1/employees/export`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employees.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed. Try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Import / Export employees</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" /> Bulk import (CSV)
          </CardTitle>
          <CardDescription>
            Columns: employeeCode, firstName, lastName, email, phone, dob, gender, nationality,
            maritalStatus, department, designation, joiningDate, employmentType, basicSalary,
            bankAccount, iban. `department`/`designation` match existing names in your org.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={isImporting}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
            }}
            className="text-sm"
          />
          {summary && (
            <div className="bg-muted/50 rounded-md border p-4 text-sm">
              <p className="font-medium">
                {summary.imported} imported, {summary.failed.length} failed of {summary.total} rows
              </p>
              {summary.failed.length > 0 && (
                <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
                  {summary.failed.map((f) => (
                    <li key={f.row}>
                      Row {f.row}: {f.error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="h-5 w-5" /> Export (XLSX)
          </CardTitle>
          <CardDescription>
            Downloads every employee matching no filter — up to 10,000 rows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={isExporting} variant="outline">
            <Download className="h-4 w-4" />
            {isExporting ? "Preparing..." : "Download employees.xlsx"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
