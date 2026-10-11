import type { FastifyPluginAsync } from "fastify";
import { platformAdminController } from "../../controllers/platform-admin.controller";
import { ForbiddenError } from "../../utils/errors";

const platformRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", async (req) => {
    if (!req.auth?.isPlatformAdmin) {
      throw new ForbiddenError("Platform superadmin access required");
    }
  });

  fastify.get("/overview", platformAdminController.overview);
  fastify.get("/organizations", platformAdminController.listOrganizations);
  fastify.post("/organizations", platformAdminController.createOrganization);
  fastify.get("/plans", platformAdminController.listPlans);
  fastify.put("/plans/:id", platformAdminController.updatePlan);
  fastify.get("/settings", platformAdminController.listSettings);
  fastify.get("/settings/:key", platformAdminController.getSetting);
  fastify.put("/settings/:key", platformAdminController.upsertSetting);
  fastify.get("/team", platformAdminController.listTeam);
  fastify.post("/team", platformAdminController.addTeamMember);
  fastify.get("/leads", platformAdminController.listLeads);
  fastify.patch("/leads/:id", platformAdminController.updateLead);
};

export default platformRoutes;
