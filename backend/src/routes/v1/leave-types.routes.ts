import type { FastifyPluginAsync } from "fastify";
import { leaveTypeController } from "../../controllers/leave-type.controller";
import { requirePermission } from "../../middleware/require-permission";

const leaveTypesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("leaves:types:read") },
    leaveTypeController.list,
  );
  fastify.post(
    "/",
    { preHandler: requirePermission("leaves:types:write") },
    leaveTypeController.create,
  );
  fastify.put(
    "/:id",
    { preHandler: requirePermission("leaves:types:write") },
    leaveTypeController.update,
  );
  fastify.delete(
    "/:id",
    { preHandler: requirePermission("leaves:types:write") },
    leaveTypeController.remove,
  );
};

export default leaveTypesRoutes;
