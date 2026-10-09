import { auth } from "@/auth";
import { listDepartments } from "@/lib/departments";
import { DepartmentsTable } from "./departments-table";

export default async function SettingsDepartmentsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const departments = await listDepartments(session.accessToken);
  const canWrite = session.user.role === "org_admin";

  return (
    <div className="space-y-6">
      <DepartmentsTable
        initialDepartments={departments}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
