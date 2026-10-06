import type { FastifyPluginAsync } from "fastify";
import { lookupController } from "../../controllers/lookup.controller";
import { requirePermission } from "../../middleware/require-permission";

const lookupsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/departments",
    { preHandler: requirePermission("departments:read") },
    lookupController.departments,
  );
  fastify.get(
    "/designations",
    { preHandler: requirePermission("designations:read") },
    lookupController.designations,
  );
};

export default lookupsRoutes;
