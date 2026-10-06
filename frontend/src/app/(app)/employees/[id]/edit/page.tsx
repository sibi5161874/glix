import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getEmployee, listDepartments, listDesignations } from "@/lib/employees";
import { ApiError } from "@/lib/api";
import { EmployeeForm } from "../../employee-form";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const { id } = await params;
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  try {
    const [employee, departments, designations] = await Promise.all([
      getEmployee(session.accessToken, id),
      listDepartments(session.accessToken),
      listDesignations(session.accessToken),
    ]);

    return (
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">
          Edit {employee.firstName} {employee.lastName}
        </h1>
        <EmployeeForm
          mode="edit"
          employee={employee}
          departments={departments}
          designations={designations}
        />
      </div>
    );
  } catch (err) {
    if (err instanceof ApiError && err.code === "NOT_FOUND") notFound();
    throw err;
  }
}
