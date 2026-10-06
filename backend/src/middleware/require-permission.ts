import type { FastifyRequest, FastifyReply } from "fastify";
import { can, type Permission, type Role } from "@app/shared/config";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

/**
 * preHandler factory. Must run after `fastify.authenticate`.
 * Platform admins bypass org-scoped checks (RULES.md §9's auditable superadmin bypass).
 */
export function requirePermission(permission: Permission) {
  return async function requirePermissionHandler(
    req: FastifyRequest,
    _reply: FastifyReply,
  ): Promise<void> {
    if (!req.auth) throw new UnauthorizedError();
    if (req.auth.isPlatformAdmin) return;
    if (!req.auth.role || !can(req.auth.role as Role, permission)) {
      throw new ForbiddenError(`Missing permission: ${permission}`);
    }
  };
}
