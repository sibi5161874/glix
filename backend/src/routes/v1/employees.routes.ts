import type { FastifyPluginAsync } from "fastify";
import { employeeController } from "../../controllers/employee.controller";
import { requirePermission } from "../../middleware/require-permission";

const employeesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", { preHandler: requirePermission("employees:read") }, employeeController.list);
  fastify.get(
    "/export",
    { preHandler: requirePermission("employees:export") },
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
