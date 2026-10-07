import type { FastifyPluginAsync } from "fastify";
import { loanController } from "../../controllers/loan.controller";
import { requirePermission } from "../../middleware/require-permission";

const loansRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", { preHandler: requirePermission("loans:read") }, loanController.list);

  fastify.get("/summary", { preHandler: requirePermission("loans:read") }, loanController.summary);

  fastify.get("/:id", { preHandler: requirePermission("loans:read") }, loanController.findById);

  fastify.post("/", { preHandler: requirePermission("loans:create") }, loanController.create);

  fastify.post(
    "/:id/approve",
    { preHandler: requirePermission("loans:approve") },
    loanController.approve,
  );

  fastify.post(
    "/:id/reject",
    { preHandler: requirePermission("loans:approve") },
    loanController.reject,
  );

  fastify.post(
    "/:id/payments",
    { preHandler: requirePermission("loans:record-payment") },
    loanController.recordPayment,
  );
};

export default loansRoutes;
