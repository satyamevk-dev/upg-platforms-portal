import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "super_admin" | "trainer" | "trainee";
    } & DefaultSession["user"];
  }

  interface User {
    role: "super_admin" | "trainer" | "trainee";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "super_admin" | "trainer" | "trainee";
  }
}
