import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      const isOnSellerPanel = nextUrl.pathname.startsWith("/seller");
      const isOnWishlist = nextUrl.pathname.startsWith("/wishlist");
      const isOnAccount = nextUrl.pathname.startsWith("/account");
      const isOnNewProduct = nextUrl.pathname.startsWith("/products/new");

      if (
        isOnAdminPanel ||
        isOnSellerPanel ||
        isOnWishlist ||
        isOnAccount ||
        isOnNewProduct
      ) {
        if (isLoggedIn) {
          return true;
        }
        return false;
      }

      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;