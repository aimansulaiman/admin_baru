import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// NextAuth.js used [...nextauth]; Better Auth mounts on [...all].
export const { GET, POST } = toNextJsHandler(auth);
