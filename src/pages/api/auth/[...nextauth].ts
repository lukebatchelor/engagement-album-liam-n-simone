import NextAuth, { type User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "node:crypto";

import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ""; // token.sub is the user.id
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Access site",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user: User = { id: "user-1" };
        if (
          crypto.timingSafeEqual(
            Buffer.from(credentials?.password || ""),
            Buffer.from(env.APPLICATION_PASSWORD)
          )
        ) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
