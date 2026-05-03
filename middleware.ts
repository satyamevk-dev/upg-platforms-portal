import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const trainerPath = "/trainer";
const clientPath = "/client";
const dashboardPath = "/dashboard";

export default withAuth((request) => {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const role = request.nextauth.token?.role;
  const isLoggedIn = Boolean(request.nextauth.token);

  const isHomePath = pathname === "/" || pathname === "";

  if (isHomePath) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", "/");
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (
    !isLoggedIn &&
    (pathname.startsWith(trainerPath) ||
      pathname.startsWith(clientPath) ||
      pathname.startsWith(dashboardPath))
  ) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const canAccessTrainer = role === "trainer" || role === "super_admin";

  const isTrainerPlanEditor =
    pathname.startsWith(`${trainerPath}/training-plans/new`) ||
    /^\/trainer\/training-plans\/[^/]+\/edit\/?$/.test(pathname);
  if (isTrainerPlanEditor && role !== "trainer") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (pathname.startsWith(trainerPath) && !canAccessTrainer) {
    return NextResponse.redirect(new URL("/client", nextUrl));
  }

  if (pathname.startsWith(clientPath) && role === "super_admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (pathname.startsWith(clientPath) && role === "trainer") {
    return NextResponse.redirect(new URL("/trainer", nextUrl));
  }

  return NextResponse.next();
}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      if (
        pathname.startsWith(trainerPath) ||
        pathname.startsWith(clientPath) ||
        pathname.startsWith(dashboardPath)
      ) {
        return Boolean(token);
      }
      return true;
    },
  },
});

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/trainer/:path*", "/client/:path*"],
};
