import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppButton } from "@/shared/ui/button/AppButton";
import { ROUTE_PATHS } from "@/shared/config/routes";
import { pageTransition } from "@/shared/config/motion";

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation("errors");
  const navigate = useNavigate();

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {t("notFound.title")}
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{t("notFound.description")}</p>
      <AppButton className="mt-6" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
        {t("notFound.goHome")}
      </AppButton>
    </motion.div>
  );
};
