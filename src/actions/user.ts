"use server";

const demoUsers = [
  {
    id: "demo-user-1",
    name: "Demo Admin",
    email: "admin@example.com",
    emailVerified: true,
    role: "admin",
    createdAt: new Date().toISOString(),
    banned: false,
  },
  {
    id: "demo-user-2",
    name: "Demo User",
    email: "user@example.com",
    emailVerified: true,
    role: "user",
    createdAt: new Date().toISOString(),
    banned: false,
  },
];

export async function getUsers(search = "") {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return demoUsers;
  }

  return demoUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.id.toLowerCase().includes(normalizedSearch)
    );
  });
}

export async function makeAdmin() {
  return {
    success: true,
    message: "Demo mode: user role updated.",
  };
}

export async function banUser() {
  return {
    success: true,
    message: "Demo mode: user banned.",
  };
}

export async function unbanUser() {
  return {
    success: true,
    message: "Demo mode: user unbanned.",
  };
}

export async function logoutUser() {
  return {
    success: true,
    message: "Demo mode: user sessions revoked.",
  };
}

export async function impersonateUser() {
  return {
    success: true,
    message: "Demo mode: impersonation started.",
  };
}

export async function stopImpersonatingUser() {
  return {
    success: true,
    message: "Demo mode: impersonation stopped.",
  };
}

export async function updateUser(data: any) {
  return {
    ...data,
    success: true,
  };
}

export async function deleteUser(user: any) {
  return {
    ...user,
    success: true,
  };
}

export async function searchUser(email: string) {
  return demoUsers.find((user) => user.email === email) || null;
}