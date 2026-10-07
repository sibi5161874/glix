import { auth } from "@/auth";
import { DocumentSubnav } from "./document-subnav";
import { DocumentsTable } from "./documents-table";
import { listDocuments, getDocumentSummary, listDocumentTypes } from "@/lib/documents";
import { listEmployees } from "@/lib/employees";

export default async function DocumentsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const [docRes, summary, docTypes, empRes] = await Promise.all([
    listDocuments(session.accessToken, { limit: 50 }),
    getDocumentSummary(session.accessToken),
    listDocumentTypes(session.accessToken),
    listEmployees(session.accessToken, { limit: 100 }),
  ]);

  const canWrite = session.user.role === "org_admin" || session.user.role === "org_staff";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Document Vault</h1>
        <p className="text-muted-foreground text-sm">
          Track employee compliance, identification documents, and automated expiry alerts.
        </p>
      </div>

      <DocumentSubnav />

      <DocumentsTable
        initialDocuments={docRes.items}
        summary={summary}
        documentTypes={docTypes}
        employees={empRes.items}
        accessToken={session.accessToken}
        canWrite={canWrite}
      />
    </div>
  );
}
