"use client";

import { signOut } from "next-auth/react";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#F46036]";

export function SignOutNavLink() {
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/login";
      }}
      className={navLinkClass}
    >
      Sign out
    </button>
  );
}
