import jwt from "jsonwebtoken";
import type { AuthClaims } from "../plugins/auth.plugin";

export const SEEDED_ORG_ID = "11111111-1111-1111-1111-111111111111";
export const SEEDED_ADMIN_USER_ID = "00000000-0000-0000-0000-000000000002";
export const SEEDED_STAFF_USER_ID = "00000000-0000-0000-0000-000000000003";
export const SEEDED_STAFF_EMPLOYEE_ID = "22222222-2222-2222-2222-222222222221";

export function signTestToken(claims: Partial<AuthClaims>): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET not set — is .env.local loaded?");
  const full: AuthClaims = {
    sub: claims.sub ?? SEEDED_ADMIN_USER_ID,
    email: claims.email ?? "owner@acme.test",
    orgId: claims.orgId ?? SEEDED_ORG_ID,
    role: claims.role ?? "org_admin",
    employeeId: claims.employeeId ?? null,
    isPlatformAdmin: claims.isPlatformAdmin ?? false,
  };
  return jwt.sign(full, secret, { expiresIn: "1h" });
}

export function authHeader(claims: Partial<AuthClaims> = {}): { authorization: string } {
  return { authorization: `Bearer ${signTestToken(claims)}` };
}
