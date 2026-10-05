import type { FastifyPluginAsync } from "fastify";
import { authController } from "../../controllers/auth.controller";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);
  fastify.get("/me", { preHandler: fastify.authenticate }, authController.me);
};

export default authRoutes;
