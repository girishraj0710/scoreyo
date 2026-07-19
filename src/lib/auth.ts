/**
 * NextAuth.js v5 Configuration
 * Date: 2026-07-19
 * Providers: Google OAuth + Email OTP
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser, getUserByEmail, createUserWithGoogle, findUserByGoogleId } from "@/lib/db";

// NextAuth configuration
export const authConfig: NextAuthConfig = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Email OTP Provider (using Credentials)
    // This is a bridge to our existing OTP system
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        // Credentials contains the user ID after OTP verification
        // This is called AFTER the OTP is verified via our existing /api/auth/otp endpoint
        if (!credentials?.userId || !credentials?.email) {
          return null;
        }

        const user = await getUser(credentials.userId as string);
        if (user && user.email === credentials.email) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.profile_picture || null,
            role: user.role || 'student',
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] signIn callback:', { provider: account?.provider, email: user.email });

      // Google OAuth Sign In
      if (account?.provider === "google") {
        const googleId = account.providerAccountId;
        const email = user.email!;

        // Check if user already exists with this Google ID
        let existingUser = await findUserByGoogleId(googleId);

        if (!existingUser) {
          // Check if user exists with this email (previously signed up with email OTP)
          existingUser = await getUserByEmail(email);

          if (existingUser) {
            // Link Google account to existing email user
            console.log('[NextAuth] Linking Google to existing user:', email);
            // TODO: Update user with google_id
            // This will be handled in the database functions
          } else {
            // Create new user with Google OAuth
            console.log('[NextAuth] Creating new user from Google:', email);
            existingUser = await createUserWithGoogle({
              googleId,
              email,
              name: user.name || email.split('@')[0],
              profilePicture: user.image || null,
            });
          }
        }

        // Update user object with database info
        user.id = existingUser.id;
        user.name = existingUser.name;
        user.email = existingUser.email;
        user.image = existingUser.profile_picture || user.image;
        (user as any).role = existingUser.role || 'student';
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'student';
        token.provider = account?.provider || 'email-otp';
      }

      // Session update (e.g., profile update)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/signup",
  },

  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year (same as current cookie)
  },

  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
