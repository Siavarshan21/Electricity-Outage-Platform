import type { UserRole } from "@/entities/user/model/user.types";

export type Permission =
  | "outages:read"
  | "outages:write"
  | "regions:read"
  | "regions:write"
  | "alerts:read"
  | "alerts:write"
  | "reports:read"
  | "reports:export"
  | "settings:read"
  | "settings:write";

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "outages:read",
    "outages:write",
    "regions:read",
    "regions:write",
    "alerts:read",
    "alerts:write",
    "reports:read",
    "reports:export",
    "settings:read",
    "settings:write",
  ],
  operator: [
    "outages:read",
    "outages:write",
    "regions:read",
    "alerts:read",
    "alerts:write",
    "reports:read",
    "settings:read",
  ],
  viewer: ["outages:read", "regions:read", "alerts:read", "reports:read", "settings:read"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
