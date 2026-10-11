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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2 } from "lucide-react";
import { updatePlatformPlan } from "@/lib/platform";
import type { PlanItem } from "@/lib/billing";

interface EditPlanDialogProps {
  accessToken: string;
  plan: PlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPlanDialog({
  accessToken,
  plan,
  isOpen,
  onClose,
  onSuccess,
}: EditPlanDialogProps): React.JSX.Element {
  const [name, setName] = useState(plan?.name ?? "");
  const [maxEmployees, setMaxEmployees] = useState(plan?.maxEmployees ?? 25);
  const [maxStorageMb, setMaxStorageMb] = useState(plan?.maxStorageMb ?? 500);
  const [priceAed, setPriceAed] = useState(Number(plan?.priceAed ?? 0));
  const [priceUsd, setPriceUsd] = useState(Number(plan?.priceUsd ?? 0));
  const [priceSar, setPriceSar] = useState(Number(plan?.priceSar ?? 0));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) return <></>;

  const handleSave = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updatePlatformPlan(accessToken, plan.id, {
        name,
        maxEmployees: Number(maxEmployees),
        maxStorageMb: Number(maxStorageMb),
        priceAed: Number(priceAed),
        priceUsd: Number(priceUsd),
        priceSar: Number(priceSar),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="text-primary h-5 w-5" />
            Edit Subscription Tier: {plan.name}
          </DialogTitle>
          <DialogDescription>
            Update pricing rates, employee caps, and storage limits for the{" "}
            <span className="font-mono">{plan.slug}</span> tier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label>Tier Display Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Max Employees</Label>
              <Input
                type="number"
                value={maxEmployees}
                onChange={(e) => setMaxEmployees(Number(e.target.value))}
              />
              <p className="text-muted-foreground text-[11px]">0 for unlimited</p>
            </div>
            <div className="space-y-1">
              <Label>Max Storage (MB)</Label>
              <Input
                type="number"
                value={maxStorageMb}
                onChange={(e) => setMaxStorageMb(Number(e.target.value))}
              />
              <p className="text-muted-foreground text-[11px]">0 for unlimited</p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <Label className="text-xs font-semibold">Monthly Pricing</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-[11px]">AED</Label>
                <Input
                  type="number"
                  value={priceAed}
                  onChange={(e) => setPriceAed(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-[11px]">USD</Label>
                <Input
                  type="number"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-[11px]">SAR</Label>
                <Input
                  type="number"
                  value={priceSar}
                  onChange={(e) => setPriceSar(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Tier Settings"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
