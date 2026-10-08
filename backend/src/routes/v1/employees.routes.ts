import type { FastifyPluginAsync } from "fastify";
import { employeeController } from "../../controllers/employee.controller";
import { requirePermission } from "../../middleware/require-permission";

// Export generates and streams a full XLSX workbook server-side on every
// call — cheap to request, not cheap to serve repeatedly. Capped the same
// way the unauthenticated auth routes are (app.ts's rate-limit plugin is
// opt-in per route via `config.rateLimit`).
const exportRateLimit = { max: 20, timeWindow: "1 minute" };

const employeesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", { preHandler: requirePermission("employees:read") }, employeeController.list);
  fastify.get(
    "/export",
    { preHandler: requirePermission("employees:export"), config: { rateLimit: exportRateLimit } },
    employeeController.exportXlsx,
  );
  fastify.post(
    "/import",
    { preHandler: requirePermission("employees:import") },
    employeeController.importCsv,
  );
  fastify.get(
    "/:id",
    { preHandler: requirePermission("employees:read") },
    employeeController.detail,
  );
  fastify.post(
    "/",
    { preHandler: requirePermission("employees:create") },
    employeeController.create,
  );
  fastify.put(
    "/:id",
    { preHandler: requirePermission("employees:update") },
    employeeController.update,
  );
  fastify.delete(
    "/:id",
    { preHandler: requirePermission("employees:delete") },
    employeeController.remove,
  );
};

export default employeesRoutes;
