import type { FastifyPluginAsync } from "fastify";
import { authController } from "../../controllers/auth.controller";

// Tight limits on the credential-guessing surface — register/login are the
// only unauthenticated routes that take a secret. Keyed per-IP by default.
const loginRateLimit = { max: 10, timeWindow: "1 minute" };
const registerRateLimit = { max: 5, timeWindow: "1 minute" };

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", { config: { rateLimit: registerRateLimit } }, authController.register);
  fastify.post("/login", { config: { rateLimit: loginRateLimit } }, authController.login);
  fastify.get("/me", { preHandler: fastify.authenticate }, authController.me);
};

export default authRoutes;
