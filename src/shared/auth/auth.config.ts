import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { authenticateUser } from "@/modules/identity";

/**
 * Configuracao do Auth.js (NextAuth v5). Autenticacao por credenciais
 * (email/senha) - decisao provisoria registrada no plano de scaffold;
 * um provedor gerenciado (SSO/MFA) pode substituir isto depois sem
 * alterar o restante da aplicacao, que so depende da sessao tipada abaixo.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await authenticateUser({
          email: String(credentials.email),
          password: String(credentials.password),
        });

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.permissions = user.permissions;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
