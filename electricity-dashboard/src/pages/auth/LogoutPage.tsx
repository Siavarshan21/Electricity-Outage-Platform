import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ROUTE_PATHS } from "@/shared/config/routes";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";

export const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    clearAuth();
    navigate(ROUTE_PATHS.LOGIN, { replace: true });
  }, [clearAuth, navigate]);

  return <PageSpinner />;
};
