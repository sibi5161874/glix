import type { DefaultSession } from "next-auth";

type Role = "org_admin" | "org_staff" | "org_viewer";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: DefaultSession["user"] & {
      id: string;
      orgId: string | null;
      role: Role | null;
      employeeId: string | null;
      isPlatformAdmin: boolean;
    };
  }

  interface User {
    accessToken: string;
    orgId: string | null;
    role: Role | null;
    employeeId: string | null;
    isPlatformAdmin: boolean;
  }
}
