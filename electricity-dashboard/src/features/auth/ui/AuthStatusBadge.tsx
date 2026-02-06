import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import { useAuthStore } from "../model/authStore";

export const AuthStatusBadge: React.FC = () => {
  const { t } = useTranslation("common");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <AppBadge variant={isAuthenticated ? "success" : "default"} dot>
      {isAuthenticated ? t("auth.authenticated") : t("auth.unauthenticated")}
    </AppBadge>
  );
};
