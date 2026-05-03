"use client";

import { signOut } from "next-auth/react";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#00A89E]";

export function SignOutNavLink() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={navLinkClass}
    >
      Sign out
    </button>
  );
}
