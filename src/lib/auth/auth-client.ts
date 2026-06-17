import {
  adminClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { userAc } from "better-auth/plugins/admin/access";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { ac, admin, visitor } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
    adminClient({
      ac,
      roles: {
        admin,
        visitor,
        user: userAc,
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
