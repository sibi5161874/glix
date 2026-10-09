import type { FastifyPluginAsync } from "fastify";
import { designationController } from "../../controllers/designation.controller";
import { requirePermission } from "../../middleware/require-permission";

const designationsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("designations:read") },
    designationController.list,
  );

  fastify.get(
    "/:id",
    { preHandler: requirePermission("designations:read") },
    designationController.findById,
  );

  fastify.post(
    "/",
    { preHandler: requirePermission("designations:write") },
    designationController.create,
  );

  fastify.put(
    "/:id",
    { preHandler: requirePermission("designations:write") },
    designationController.update,
  );

  fastify.delete(
    "/:id",
    { preHandler: requirePermission("designations:write") },
    designationController.remove,
  );
};

export default designationsRoutes;
