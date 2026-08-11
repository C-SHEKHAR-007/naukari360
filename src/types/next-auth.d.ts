import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      qualification?: string | null;
      state?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    qualification?: string | null;
    state?: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role?: string;
    qualification?: string | null;
    state?: string | null;
  }
}
