import type { FastifyPluginAsync } from "fastify";
import { reportController } from "../../controllers/report.controller";
import { requirePermission } from "../../middleware/require-permission";

// Every export builds a CSV/XLSX/PDF buffer server-side per request — capped
// the same way employees' export is (see employees.routes.ts), since this is
// the same cost-per-call shape repeated 4 times.
const exportRateLimit = { max: 20, timeWindow: "1 minute" };

const reportsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);
  fastify.addHook("preHandler", requirePermission("reports:read"));

  fastify.get("/employees", reportController.employees);
  fastify.get(
    "/employees/export",
    { preHandler: requirePermission("reports:export"), config: { rateLimit: exportRateLimit } },
    reportController.employeesExport,
  );

  fastify.get("/leaves", reportController.leaves);
  fastify.get(
    "/leaves/export",
    { preHandler: requirePermission("reports:export"), config: { rateLimit: exportRateLimit } },
    reportController.leavesExport,
  );

  fastify.get("/documents", reportController.documents);
  fastify.get(
    "/documents/export",
    { preHandler: requirePermission("reports:export"), config: { rateLimit: exportRateLimit } },
    reportController.documentsExport,
  );

  fastify.get("/loans", reportController.loans);
  fastify.get(
    "/loans/export",
    { preHandler: requirePermission("reports:export"), config: { rateLimit: exportRateLimit } },
    reportController.loansExport,
  );
};

export default reportsRoutes;
