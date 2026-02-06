import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ROUTE_PATHS } from "@/shared/config/routes";
import { pageTransition } from "@/shared/config/motion";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.login({ email, password });
      setAuth(result.user, result.token);
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch {
      setError(t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {t("auth.welcomeTitle")}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t("auth.welcomeSubtitle")}</p>
        </div>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </motion.div>
  );
};
