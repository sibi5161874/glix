import type { FastifyPluginAsync } from "fastify";
import { platformSupportController } from "../../controllers/platform-support.controller";
import { requirePermission } from "../../middleware/require-permission";

/** Platform-admin-only cross-org ticket management (`fastify.withPlatform`, not `withTenant`). */
const platformSupportRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requirePermission("platform:support:read"));

  fastify.get("/", platformSupportController.list);
  fastify.get("/:id", platformSupportController.findById);
  fastify.put(
    "/:id",
    { preHandler: requirePermission("platform:support:write") },
    platformSupportController.update,
  );
};

export default platformSupportRoutes;
