import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, emailOTP } from "better-auth/plugins";
import { userAc } from "better-auth/plugins/admin/access";
import prisma from "../db/prisma";
import {
  sendResetPasswordEmail,
  sendVerificationEmail as sendVerificationEmailTemplate,
} from "../email";
import { ac, admin, visitor } from "./permissions";

// if (!process.env.BETTER_AUTH_SECRET) {
//   throw new Error("BETTER_AUTH_SECRET is not set.");
// }

// const adminEmails = (process.env.ADMIN_EMAILS ?? "")
//   .split(",")
//   .map((email) => email.trim().toLowerCase())
//   .filter(Boolean);

const appUrl = process.env.BETTER_AUTH_URL;

// if (!appUrl) {
//   throw new Error(
//     "BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL must be set in production.",
//   );
// }

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.SECRET,
  baseURL: appUrl,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      await sendResetPasswordEmail({
        name: user.name ?? "there",
        email: user.email,
        link: `${appUrl}/auth/reset-password?token=${encodeURIComponent(token)}`,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  user: {
    // These additional fields replace the NextAuth session augmentation and
    // keep the existing profile UI working without retyping every consumer.
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
      coverImage: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      otpLength: 6,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }, ctx) => {
        if (type !== "email-verification") {
          return;
        }

        await sendVerificationEmailTemplate({
          name: "there",
          email,
          code: otp,
          link: `${appUrl}/auth/verify-email?email=${encodeURIComponent(email)}`,
        });
      },
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        visitor,
        user: userAc,
      },
    }),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession["user"];
