import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore";
import { hasPermission, type Permission } from "@/features/auth/model/permissions";
import { ROUTE_PATHS } from "@/shared/config/routes";

interface RequirePermissionProps {
  children: React.ReactNode;
  permission: Permission;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ children, permission }) => {
  const user = useAuthStore((s) => s.user);

  if (!user || !hasPermission(user.role, permission)) {
    return <Navigate to={ROUTE_PATHS.FORBIDDEN} replace />;
  }

  return <>{children}</>;
};
