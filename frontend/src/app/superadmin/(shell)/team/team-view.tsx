"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus } from "lucide-react";
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
import { AddMemberDialog } from "./add-member-dialog";
import type { PlatformTeamMember } from "@/lib/platform";

interface TeamViewProps {
  accessToken: string;
  initialTeam: PlatformTeamMember[];
}

function getRoleBadge(role: PlatformTeamMember["role"]): React.JSX.Element {
  switch (role) {
    case "owner":
      return <Badge className="bg-purple-600 text-white hover:bg-purple-700">Owner</Badge>;
    case "admin":
      return (
        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">Admin</Badge>
      );
    case "support":
      return <Badge variant="secondary">Support</Badge>;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function TeamView({ accessToken, initialTeam }: TeamViewProps): React.JSX.Element {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSuccess = (): void => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="text-primary h-6 w-6" />
            Platform Operations Team
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage superadmin platform owners, administrators, and support engineers.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shrink-0 gap-1.5">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="bg-card overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Platform Role</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialTeam.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="text-foreground text-sm font-semibold">
                  {member.fullName}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {member.email}
                </TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDate(member.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddMemberDialog
        accessToken={accessToken}
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
