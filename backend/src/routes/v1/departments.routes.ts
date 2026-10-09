import type { FastifyPluginAsync } from "fastify";
import { departmentController } from "../../controllers/department.controller";
import { requirePermission } from "../../middleware/require-permission";

const departmentsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get(
    "/",
    { preHandler: requirePermission("departments:read") },
    departmentController.list,
  );

  fastify.get(
    "/:id",
    { preHandler: requirePermission("departments:read") },
    departmentController.findById,
  );

  fastify.post(
    "/",
    { preHandler: requirePermission("departments:write") },
    departmentController.create,
  );

  fastify.put(
    "/:id",
    { preHandler: requirePermission("departments:write") },
    departmentController.update,
  );

  fastify.delete(
    "/:id",
    { preHandler: requirePermission("departments:write") },
    departmentController.remove,
  );
};

export default departmentsRoutes;
