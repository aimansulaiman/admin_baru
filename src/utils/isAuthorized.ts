import { headers } from "next/headers";
import { auth } from "../lib/auth/auth";

// export const isAuthorized = async () => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   return session?.user;
// };

export const isAuthorized = true
