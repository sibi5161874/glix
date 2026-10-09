"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, X, Search, ShieldCheck } from "lucide-react";
import type { RoleMatrixItem } from "@/lib/settings";

const ROLE_LABELS: Record<string, { name: string; desc: string; badge: string }> = {
  super_admin: {
    name: "Super Admin",
    desc: "Platform system owner (cross-tenant)",
    badge: "bg-purple-600",
  },
  org_admin: {
    name: "Organization Admin",
    desc: "Full organization management & billing",
    badge: "bg-blue-600",
  },
  org_staff: {
    name: "Staff / HR Manager",
    desc: "Operational employee, leave & doc management",
    badge: "bg-emerald-600",
  },
  org_viewer: {
    name: "Employee / Viewer",
    desc: "Self-service requests & personal document view",
    badge: "bg-slate-600",
  },
};

export function RolesMatrix({ matrix }: { matrix: RoleMatrixItem[] }): React.JSX.Element {
  const [search, setSearch] = useState("");

  const allPermissions = Array.from(new Set(matrix.flatMap((m) => m.permissions))).sort();

  const filteredPermissions = allPermissions.filter((perm) =>
    perm.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {matrix.map(({ role, permissions }) => {
          const info = ROLE_LABELS[role] || {
            name: role,
            desc: "Custom role",
            badge: "bg-muted",
          };
          return (
            <Card key={role}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{info.name}</CardTitle>
                  <Badge className={info.badge}>{role}</Badge>
                </div>
                <CardDescription className="text-xs">{info.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{permissions.length}</div>
                <p className="text-muted-foreground text-xs">Granted permissions</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search permissions by key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Server-side enforced RBAC matrix
          </div>
        </div>

        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Permission Key</TableHead>
                {matrix.map((m) => (
                  <TableHead key={m.role} className="text-center">
                    {ROLE_LABELS[m.role]?.name || m.role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={matrix.length + 1}
                    className="text-muted-foreground h-32 text-center"
                  >
                    No matching permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((perm) => (
                  <TableRow key={perm}>
                    <TableCell className="font-mono text-xs font-medium">{perm}</TableCell>
                    {matrix.map((m) => {
                      const hasPerm = m.permissions.includes(perm);
                      return (
                        <TableCell key={m.role} className="text-center">
                          {hasPerm ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="bg-muted text-muted-foreground/50 inline-flex h-6 w-6 items-center justify-center rounded-full">
                              <X className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
