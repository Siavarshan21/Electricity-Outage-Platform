import React from "react";
import { useTranslation } from "react-i18next";

export const PageSpinner: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("loading")}</p>
      </div>
    </div>
  );
};
