export const statement = {
  user: ["get", "list", "create", "update", "delete", "set-role", "ban", "impersonate"],
  session: ["revoke"],
  payment: ["get", "list", "create", "update", "delete"],
  marketing: ["get", "list", "create", "update", "delete"],
  crm: ["get", "list", "create", "update", "delete"],
} as const;

export const availableRoles = ["user", "visitor", "admin"] as const;

export type UserRole = (typeof availableRoles)[number];

export const ac = {
  newRole: (role: unknown) => role,
};

export const visitor = {};
export const admin = {};