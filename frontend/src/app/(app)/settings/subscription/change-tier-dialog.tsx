"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { changeTier, type PlanItem } from "@/lib/billing";

interface ChangeTierDialogProps {
  accessToken: string;
  plan: PlanItem | null;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangeTierDialog({
  accessToken,
  plan,
  currency,
  isOpen,
  onClose,
  onSuccess,
}: ChangeTierDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) return <></>;

  const handleConfirm = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await changeTier(accessToken, plan.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change subscription plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFree = plan.slug === "free";
  const isEnterprise = plan.slug === "enterprise";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="text-primary h-5 w-5" />
            Confirm Subscription Change
          </DialogTitle>
          <DialogDescription>
            You are about to switch your organization plan to{" "}
            <span className="text-foreground font-semibold">{plan.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted/40 space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected Tier</span>
              <Badge variant="outline" className="font-bold">
                {plan.name}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Billing Period</span>
              <span className="text-muted-foreground text-sm">Monthly (Auto-renew)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Employee Limit</span>
              <span className="text-muted-foreground text-sm">
                {plan.maxEmployees === 0 ? "Unlimited" : `Up to ${plan.maxEmployees}`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 font-semibold">
              <span>Total Due Today</span>
              <span>
                {isFree
                  ? "Free (0 AED)"
                  : isEnterprise
                    ? "Custom (Invoiced)"
                    : `${plan.priceAed} ${currency}`}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="text-muted-foreground flex items-start gap-2 text-xs">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Changes take effect immediately. Invoices and payment records are automatically logged
              to your billing history.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Plan...
              </>
            ) : (
              "Confirm & Activate Plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
