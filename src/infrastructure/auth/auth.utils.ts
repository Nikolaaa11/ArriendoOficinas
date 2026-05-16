import { auth } from "./auth";

export async function getSession() {
  return auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireRole(roles: Array<"SUPER_ADMIN" | "ADMIN" | "TENANT">) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !roles.includes(role as never)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
