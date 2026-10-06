import { auth } from "@/auth";
import { listDepartments, listDesignations } from "@/lib/employees";
import { EmployeeForm } from "../employee-form";

export default async function CreateEmployeePage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) return <p className="text-muted-foreground">Sign in required.</p>;

  const [departments, designations] = await Promise.all([
    listDepartments(session.accessToken),
    listDesignations(session.accessToken),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold">Add employee</h1>
      <EmployeeForm mode="create" departments={departments} designations={designations} />
    </div>
  );
}
