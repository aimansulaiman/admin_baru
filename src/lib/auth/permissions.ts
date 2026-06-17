import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  payment: ["get", "list", "create", "update", "delete"],
  marketing: ["get", "list", "create", "update", "delete"],
  crm: ["get", "list", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const visitor = ac.newRole({
  user: ["get", "list"],
  payment: ["get", "list"],
  marketing: ["get", "list"],
  crm: ["get", "list"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  payment: ["get", "list", "create", "update", "delete"],
  marketing: ["get", "list", "create", "update", "delete"],
  crm: ["get", "list", "create", "update", "delete"],
});

export const availableRoles = ["user", "visitor", "admin"] as const;
export type UserRole = (typeof availableRoles)[number];
