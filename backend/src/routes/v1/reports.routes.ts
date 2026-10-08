import type { FastifyPluginAsync } from "fastify";
import { reportController } from "../../controllers/report.controller";
import { requirePermission } from "../../middleware/require-permission";

const reportsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requirePermission("reports:read"));

  fastify.get("/employees", reportController.employees);
  fastify.get(
    "/employees/export",
    { preHandler: requirePermission("reports:export") },
    reportController.employeesExport,
  );

  fastify.get("/leaves", reportController.leaves);
  fastify.get(
    "/leaves/export",
    { preHandler: requirePermission("reports:export") },
    reportController.leavesExport,
  );

  fastify.get("/documents", reportController.documents);
  fastify.get(
    "/documents/export",
    { preHandler: requirePermission("reports:export") },
    reportController.documentsExport,
  );

  fastify.get("/loans", reportController.loans);
  fastify.get(
    "/loans/export",
    { preHandler: requirePermission("reports:export") },
    reportController.loansExport,
  );
};

export default reportsRoutes;
