import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { getServerEnv } from "@app/shared/config";
import { UnauthorizedError } from "../utils/errors";

export interface AuthClaims {
  sub: string;
  email: string;
  orgId: string | null;
  role: "org_admin" | "org_staff" | "org_viewer" | null;
  employeeId: string | null;
  isPlatformAdmin: boolean;
}

declare module "fastify" {
  interface FastifyRequest {
    auth?: AuthClaims;
  }
  interface FastifyInstance {
    signAuthToken(claims: AuthClaims): string;
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // getServerEnv() requires JWT_SECRET (shared/config/env.ts) — already
  // validated by the time this plugin registers, so this read can't fail
  // silently the way a bare `process.env["JWT_SECRET"]` read could.
  const { JWT_SECRET: secret, JWT_EXPIRES_IN: expiresIn } = getServerEnv();

  fastify.decorate("signAuthToken", function signAuthToken(claims: AuthClaims): string {
    return jwt.sign(claims, secret, { expiresIn } as jwt.SignOptions);
  });

  fastify.decorate(
    "authenticate",
    async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
      const header = request.headers.authorization;
      if (!header?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Missing bearer token");
      }
      const token = header.slice("Bearer ".length);
      try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        request.auth = {
          sub: String(decoded.sub),
          email: String(decoded["email"]),
          orgId: (decoded["orgId"] as string | null) ?? null,
          role: (decoded["role"] as AuthClaims["role"]) ?? null,
          employeeId: (decoded["employeeId"] as string | null) ?? null,
          isPlatformAdmin: Boolean(decoded["isPlatformAdmin"]),
        };
      } catch {
        throw new UnauthorizedError("Invalid or expired token");
      }
    },
  );
};

export default fp(authPlugin);
