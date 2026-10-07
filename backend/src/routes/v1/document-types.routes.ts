import type { FastifyPluginAsync } from "fastify";
import { documentTypeController } from "../../controllers/document-type.controller";
import { requirePermission } from "../../middleware/require-permission";

const documentTypesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("documents:types:read") },
    documentTypeController.list,
  );
  fastify.post(
    "/",
    { preHandler: requirePermission("documents:types:write") },
    documentTypeController.create,
  );
  fastify.put(
    "/:id",
    { preHandler: requirePermission("documents:types:write") },
    documentTypeController.update,
  );
  fastify.delete(
    "/:id",
    { preHandler: requirePermission("documents:types:write") },
    documentTypeController.remove,
  );
};

export default documentTypesRoutes;
