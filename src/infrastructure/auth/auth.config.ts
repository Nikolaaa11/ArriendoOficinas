import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // Defer real auth to auth.ts (Edge-incompatible parts kept out of Edge runtime).
      // The Node-side handler in auth.ts re-creates this provider with full DB access.
      return null;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isLoggedIn = Boolean(auth?.user);
      const isAdminArea = path.startsWith("/dashboard");
      const isPortalArea = path.startsWith("/mi-cuenta");
      const isAdminApi = path.startsWith("/api/admin");

      if (isAdminApi || isAdminArea) {
        return isLoggedIn && (auth?.user as { role?: string } | undefined)?.role !== "TENANT";
      }
      if (isPortalArea) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "TENANT";
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
        (session.user as { id?: string }).id = token.id as string | undefined;
      }
      return session;
    },
  },
  providers,
} satisfies NextAuthConfig;
