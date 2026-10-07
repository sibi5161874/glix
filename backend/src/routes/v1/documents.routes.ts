import type { FastifyPluginAsync } from "fastify";
import { documentController } from "../../controllers/document.controller";
import { requirePermission } from "../../middleware/require-permission";

const documentsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", { preHandler: requirePermission("documents:read") }, documentController.list);

  fastify.get(
    "/summary",
    { preHandler: requirePermission("documents:read") },
    documentController.summary,
  );

  fastify.get(
    "/:id",
    { preHandler: requirePermission("documents:read") },
    documentController.findById,
  );

  fastify.get(
    "/:id/download",
    { preHandler: requirePermission("documents:read") },
    documentController.download,
  );

  fastify.post(
    "/",
    { preHandler: requirePermission("documents:upload") },
    documentController.upload,
  );

  fastify.put(
    "/:id",
    { preHandler: requirePermission("documents:update") },
    documentController.update,
  );

  fastify.delete(
    "/:id",
    { preHandler: requirePermission("documents:delete") },
    documentController.remove,
  );
};

export default documentsRoutes;
