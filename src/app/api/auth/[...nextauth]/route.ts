import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { sigIngEmailPassword } from "@/auth/actions/auth-actions";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Tu email" },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "Tu contraseña",
        },
      },
      async authorize(credentials, req) {
        const user = await sigIngEmailPassword(
          credentials!.email,
          credentials!.password
        );
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? "no-email" },
        });
        if (dbUser?.isActive === false) {
          throw new Error("Usuario no activo");
        }
        token.roles = dbUser?.roles ?? ["no-roles"];
        token.id = dbUser?.id ?? "no-uuid";
      }

      return token;
    },

    async session({ session, token, user }) {
      if (session && session.user) {
        session.user.roles = token.roles;
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
