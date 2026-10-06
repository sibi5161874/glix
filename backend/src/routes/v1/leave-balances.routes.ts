import type { FastifyPluginAsync } from "fastify";
import { leaveBalanceController } from "../../controllers/leave-balance.controller";
import { requirePermission } from "../../middleware/require-permission";

const leaveBalancesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("leaves:balances:read") },
    leaveBalanceController.list,
  );
  fastify.post(
    "/adjust",
    { preHandler: requirePermission("leaves:balances:adjust") },
    leaveBalanceController.adjust,
  );
};

export default leaveBalancesRoutes;
