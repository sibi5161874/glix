import { auth } from "@/auth";
import { listPlatformOrgs, listPlatformPlans } from "@/lib/platform";
import { OrgsView } from "./orgs-view";

export default async function SuperadminOrganizationsPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const [orgsRes, plans] = await Promise.all([
    listPlatformOrgs(session.accessToken),
    listPlatformPlans(session.accessToken),
  ]);

  return (
    <div className="space-y-6">
      <OrgsView
        accessToken={session.accessToken}
        initialOrganizations={orgsRes.items}
        plans={plans}
      />
    </div>
  );
}
