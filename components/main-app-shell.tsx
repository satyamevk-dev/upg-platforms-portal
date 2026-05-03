import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { SignOutNavLink } from "@/components/sign-out-nav-link";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#00A89E]";

export async function MainAppShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isSuperAdmin = role === "super_admin";
  const showTrainerNav = role !== "trainee";
  const brandHref = isSuperAdmin ? "/" : "/dashboard";

  return (
    <div className="relative flex min-h-dvh w-full max-w-full flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200/80 via-[#f0ebe3]/90 to-[#e8e4dc]/95"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#f5f3f0]/93 to-[#ebe8e3]/96"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='2' fill='%235B4B96'/%3E%3Ccircle cx='32' cy='24' r='2' fill='%2300A89E'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
      </div>

      <header className="sticky top-0 z-30 border-b border-[#d8d0c4] bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={brandHref} className="group flex items-center gap-3 outline-none">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#00A89E] bg-white shadow-sm">
              <span
                className="block h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-[#00A89E]"
                aria-hidden
              />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#00A89E]">
                + Advantage Infinite
              </span>
              <span className="text-sm font-medium lowercase tracking-tight text-slate-900">
                infinite
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2" aria-label="Main">
            {isSuperAdmin ? (
              <Link href="/" className={navLinkClass}>
                Home
              </Link>
            ) : null}
            <Link href="/dashboard" className={navLinkClass}>
              Dashboard
            </Link>
            {showTrainerNav ? (
              <Link href="/trainer" className={navLinkClass}>
                Trainer
              </Link>
            ) : null}
            {role === "trainee" ? (
              <Link href="/client" className={navLinkClass}>
                Trainee
              </Link>
            ) : null}
            <SignOutNavLink />
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
