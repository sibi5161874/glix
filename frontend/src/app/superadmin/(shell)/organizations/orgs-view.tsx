"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrgsTable } from "./orgs-table";
import { CreateOrgDialog } from "./create-org-dialog";
import type { PlatformOrgItem } from "@/lib/platform";
import type { PlanItem } from "@/lib/billing";

interface OrgsViewProps {
  accessToken: string;
  initialOrganizations: PlatformOrgItem[];
  plans: PlanItem[];
}

export function OrgsView({
  accessToken,
  initialOrganizations,
  plans,
}: OrgsViewProps): React.JSX.Element {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredOrgs = initialOrganizations.filter((org) => {
    if (planFilter !== "all" && org.tier !== planFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return org.name.toLowerCase().includes(q) || org.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Building2 className="text-primary h-6 w-6" />
            Tenant Organizations
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Directory of all provisioned SaaS client organizations, active plans, and usage limits.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-1.5">
          <PlusCircle className="h-4 w-4" />
          Provision Tenant
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search organizations by name or subdomain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Starter</SelectItem>
              <SelectItem value="pro">Growth</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <OrgsTable organizations={filteredOrgs} />

      <CreateOrgDialog
        accessToken={accessToken}
        plans={plans}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
