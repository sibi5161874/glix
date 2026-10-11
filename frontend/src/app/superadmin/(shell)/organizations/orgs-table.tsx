"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, HardDrive } from "lucide-react";
import type { PlatformOrgItem } from "@/lib/platform";

interface OrgsTableProps {
  organizations: PlatformOrgItem[];
}

function getTierBadge(tier: string): React.JSX.Element {
  switch (tier.toLowerCase()) {
    case "enterprise":
      return <Badge className="bg-purple-600 text-white hover:bg-purple-700">Enterprise</Badge>;
    case "pro":
    case "growth":
      return (
        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">Growth</Badge>
      );
    default:
      return <Badge variant="outline">Starter</Badge>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OrgsTable({ organizations }: OrgsTableProps): React.JSX.Element {
  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <Building2 className="text-muted-foreground mb-3 h-10 w-10" />
        <h4 className="text-base font-semibold">No Organizations Found</h4>
        <p className="text-muted-foreground mt-1 max-w-sm text-xs">
          No tenant organizations matched the current query or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Subdomain / Slug</TableHead>
            <TableHead>Current Tier</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Building2 className="text-muted-foreground h-4 w-4" />
                {org.name}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">{org.slug}</TableCell>
              <TableCell>{getTierBadge(org.tier || org.planName)}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">{org.currency}</TableCell>
              <TableCell className="text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <HardDrive className="text-muted-foreground h-3.5 w-3.5" />
                  {org.employeeCount} staff
                </span>
              </TableCell>
              <TableCell className="text-xs">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="text-muted-foreground h-3.5 w-3.5" />
                  {org.userCount} users
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatDate(org.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
