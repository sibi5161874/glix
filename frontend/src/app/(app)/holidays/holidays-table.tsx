"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createHoliday, deleteHoliday, type Holiday } from "@/lib/leave";
import { ApiError } from "@/lib/api";

export function HolidaysTable({
  initialHolidays,
  year,
  canWrite,
}: {
  initialHolidays: Holiday[];
  year: number;
  canWrite: boolean;
}): React.JSX.Element {
  const { data: session } = useSession();
  const [holidays, setHolidays] = useState(initialHolidays);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(`${year}-01-01`);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreate(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!session?.accessToken) return;
    setIsSaving(true);
    try {
      const created = await createHoliday(session.accessToken, { name, date, isRecurring });
      setHolidays((prev) => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
      toast.success("Holiday added.");
      setOpen(false);
      setName("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add holiday.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!session?.accessToken) return;
    try {
      await deleteHoliday(session.accessToken, id);
      setHolidays((prev) => prev.filter((h) => h.id !== id));
      toast.success("Holiday removed.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to remove holiday.");
    }
  }

  return (
    <>
      {canWrite && (
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add holiday
          </Button>
        </div>
      )}

      <Card className="p-0">
        {holidays.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="mt-4 text-lg font-medium">No holidays for {year} yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Recurring</TableHead>
                {canWrite && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell>{h.date}</TableCell>
                  <TableCell>
                    {h.isRecurring && <Badge variant="secondary">yearly</Badge>}
                  </TableCell>
                  {canWrite && (
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDelete(h.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add holiday</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="h-name">Name</Label>
              <Input id="h-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h-date">Date</Label>
              <Input
                id="h-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
              />
              Repeats every year
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
