import type { FastifyPluginAsync } from "fastify";
import { settingsController } from "../../controllers/settings.controller";
import { requirePermission } from "../../middleware/require-permission";

const settingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  // Profile
  fastify.get(
    "/profile",
    { preHandler: requirePermission("settings:profile:read") },
    settingsController.getProfile,
  );
  fastify.put(
    "/profile",
    { preHandler: requirePermission("settings:profile:write") },
    settingsController.updateProfile,
  );

  // Notification Templates
  fastify.get(
    "/templates",
    { preHandler: requirePermission("settings:templates:read") },
    settingsController.listTemplates,
  );
  fastify.get(
    "/templates/:id",
    { preHandler: requirePermission("settings:templates:read") },
    settingsController.findTemplateById,
  );
  fastify.post(
    "/templates",
    { preHandler: requirePermission("settings:templates:write") },
    settingsController.saveTemplateOverride,
  );
  fastify.put(
    "/templates/:id",
    { preHandler: requirePermission("settings:templates:write") },
    settingsController.updateTemplate,
  );
  fastify.delete(
    "/templates/:id",
    { preHandler: requirePermission("settings:templates:write") },
    settingsController.deleteTemplateOverride,
  );

  // Role Permissions Matrix
  fastify.get(
    "/roles",
    { preHandler: requirePermission("settings:roles:read") },
    settingsController.getRolePermissionsMatrix,
  );
};

export default settingsRoutes;
