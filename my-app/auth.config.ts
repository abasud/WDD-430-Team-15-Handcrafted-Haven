import type { NextAuthConfig } from "next-auth";

// Lightweight config for Edge Runtime (middleware) — no database imports
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
};
