"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Edit3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditPlanDialog } from "./edit-plan-dialog";
import type { PlanItem } from "@/lib/billing";

interface PlansViewProps {
  accessToken: string;
  initialPlans: PlanItem[];
}

export function PlansView({ accessToken, initialPlans }: PlansViewProps): React.JSX.Element {
  const router = useRouter();
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <CreditCard className="text-primary h-6 w-6" />
          Subscription Plans & Pricing Tiers
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure tier capacity limits, feature access flags, and multi-currency pricing rates.
        </p>
      </div>

      <div className="bg-card overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tier Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Max Employees</TableHead>
              <TableHead>Max Storage</TableHead>
              <TableHead>Pricing (AED / USD / SAR)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="text-foreground text-sm font-semibold">{plan.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {plan.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {plan.maxEmployees === 0 ? "Unlimited" : `Up to ${plan.maxEmployees}`}
                </TableCell>
                <TableCell className="text-xs">
                  {plan.maxStorageMb === 0
                    ? "Unlimited"
                    : `${plan.maxStorageMb >= 1000 ? `${plan.maxStorageMb / 1000} GB` : `${plan.maxStorageMb} MB`}`}
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {plan.slug === "free" ? (
                    "Free (0 AED)"
                  ) : (
                    <span>
                      {plan.priceAed} AED / ${plan.priceUsd} / {plan.priceSar} SAR
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPlan(plan)}
                    className="h-8 gap-1 px-2 text-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Tier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditPlanDialog
        accessToken={accessToken}
        plan={editingPlan}
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
