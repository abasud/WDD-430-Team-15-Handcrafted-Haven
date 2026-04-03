import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // This is where NextAuth redirects if authorized returns false
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // 1. Define your protected routes here
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      const isOnSellerPanel = nextUrl.pathname.startsWith("/seller");
      const isOnWishlist = nextUrl.pathname.startsWith("/wishlist");

      // 2. Check if the user is trying to access a protected route
      if (isOnAdminPanel || isOnSellerPanel || isOnWishlist) {
        if (isLoggedIn) {
          return true; // Let them in
        }
        return false; // Redirect unauthenticated users to the login page
      }

      // 3. Logic for the login page itself
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      if (isOnLoginPage) {
        if (isLoggedIn) {
          // If they are already logged in, redirect them away from login page
          // (You can change this to redirect to /admin or /dashboard later)
          return Response.redirect(new URL("/", nextUrl)); 
        }
        return true; // Let them see the login page
      }

      // 4. Default: Allow access to all other routes (Home, Products, etc.)
      return true;
    },
  },
  providers: [], // Keep whatever providers you already have here
} satisfies NextAuthConfig;