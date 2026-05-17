import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "@/infrastructure/database/prisma-client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.toLowerCase().trim();
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          console.warn("[auth] missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          console.warn(`[auth] user not found: ${email}`);
          return null;
        }
        if (!user.passwordHash) {
          console.warn(`[auth] user has no passwordHash: ${email}`);
          return null;
        }
        if (!user.isActive) {
          console.warn(`[auth] user inactive: ${email}`);
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          console.warn(`[auth] bad password for ${email}`);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
          role: user.role,
        } as unknown as import("next-auth").User;
      },
    }),
  ],
});
