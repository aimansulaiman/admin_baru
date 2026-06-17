import { auth } from "@/lib/auth";
import { statement } from "@/lib/auth/permissions";
import { headers } from "next/headers";

type Statement = typeof statement;
type Resource = keyof Statement;
type ActionsFor<R extends Resource> = Statement[R][number];

type PermissionArgs<R extends Resource> = Record<R, ActionsFor<R>[]>;

export default async function hasPermission<R extends Resource>(
  permissions: PermissionArgs<R>,
): Promise<boolean> {
  const permission = await auth.api.userHasPermission({
    body: {
      permissions,
    },
    headers: await headers(),
  });

  return permission.success;
}
