import type { FastifyPluginAsync } from "fastify";
import { supportController } from "../../controllers/support.controller";
import { requirePermission } from "../../middleware/require-permission";

const supportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.post("/", { preHandler: requirePermission("support:create") }, supportController.create);
  fastify.get(
    "/mine",
    { preHandler: requirePermission("support:read:self") },
    supportController.listMine,
  );
  fastify.get("/", { preHandler: requirePermission("support:read") }, supportController.listForOrg);
  fastify.get(
    "/:id",
    { preHandler: requirePermission("support:read:self") },
    supportController.findById,
  );
};

export default supportRoutes;
