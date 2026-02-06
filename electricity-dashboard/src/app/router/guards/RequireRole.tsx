import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore";
import type { UserRole } from "@/entities/user/model/user.types";
import { ROUTE_PATHS } from "@/shared/config/routes";

interface RequireRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, roles }) => {
  const user = useAuthStore((s) => s.user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to={ROUTE_PATHS.FORBIDDEN} replace />;
  }

  return <>{children}</>;
};
