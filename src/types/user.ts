export type User = {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  email: string | null;

  loyalty_client_id: number | null;
  client_name: string | null;
  client_domain_name: string | null;

  created_at: string;
  updated_at: string;
};

export type UserListMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type UserListResponse = {
  success: boolean;
  data: User[];
  meta: UserListMeta;
};

export type UserResponse = {
  success: boolean;
  message?: string;
  data: User;
};

export type VerifyCreateUserUnlockInput = {
  password: string;
};

export type VerifyCreateUserUnlockResponse = {
  success: boolean;
  message: string;
};

export type CreateUserInput = {
  first_name: string;
  last_name: string;
  email: string;

  password: string;
  password_confirmation: string;

  admin_password: string;
};

export type UpdateUserInput = {
  first_name?: string;
  last_name?: string;
  email?: string;

  password?: string;
  password_confirmation?: string;
};

export type DeleteUserResponse = {
  success: boolean;
  message: string;
  id: number | string;
};