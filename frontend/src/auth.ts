import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000";

interface BackendAuthResult {
  accessToken: string;
  claims: {
    sub: string;
    email: string;
    orgId: string | null;
    role: "org_admin" | "org_staff" | "org_viewer" | null;
    employeeId: string | null;
    isPlatformAdmin: boolean;
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or employee code" },
        secret: { label: "Password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.["identifier"];
        const secret = credentials?.["secret"];
        if (typeof identifier !== "string" || typeof secret !== "string") return null;

        const res = await fetch(`${API_URL}/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, secret }),
        });
        if (!res.ok) return null;

        const body = (await res.json()) as { data: BackendAuthResult };
        const { accessToken, claims } = body.data;
        return {
          id: claims.sub,
          email: claims.email || null,
          accessToken,
          orgId: claims.orgId,
          role: claims.role,
          employeeId: claims.employeeId,
          isPlatformAdmin: claims.isPlatformAdmin,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["accessToken"] = user.accessToken;
        token["orgId"] = user.orgId;
        token["role"] = user.role;
        token["employeeId"] = user.employeeId;
        token["isPlatformAdmin"] = user.isPlatformAdmin;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token["accessToken"] as string;
      session.user.id = token.sub as string;
      session.user.orgId = token["orgId"] as string | null;
      session.user.role = token["role"] as "org_admin" | "org_staff" | "org_viewer" | null;
      session.user.employeeId = token["employeeId"] as string | null;
      session.user.isPlatformAdmin = token["isPlatformAdmin"] as boolean;
      return session;
    },
  },
});
