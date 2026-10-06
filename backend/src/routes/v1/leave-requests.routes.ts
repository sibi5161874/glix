import type { FastifyPluginAsync } from "fastify";
import { leaveRequestController } from "../../controllers/leave-request.controller";
import { requirePermission } from "../../middleware/require-permission";

const leaveRequestsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("leaves:requests:read") },
    leaveRequestController.list,
  );
  fastify.post(
    "/",
    { preHandler: requirePermission("leaves:requests:create") },
    leaveRequestController.create,
  );
  fastify.post(
    "/:id/approve",
    { preHandler: requirePermission("leaves:requests:approve") },
    leaveRequestController.approve,
  );
  fastify.post(
    "/:id/reject",
    { preHandler: requirePermission("leaves:requests:reject") },
    leaveRequestController.reject,
  );
  // No dedicated `leaves:requests:cancel` permission key exists in
  // shared/config/permissions.config.ts — cancel is available to the same
  // roles as create, and the service layer (leave-request.service.ts's
  // `cancel`) enforces the real self-or-approver authorization.
  fastify.post(
    "/:id/cancel",
    { preHandler: requirePermission("leaves:requests:create") },
    leaveRequestController.cancel,
  );
};

export default leaveRequestsRoutes;
