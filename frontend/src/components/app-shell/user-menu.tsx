"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL: Record<string, string> = {
  org_admin: "Admin",
  org_staff: "Staff",
  org_viewer: "Viewer",
};

export function UserMenu({
  email,
  role,
}: {
  email: string | null | undefined;
  role: string | null | undefined;
}): React.JSX.Element {
  const initial = (email ?? "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted/50 flex items-center gap-2 rounded-md p-1.5">
        <Avatar className="h-7 w-7">
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        {role && <Badge variant="secondary">{ROLE_LABEL[role] ?? role}</Badge>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="truncate">{email ?? "Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/login" })}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
