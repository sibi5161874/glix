import { auth } from "@/auth";
import { listOrgTickets, listMyTickets } from "@/lib/support";
import { SupportView } from "./support-view";

export default async function SupportPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const isAdmin = session.user.role === "org_admin";
  const ticketsRes = isAdmin
    ? await listOrgTickets(session.accessToken)
    : await listMyTickets(session.accessToken);

  return (
    <div className="space-y-6">
      <SupportView
        accessToken={session.accessToken}
        initialTickets={ticketsRes.items}
        isAdmin={isAdmin}
      />
    </div>
  );
}
