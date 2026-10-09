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
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentItem,
} from "@/lib/departments";
import type { CreateDepartmentInput, UpdateDepartmentInput } from "@app/shared/schemas";
import { DepartmentDialog } from "./department-dialog";

export function DepartmentsTable({
  initialDepartments,
  accessToken,
  canWrite,
}: {
  initialDepartments: DepartmentItem[];
  accessToken: string;
  canWrite: boolean;
}): React.JSX.Element {
  const [departments, setDepartments] = useState<DepartmentItem[]>(initialDepartments);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  async function refresh(searchTerm = search) {
    setIsLoading(true);
    try {
      const items = await listDepartments(accessToken, { search: searchTerm || undefined });
      setDepartments(items);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(val: string) {
    setSearch(val);
    refresh(val);
  }

  async function handleSubmit(input: CreateDepartmentInput | UpdateDepartmentInput) {
    if (editingDept) {
      await updateDepartment(accessToken, editingDept.id, input);
    } else {
      await createDepartment(accessToken, input as CreateDepartmentInput);
    }
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(accessToken, id);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete department");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {canWrite && (
          <Button
            onClick={() => {
              setEditingDept(null);
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Department
          </Button>
        )}
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Parent Department</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                  {isLoading ? "Loading..." : "No departments configured."}
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="text-foreground font-medium">{dept.name}</TableCell>
                  <TableCell>
                    {dept.code ? <Badge variant="secondary">{dept.code}</Badge> : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{dept.parentName || "—"}</TableCell>
                  <TableCell>
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                      <Users className="h-3.5 w-3.5" />
                      {dept.employeeCount ?? 0}
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
                              setEditingDept(dept);
                              setDialogOpen(true);
                            }}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(dept.id)}
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

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingDept(null);
        }}
        department={editingDept}
        departments={departments}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
