"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePlatformOrgInput } from "@app/shared/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Loader2 } from "lucide-react";
import { createPlatformOrg } from "@/lib/platform";
import type { PlanItem } from "@/lib/billing";

interface CreateOrgDialogProps {
  accessToken: string;
  plans: PlanItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrgDialog({
  accessToken,
  plans,
  isOpen,
  onClose,
  onSuccess,
}: CreateOrgDialogProps): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlatformOrgInput>({
    resolver: zodResolver(CreatePlatformOrgInput),
    defaultValues: {
      currency: "AED",
      planId: plans[0]?.id || "",
    },
  });

  const planId = watch("planId");
  const currency = watch("currency");

  const onSubmit = async (data: CreatePlatformOrgInput): Promise<void> => {
    try {
      setError(null);
      await createPlatformOrg(accessToken, data);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="text-primary h-5 w-5" />
            Provision New Organization Tenant
          </DialogTitle>
          <DialogDescription>
            Create an isolated tenant workspace with designated subscription plan and currency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">Organization Legal Name *</Label>
            <Input id="name" placeholder="Acme International LLC" {...register("name")} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="slug">Subdomain / Slug *</Label>
            <Input id="slug" placeholder="acme" {...register("slug")} />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
            <p className="text-muted-foreground text-[11px]">
              Lowercase alphanumeric with hyphens (e.g. acme-corp)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Subscription Plan *</Label>
              <Select value={planId} onValueChange={(val) => setValue("planId", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planId && <p className="text-destructive text-xs">{errors.planId.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Base Currency *</Label>
              <Select value={currency} onValueChange={(val) => setValue("currency", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AED">AED (Emirati Dirham)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="SAR">SAR (Saudi Riyal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tenant...
                </>
              ) : (
                "Provision Tenant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
