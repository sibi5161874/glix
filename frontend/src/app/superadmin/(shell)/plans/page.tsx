import { auth } from "@/auth";
import { listPlatformPlans } from "@/lib/platform";
import { PlansView } from "./plans-view";

export default async function SuperadminPlansPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken || !session.user.isPlatformAdmin) {
    return <p className="text-muted-foreground">Superadmin access required.</p>;
  }

  const plans = await listPlatformPlans(session.accessToken);

  return (
    <div className="space-y-6">
      <PlansView accessToken={session.accessToken} initialPlans={plans} />
    </div>
  );
}
