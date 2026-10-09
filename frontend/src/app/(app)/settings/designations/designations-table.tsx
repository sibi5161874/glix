"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import {
  listDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  type DesignationItem,
} from "@/lib/designations";
import type { CreateDesignationInput, UpdateDesignationInput } from "@app/shared/schemas";
import { DesignationDialog } from "./designation-dialog";

export function DesignationsTable({
  initialDesignations,
  accessToken,
  canWrite,
}: {
  initialDesignations: DesignationItem[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [designations, setDesignations] = useState<DesignationItem[]>(initialDesignations);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DesignationItem | null>(null);

  async function refresh(searchTerm = search) {
    setIsLoading(true);
    try {
      const items = await listDesignations(accessToken, { search: searchTerm || undefined });
      setDesignations(items);
    } catch (err) {
      console.error("Failed to load designations", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(val: string) {
    setSearch(val);
    refresh(val);
  }

  async function handleSubmit(input: CreateDesignationInput | UpdateDesignationInput) {
    if (editingItem) {
      await updateDesignation(accessToken, editingItem.id, input);
    } else {
      await createDesignation(accessToken, input as CreateDesignationInput);
    }
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this designation?")) return;
    try {
      await deleteDesignation(accessToken, id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete designation");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            placeholder="Search designations / job titles..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {canWrite && (
          <Button
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Designation
          </Button>
        )}
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title / Designation</TableHead>
              <TableHead>Level / Seniority</TableHead>
              <TableHead>Assigned Employees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-32 text-center">
                  {isLoading ? "Loading..." : "No designations configured."}
                </TableCell>
              </TableRow>
            ) : (
              designations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-foreground font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.level !== null ? (
                      <Badge variant="outline">Level {item.level}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                      <Users className="h-3.5 w-3.5" />
                      {item.employeeCount ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {canWrite && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingItem(item);
                              setDialogOpen(true);
                            }}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="cursor-pointer gap-2 text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DesignationDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        designation={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
