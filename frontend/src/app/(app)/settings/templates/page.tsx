import { auth } from "@/auth";
import { listTemplates } from "@/lib/settings";
import { TemplatesTable } from "./templates-table";

export default async function SettingsTemplatesPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const templates = await listTemplates(session.accessToken);
  const canWrite = session.user.role === "org_admin";

  return (
    <div className="space-y-6">
      <TemplatesTable
        initialTemplates={templates}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
