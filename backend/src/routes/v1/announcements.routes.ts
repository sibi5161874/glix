import type { FastifyPluginAsync } from "fastify";
import { announcementController } from "../../controllers/announcement.controller";
import { requirePermission } from "../../middleware/require-permission";

const announcementsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("announcements:read") },
    announcementController.list,
  );

  fastify.get(
    "/:id",
    { preHandler: requirePermission("announcements:read") },
    announcementController.findById,
  );

  fastify.post(
    "/",
    { preHandler: requirePermission("announcements:create") },
    announcementController.create,
  );

  fastify.put(
    "/:id",
    { preHandler: requirePermission("announcements:update") },
    announcementController.update,
  );

  fastify.delete(
    "/:id",
    { preHandler: requirePermission("announcements:delete") },
    announcementController.remove,
  );
};

export default announcementsRoutes;
