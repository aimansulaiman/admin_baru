"use server";

import { ManageTeamUser } from "@/app/(site)/(with-layout)/manage-team/_components/user-action-dropdown";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import hasPermission from "@/utils/hasPermission";
import { isAuthorized } from "@/utils/isAuthorized";
import { headers } from "next/headers";

export async function getUsers(search = ""): Promise<ManageTeamUser[]> {
  const currentUser = await isAuthorized();
  const normalizedSearch = search.trim();

  const res = await prisma.user.findMany({
    where: normalizedSearch
      ? {
          OR: [
            {
              id: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentEmail = currentUser?.email?.toLowerCase();

  return res
    .filter((user) => {
      const email = user.email.toLowerCase();
      return email !== currentEmail;
    })
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role as ManageTeamUser["role"],
      createdAt: user.createdAt.toISOString(),
      banned: user.banned as boolean,
    }));
}

export async function makeAdmin({ userId }: { userId: string }) {
  try {
    const permission = await hasPermission({
      user: ["set-role"],
    });

    if (!permission) {
      throw new Error("You don't have permission to make a user admin");
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: "admin",
      },
    });

    return {
      success: true,
      message: "User has been promoted as admin successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while making the user admin");
  }
}

export async function banUser({ userId }: { userId: string }) {
  try {
    const permission = await hasPermission({
      user: ["ban"],
    });

    if (!permission) {
      throw new Error("You don't have permission to ban a user");
    }

    await auth.api.banUser({
      body: {
        userId,
        banExpiresIn: 60 * 5, // 5 minutes
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "User has been banned successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while banning the user");
  }
}

export async function unbanUser({ userId }: { userId: string }) {
  try {
    const permission = await hasPermission({
      user: ["ban"],
    });

    if (!permission) {
      throw new Error("You don't have permission to unban a user");
    }

    await auth.api.banUser({
      body: {
        userId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "User has been unbanned successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while unbanning the user");
  }
}

export async function logoutUser({ userId }: { userId: string }) {
  try {
    const permission = await hasPermission({
      session: ["revoke"],
    });

    if (!permission) {
      throw new Error("You don't have permission to logout a user");
    }

    await auth.api.revokeUserSessions({
      body: {
        userId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "User has been logged out of all devices successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while logging out the user");
  }
}

export async function impersonateUser({ userId }: { userId: string }) {
  try {
    const permission = await hasPermission({
      user: ["impersonate"],
    });

    if (!permission) {
      throw new Error("You don't have permission to impersonate a user");
    }

    await auth.api.impersonateUser({
      body: {
        userId,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Started impersonating the user successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while impersonating the user");
  }
}

export async function stopImpersonatingUser() {
  try {
    await auth.api.stopImpersonating({
      headers: await headers(),
    });

    return {
      success: true,
      message: "Stopped impersonating the user successfully",
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An error occurred while stopping impersonating the user");
  }
}

export async function updateUser(data: any) {
  const { email } = data;
  return await prisma.user.update({
    where: {
      email: email.toLowerCase(),
    },
    data: {
      email: email.toLowerCase(),
      ...data,
    },
  });
}

export async function deleteUser(user: any) {
  if (user?.email?.includes("demo-")) {
    return new Error("Can't delete demo user");
  }

  if (!user) {
    return new Error("User not found");
  }

  return await prisma.user.delete({
    where: {
      email: user?.email.toLowerCase() as string,
    },
  });
}

export async function searchUser(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
}
