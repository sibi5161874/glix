"use client";

import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlanItem } from "@/lib/billing";

interface PlanCardProps {
  plan: PlanItem;
  isCurrent: boolean;
  currency: string;
  onSelect: (plan: PlanItem) => void;
}

const FEATURE_LABELS: Record<string, string> = {
  bulkImport: "Bulk Employee Import (CSV)",
  customRoles: "Custom RBAC & Roles",
  advancedReports: "Advanced PDF/Excel Reports",
  whatsappAlerts: "WhatsApp Alerts & Notifications",
  customBranding: "Custom Organization Branding",
  apiAccess: "Full REST API Access",
  sso: "Single Sign-On (SSO / SAML)",
};

function formatPrice(plan: PlanItem, currency: string): string {
  if (plan.slug === "enterprise") return "Custom";
  if (plan.slug === "free") return "Free";
  const curr = currency.toUpperCase();
  if (curr === "USD") return `$${plan.priceUsd}/mo`;
  if (curr === "SAR") return `${plan.priceSar} SAR/mo`;
  return `${plan.priceAed} AED/mo`;
}

export function PlanCard({
  plan,
  isCurrent,
  currency,
  onSelect,
}: PlanCardProps): React.JSX.Element {
  const isGrowth = plan.slug === "pro";

  return (
    <Card
      className={`relative flex flex-col justify-between ${isGrowth ? "border-primary shadow-md" : ""}`}
    >
      {isGrowth && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-0.5 text-xs font-semibold shadow-sm">
            <Zap className="h-3 w-3" /> Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
          {isCurrent && <Badge variant="secondary">Current Plan</Badge>}
        </div>
        <CardDescription>
          {plan.slug === "free" && "Essential HR foundation for small teams"}
          {plan.slug === "pro" && "High-growth tooling & compliance vaults"}
          {plan.slug === "enterprise" && "Maximum security, custom limits & dedicated SLAs"}
        </CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight">
            {formatPrice(plan, currency)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 text-sm">
        <div className="border-t pt-3">
          <div className="text-muted-foreground mb-2 font-medium">Usage Limits:</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                {plan.maxEmployees === 0
                  ? "Unlimited Employees"
                  : `Up to ${plan.maxEmployees} Employees`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                {plan.maxStorageMb === 0
                  ? "Unlimited Storage"
                  : `${plan.maxStorageMb >= 1000 ? `${plan.maxStorageMb / 1000} GB` : `${plan.maxStorageMb} MB`} Document Vault`}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="text-muted-foreground mb-2 font-medium">Features:</div>
          <ul className="space-y-1.5">
            {Object.entries(plan.features).map(([key, enabled]) => (
              <li
                key={key}
                className={`flex items-center gap-2 ${enabled ? "text-foreground" : "text-muted-foreground/40 line-through"}`}
              >
                <Check
                  className={`h-4 w-4 shrink-0 ${enabled ? "text-emerald-600" : "text-muted-foreground/30"}`}
                />
                <span>{FEATURE_LABELS[key] || key}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        {isCurrent ? (
          <Button disabled variant="outline" className="w-full">
            Active Plan
          </Button>
        ) : (
          <Button
            variant={isGrowth ? "default" : "outline"}
            className="w-full"
            onClick={() => onSelect(plan)}
          >
            {plan.slug === "free" ? "Downgrade to Starter" : `Switch to ${plan.name}`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
