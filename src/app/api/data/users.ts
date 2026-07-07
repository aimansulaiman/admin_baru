import type { User } from "@/types/user";

export let users: any[] = [
  {
    id: "1",
    name: "Demo Admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Ali Ahmad",
    email: "ali@example.com",
    role: "manager",
    status: "active",
  },
  {
    id: "3",
    name: "Siti Aminah",
    email: "siti@example.com",
    role: "user",
    status: "inactive",
  },
];

export function getAllUsers() {
  return users;
}

export function createNewUser(data: any) {
  const newUser: any = {
    id: Date.now().toString(),
    ...data,
  };

  users = [newUser, ...users];

  return newUser;
}

export function updateUserById(id: string, data: any) {
  const updatedUser: any = {
    id,
    ...data,
  };

  const existingUser = users.find((user: any) => user.id === id);

  if (!existingUser) {
    users = [updatedUser, ...users];
    return updatedUser;
  }

  users = users.map((user: any) => {
    if (user.id === id) {
      return updatedUser;
    }

    return user;
  });

  return updatedUser;
}

export function deleteUserById(id: string) {
  const existingUser = users.find((user: any) => user.id === id);

  if (!existingUser) {
    return {
      id,
      name: "Deleted User",
      email: "deleted@example.com",
      role: "user",
      status: "inactive",
    };
  }

  users = users.filter((user: any) => user.id !== id);

  return existingUser;
}