import { auth } from "@/auth";
import { listPlatformTickets } from "@/lib/support";
import { PlatformSupportView } from "./platform-support-view";

export default async function SuperadminSupportPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const ticketsRes = await listPlatformTickets(session.accessToken);

  return (
    <div className="space-y-6">
      <PlatformSupportView accessToken={session.accessToken} initialTickets={ticketsRes.items} />
    </div>
  );
}
