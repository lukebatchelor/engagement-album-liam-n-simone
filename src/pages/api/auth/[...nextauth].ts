import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user, account }) {
      // user is only passed to us on sign in, persist the user info to the token here
      if (user) {
        token.isAdmin = user.isAdmin;
        token.name = user.id;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (session.user && token) {
        session.user.isAdmin = token.isAdmin;
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
        // originally using crypto.timingSafeCompare but it's too much of a hassle
        // to also have to compare string lengths since we're not hashing the pw's
        const userPass = credentials?.password.toLocaleLowerCase();

        if (userPass === env.APPLICATION_PASSWORD.toLocaleLowerCase()) {
          return { id: "user-1", isAdmin: false };
        } else if (userPass === env.APPLICATION_ADMIN_PASSWORD.toLocaleLowerCase()) {
          return { id: "admin-1", isAdmin: true };
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
