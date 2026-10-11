import { auth } from "@/auth";
import { getOrgProfile } from "@/lib/settings";
import { listPlans, getSubscription, listInvoices } from "@/lib/billing";
import { SubscriptionView } from "./subscription-view";

export default async function SettingsSubscriptionPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.accessToken) {
    return <p className="text-muted-foreground">Sign in required.</p>;
  }

  const [profile, plans, subscription, invoicesRes] = await Promise.all([
    getOrgProfile(session.accessToken),
    listPlans(session.accessToken),
    getSubscription(session.accessToken),
    listInvoices(session.accessToken),
  ]);

  return (
    <div className="space-y-6">
      <SubscriptionView
        accessToken={session.accessToken}
        plans={plans}
        subscription={subscription}
        invoices={invoicesRes.items}
        currentPlanSlug={profile.tier || "free"}
        currency={profile.currency || "AED"}
      />
    </div>
  );
}
