import Link from "next/link";
import { Users, Plus, Upload } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listEmployees, listDepartments } from "@/lib/employees";
import { EmployeeFilters } from "./employee-filters";
import { EmployeePagination } from "./employee-pagination";
import { EmployeeRowActions } from "./employee-row-actions";

const STATUS_VARIANT: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  active: "success",
  probation: "warning",
  on_leave: "secondary",
  terminated: "destructive",
};

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const params = await searchParams;
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const filter = {
    search: params["search"],
    departmentId: params["departmentId"],
    status: params["status"] as "active" | "probation" | "on_leave" | "terminated" | undefined,
    page: params["page"] ? Number(params["page"]) : 1,
  };

  const [{ items, total, page, limit }, departments] = await Promise.all([
    listEmployees(session.accessToken, filter),
    listDepartments(session.accessToken),
  ]);

  const canDelete = session.user.role === "org_admin";

  // Carried through to /employees/import-export so "Export" downloads what's
  // currently on screen, not an unfiltered dump of every employee.
  const exportQuery = new URLSearchParams();
  if (filter.search) exportQuery.set("search", filter.search);
  if (filter.departmentId) exportQuery.set("departmentId", filter.departmentId);
  if (filter.status) exportQuery.set("status", filter.status);
  const importExportHref = `/employees/import-export${exportQuery.size > 0 ? `?${exportQuery}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Employees</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={importExportHref}>
              <Upload className="h-4 w-4" />
              Import / Export
            </Link>
          </Button>
          <Button asChild>
            <Link href="/employees/create">
              <Plus className="h-4 w-4" />
              Add employee
            </Link>
          </Button>
        </div>
      </div>

      <EmployeeFilters departments={departments} />

      <Card className="p-0">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="mt-4 text-lg font-medium">No employees found</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try adjusting your filters, or add your first employee.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/employees/create">Add employee</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">
                    <Link href={`/employees/${e.id}`} className="hover:underline">
                      {e.firstName} {e.lastName}
                    </Link>
                    <div className="text-muted-foreground text-xs">{e.employeeCode}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.email}</TableCell>
                  <TableCell>{e.departmentName ?? "—"}</TableCell>
                  <TableCell>{e.designationTitle ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[e.status] ?? "secondary"}>
                      {e.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EmployeeRowActions
                      id={e.id}
                      name={`${e.firstName} ${e.lastName}`}
                      canDelete={canDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {items.length > 0 && <EmployeePagination page={page} limit={limit} total={total} />}
    </div>
  );
}
