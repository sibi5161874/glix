import { auth } from "@/auth";
import { listDesignations } from "@/lib/designations";
import { DesignationsTable } from "./designations-table";

export default async function SettingsDesignationsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const designations = await listDesignations(session.accessToken);
  const canWrite = session.user.role === "org_admin";

  return (
    <div className="space-y-6">
      <DesignationsTable
        initialDesignations={designations}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
