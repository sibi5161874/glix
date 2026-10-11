"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Users, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanCard } from "./plan-card";
import { InvoicesTable } from "./invoices-table";
import { ChangeTierDialog } from "./change-tier-dialog";
import type { PlanItem, SubscriptionItem, InvoiceItem } from "@/lib/billing";

interface SubscriptionViewProps {
  accessToken: string;
  plans: PlanItem[];
  subscription: SubscriptionItem | null;
  invoices: InvoiceItem[];
  currentPlanSlug: string;
  currency: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SubscriptionView({
  accessToken,
  plans,
  subscription,
  invoices,
  currentPlanSlug,
  currency,
}: SubscriptionViewProps): React.JSX.Element {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activePlan = plans.find((p) => p.slug === currentPlanSlug) || plans[0];

  const handleSelectPlan = (plan: PlanItem): void => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription Hero Banner */}
      <Card className="from-muted/50 via-muted/30 to-background border-primary/20 bg-gradient-to-r">
        <CardHeader className="pb-3">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Active Subscription</CardTitle>
                <Badge className="bg-emerald-600 capitalize text-white hover:bg-emerald-700">
                  {subscription?.status || "Active"}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                Your organization is currently on the{" "}
                <span className="text-foreground font-semibold">
                  {activePlan?.name || "Starter"}
                </span>{" "}
                tier.
              </CardDescription>
            </div>
            {subscription?.currentPeriodEnd && (
              <div className="text-muted-foreground bg-background/80 flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs">
                <Calendar className="text-primary h-3.5 w-3.5" />
                <span>Renews on {formatDate(subscription.currentPeriodEnd)}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            <div className="bg-background/50 flex items-center gap-3 rounded-lg border p-3">
              <Users className="text-primary h-5 w-5" />
              <div>
                <div className="text-muted-foreground text-xs">Employee Capacity</div>
                <div className="text-sm font-semibold">
                  {activePlan?.maxEmployees === 0
                    ? "Unlimited"
                    : `Up to ${activePlan?.maxEmployees || 25}`}
                </div>
              </div>
            </div>
            <div className="bg-background/50 flex items-center gap-3 rounded-lg border p-3">
              <HardDrive className="text-primary h-5 w-5" />
              <div>
                <div className="text-muted-foreground text-xs">Document Storage</div>
                <div className="text-sm font-semibold">
                  {activePlan?.maxStorageMb === 0
                    ? "Unlimited"
                    : `${(activePlan?.maxStorageMb || 500) >= 1000 ? `${(activePlan?.maxStorageMb || 500) / 1000} GB` : `${activePlan?.maxStorageMb || 500} MB`}`}
                </div>
              </div>
            </div>
            <div className="bg-background/50 flex items-center gap-3 rounded-lg border p-3">
              <ShieldCheck className="text-primary h-5 w-5" />
              <div>
                <div className="text-muted-foreground text-xs">Billing Rate</div>
                <div className="text-sm font-semibold">
                  {subscription?.amount
                    ? `${subscription.amount} ${subscription.currency}/mo`
                    : "Free Tier"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Available Subscription Plans</h3>
          <p className="text-muted-foreground text-sm">
            Upgrade or change your plan anytime. Features and capacity unlock instantly upon
            confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.slug === currentPlanSlug}
              currency={currency}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      </div>

      {/* Invoices and Billing History */}
      <div className="space-y-4 border-t pt-4">
        <div>
          <h3 className="text-lg font-semibold">Billing History & Invoices</h3>
          <p className="text-muted-foreground text-sm">
            Review past transactions, payment receipts, and tax records.
          </p>
        </div>
        <InvoicesTable invoices={invoices} />
      </div>

      <ChangeTierDialog
        accessToken={accessToken}
        plan={selectedPlan}
        currency={currency}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
