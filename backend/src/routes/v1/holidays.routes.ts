import type { FastifyPluginAsync } from "fastify";
import { holidayController } from "../../controllers/holiday.controller";
import { requirePermission } from "../../middleware/require-permission";

const holidaysRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.get("/", { preHandler: requirePermission("holidays:read") }, holidayController.list);
  fastify.post("/", { preHandler: requirePermission("holidays:write") }, holidayController.create);
  fastify.put(
    "/:id",
    { preHandler: requirePermission("holidays:write") },
    holidayController.update,
  );
  fastify.delete(
    "/:id",
    { preHandler: requirePermission("holidays:write") },
    holidayController.remove,
  );
};

export default holidaysRoutes;
