import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/db";
import Buyer from "./lib/models/Buyer";
import Seller from "./lib/models/Seller";
import { authConfig } from "./auth.config";
import { connectDB } from "./lib/db";
import Admin from "./lib/models/Admin";
import Buyer from "./lib/models/Buyer";
import Seller from "./lib/models/Seller";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const admin = await Admin.findOne({ email });
        const buyer = await Buyer.findOne({ email });
        const seller = await Seller.findOne({ email });

        const user = admin ?? buyer ?? seller;

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        const role = (user as { role?: unknown }).role;
        if (role === "admin" || role === "buyer" || role === "seller") {
          token.role = role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        if (token.role === "admin" || token.role === "buyer" || token.role === "seller") {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },
});
