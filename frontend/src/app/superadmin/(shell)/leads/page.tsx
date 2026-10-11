import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { listPlatformLeads } from "@/lib/platform";
import { LeadsView } from "./leads-view";

export default async function SuperadminLeadsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    redirect("/superadmin/login");
  }

  const { items, total } = await listPlatformLeads(session.accessToken);

  return (
    <LeadsView accessToken={session.user.accessToken} initialLeads={items} initialTotal={total} />
  );
}
