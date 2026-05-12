import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { SignOutNavLink } from "@/components/sign-out-nav-link";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#F46036]";

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
          className="absolute inset-0 bg-gradient-to-br from-slate-200/80 via-[#f0ebe3]/90 to-[#D0D3E7]/95"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#F7F7FF]/93 to-[#ebe8e3]/96"
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

      <header className="sticky top-0 z-30 border-b border-[#D0D3E7] bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href={brandHref}
            aria-label="Infinite home"
            className="group flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#F46036]/40 focus-visible:ring-offset-2 rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/infinite-logo.png"
              alt="Infinite"
              width={541}
              height={443}
              className="h-11 w-auto select-none"
              draggable={false}
            />
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
