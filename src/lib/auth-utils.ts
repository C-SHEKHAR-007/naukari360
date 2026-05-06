import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { AdminRole } from "@prisma/client";

export type AuthResult =
  | {
      authorized: true;
      session: { user: { id: string; email: string; name: string; role: AdminRole } };
    }
  | { authorized: false; response: NextResponse };

/**
 * Require authenticated admin session.
 * Any admin role (editor or super_admin) is allowed.
 */
export async function requireAdmin(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const role = (session.user as unknown as { role: string }).role as AdminRole;
  if (!role || !["super_admin", "editor"].includes(role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return {
    authorized: true,
    session: {
      user: {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name!,
        role,
      },
    },
  };
}

/**
 * Require super_admin role.
 * Used for destructive operations, site settings, ad management, subscriber export.
 */
export async function requireSuperAdmin(): Promise<AuthResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const role = (session.user as unknown as { role: string }).role as AdminRole;
  if (role !== "super_admin") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden: super_admin required" }, { status: 403 }),
    };
  }
  return {
    authorized: true,
    session: {
      user: {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name!,
        role,
      },
    },
  };
}
