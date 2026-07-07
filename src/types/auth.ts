import type { User } from "./user";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};