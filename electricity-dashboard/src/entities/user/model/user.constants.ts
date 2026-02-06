import type { UserRole } from "./user.types";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "roles.admin",
  operator: "roles.operator",
  viewer: "roles.viewer",
};
