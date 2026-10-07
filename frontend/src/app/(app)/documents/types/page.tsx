import { auth } from "@/auth";
import { DocumentSubnav } from "../document-subnav";
import { DocumentTypesTable } from "./document-types-table";
import { listDocumentTypes } from "@/lib/documents";

export default async function DocumentTypesPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const documentTypes = await listDocumentTypes(session.accessToken);
  const canWrite = session.user.role === "org_admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Document Types</h1>
        <p className="text-muted-foreground text-sm">
          Configure required document categories, alert trigger schedules, and retention policies.
        </p>
      </div>

      <DocumentSubnav />

      <DocumentTypesTable
        initialDocumentTypes={documentTypes}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
