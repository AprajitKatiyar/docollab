import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "login",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const response = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            const data = await response.json();
            return {
              ...data.user,
              image: "",
            };
          } else {
            throw new Error("Error during login");
          }
        } catch (error) {
          throw new Error("Error during login");
        }
      },
    }),
    CredentialsProvider({
      id: "signup",
      credentials: {},
      async authorize(credentials) {
        const { email, password, name } = credentials as {
          email: string;
          password: string;
          name: string;
        };
        try {
          const response = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
              name: name,
            }),
            headers: { "Content-Type": "application/json" },
          });
          if (response.ok) {
            const data = await response.json();
            return {
              ...data.user,
              image: "",
            };
          } else {
            throw new Error("Error during signup");
          }
        } catch (error) {
          throw new Error("Error during signup");
        }
      },
    }),
    // ...add more providers here
  ] as Provider[],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const response = await fetch(
          "http://localhost:3001/auth/saveOauthUser",
          {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
};

export default NextAuth(authOptions);
