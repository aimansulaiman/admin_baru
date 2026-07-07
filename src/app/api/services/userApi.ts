import type { User } from "@/types/user";
import { apiRequest } from "./setup";

type UsersResponse = {
  success: boolean;
  data: User[];
};

type UserResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type CreateUserInput = {
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive";
};

export type UpdateUserInput = CreateUserInput;

export async function getUsers(): Promise<User[]> {
  const result = await apiRequest<UsersResponse>("/api/users");

  return result.data;
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const result = await apiRequest<UserResponse>("/api/users", {
    method: "POST",
    headers: {

    "Content-Type": "application/json",

  },
    body: JSON.stringify(data),
  });

  return result.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<User> {
  const result = await apiRequest<UserResponse>(`/api/users/${id}`, {
    method: "PUT",
    headers: {

    "Content-Type": "application/json",

  },
    body: JSON.stringify(data),
  });

  return result.data;
}

export async function deleteUser(id: string): Promise<User> {
  const result = await apiRequest<UserResponse>(`/api/users/${id}`, {
    method: "DELETE",
  });

  return result.data;
}