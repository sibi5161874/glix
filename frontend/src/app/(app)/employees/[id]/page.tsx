import Link from "next/link";
import { notFound } from "next/navigation";
import { History, type LucideIcon } from "lucide-react";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmployee } from "@/lib/employees";
import { listDocuments, listDocumentTypes } from "@/lib/documents";
import { EmployeeDocumentsTab } from "./employee-documents-tab";
import { ApiError } from "@/lib/api";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const { id } = await params;
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  let employee;
  let employeeDocs;
  let documentTypes;
  try {
    const [emp, docsRes, docTypes] = await Promise.all([
      getEmployee(session.accessToken, id),
      listDocuments(session.accessToken, { employeeId: id, limit: 100 }),
      listDocumentTypes(session.accessToken),
    ]);
    employee = emp;
    employeeDocs = docsRes.items;
    documentTypes = docTypes;
  } catch (err) {
    if (err instanceof ApiError && err.code === "NOT_FOUND") notFound();
    throw err;
  }

  const initials = `${employee.firstName[0] ?? ""}${employee.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {employee.employeeCode} · {employee.designationTitle ?? "No designation"} ·{" "}
              {employee.departmentName ?? "No department"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{employee.status.replace("_", " ")}</Badge>
          <Button variant="outline" asChild>
            <Link href={`/employees/${employee.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <dl className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["Email", employee.email],
                ["Phone", employee.phone ?? "—"],
                ["Date of birth", employee.dob ?? "—"],
                ["Nationality", employee.nationality ?? "—"],
                ["Joining date", employee.joiningDate],
                ["Employment type", employee.employmentType.replace("_", " ")],
                ["Basic salary", employee.basicSalary],
                ["Bank account", employee.bankAccount ?? "—"],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex justify-between border-b py-2 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>

        <TabsContent value="documents">
          <EmployeeDocumentsTab
            initialDocuments={employeeDocs}
            documentTypes={documentTypes}
            employee={employee}
            accessToken={session.accessToken}
            canWrite={session.user.role === "org_admin" || session.user.role === "org_staff"}
          />
        </TabsContent>

        <TabsContent value="activity">
          <EmptyTabState
            icon={History}
            message="Audit entries for this employee will appear here once the activity feed ships."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyTabState({
  icon: Icon,
  message,
}: {
  icon: LucideIcon;
  message: string;
}): React.JSX.Element {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center">
      <Icon className="h-10 w-10" />
      <p className="max-w-sm text-sm">{message}</p>
    </div>
  );
}
