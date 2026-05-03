import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export type UserRole = "super_admin" | "trainer" | "trainee";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const demoUsers: DemoUser[] = [
  {
    id: "trainer-1",
    name: "Trainer One",
    email: "trainer@example.com",
    password: "trainer123",
    role: "trainer",
  },
  {
    id: "client-1",
    name: "Trainee One",
    email: "client@example.com",
    password: "client123",
    role: "trainee",
  },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        let dbUser: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
        try {
          dbUser = await prisma.user.findUnique({ where: { email } });
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[auth] Database unavailable; using demo users only.", err);
          }
          dbUser = null;
        }

        if (dbUser) {
          if (!dbUser.passwordHash) return null;
          const valid = await compare(password, dbUser.passwordHash);
          if (!valid) return null;
          return {
            id: dbUser.id,
            name: dbUser.name ?? dbUser.email,
            email: dbUser.email,
            role: dbUser.role as UserRole,
          };
        }

        const user = demoUsers.find(
          (entry) => entry.email.toLowerCase() === email && entry.password === password,
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role as UserRole;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole | undefined) ?? "trainee";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
