import type { UserRole } from "@/entities/user/model/user.types";

export const ROLES: UserRole[] = ["admin", "operator", "viewer"];

export function isRole(value: string): value is UserRole {
  return ROLES.includes(value as UserRole);
}
