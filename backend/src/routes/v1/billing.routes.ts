import type { FastifyPluginAsync } from "fastify";
import { billingController } from "../../controllers/billing.controller";
import { requirePermission } from "../../middleware/require-permission";

const billingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requirePermission("billing:read"));

  fastify.get("/plans", billingController.plans);
  fastify.get("/subscription", billingController.subscription);
  fastify.get("/invoices", billingController.invoices);

  fastify.post(
    "/change-tier",
    { preHandler: requirePermission("billing:update") },
    billingController.changeTier,
  );
};

export default billingRoutes;
