import type { AuthClaims } from "../plugins/auth.plugin";
import type { RequestContext } from "../plugins/db.plugin";
import { ForbiddenError } from "./errors";

/** Every tenant-scoped route needs this. Never build a RequestContext by hand. */
export function toRequestContext(auth: AuthClaims): RequestContext {
  if (!auth.orgId || !auth.role) {
    throw new ForbiddenError("This account is not linked to an organization");
  }
  return {
    userId: auth.sub,
    orgId: auth.orgId,
    role: auth.role,
    isPlatformAdmin: auth.isPlatformAdmin,
    ...(auth.employeeId ? { employeeId: auth.employeeId } : {}),
  };
}
