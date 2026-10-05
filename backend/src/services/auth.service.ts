import type { FastifyInstance } from "fastify";
import argon2 from "argon2";
import type { RegisterOrgInput, LoginInput } from "@app/shared/schemas";
import { authRepository } from "../repositories/auth.repository";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import type { AuthClaims } from "../plugins/auth.plugin";

export interface AuthResult {
  accessToken: string;
  claims: AuthClaims;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authService = {
  async register(fastify: FastifyInstance, input: RegisterOrgInput): Promise<AuthResult> {
    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });

    let registered;
    try {
      registered = await authRepository.registerOrganization(fastify, {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        orgName: input.orgName,
        orgSlug: input.orgSlug,
        planSlug: input.planSlug,
        currency: input.currency,
        phone: input.phone || undefined,
        industry: input.industry || undefined,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("duplicate key")) {
        throw new ConflictError("Email or organization slug already in use");
      }
      throw err;
    }

    const claims: AuthClaims = {
      sub: registered.userId,
      email: input.email,
      orgId: registered.orgId,
      role: "org_admin",
      employeeId: null,
      isPlatformAdmin: false,
    };
    return { accessToken: fastify.signAuthToken(claims), claims };
  },

  async login(fastify: FastifyInstance, input: LoginInput): Promise<AuthResult> {
    if (EMAIL_RE.test(input.identifier)) {
      return loginWithEmail(fastify, input.identifier, input.secret);
    }
    return loginWithEmployeeCode(fastify, input.identifier, input.secret);
  },
};

async function loginWithEmail(
  fastify: FastifyInstance,
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await authRepository.findUserByEmail(fastify, email);
  if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, password))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPlatformAdmin = await authRepository.isPlatformAdmin(fastify, user.id);
  const memberships = await authRepository.findUserMemberships(fastify, user.id);
  const primary = memberships[0];

  const claims: AuthClaims = {
    sub: user.id,
    email,
    orgId: primary?.orgId ?? null,
    role: (primary?.role as AuthClaims["role"]) ?? null,
    employeeId: null,
    isPlatformAdmin,
  };
  return { accessToken: fastify.signAuthToken(claims), claims };
}

async function loginWithEmployeeCode(
  fastify: FastifyInstance,
  employeeCode: string,
  secret: string,
): Promise<AuthResult> {
  const rows = await authRepository.findEmployeeLogin(fastify, employeeCode);
  if (rows.length === 0) throw new UnauthorizedError("Invalid employee code or credential");
  if (rows.length > 1) {
    // employee_code is only unique per org — ambiguous without org/subdomain
    // context. Deferred: see .agents/_session.md Phase 1 notes.
    throw new UnauthorizedError("Employee code is ambiguous across organizations");
  }
  const row = rows[0]!;
  if (row.employeeStatus === "terminated") {
    throw new UnauthorizedError("This employee account is no longer active");
  }

  const credentialOk = row.passwordHash
    ? await argon2.verify(row.passwordHash, secret)
    : row.dob === secret;
  if (!credentialOk) throw new UnauthorizedError("Invalid employee code or credential");

  const claims: AuthClaims = {
    sub: row.userId,
    email: "",
    orgId: row.orgId,
    role: (row.role as AuthClaims["role"]) ?? "org_viewer",
    employeeId: row.employeeId,
    isPlatformAdmin: false,
  };
  return { accessToken: fastify.signAuthToken(claims), claims };
}
