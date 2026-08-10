"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-primary-dark hover:shadow-md"
    >
      <LogIn className="h-5 w-5" />
      Sign in with Google
    </button>
  );
}
