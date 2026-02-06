import React from "react";
import { useTranslation } from "react-i18next";
import { AppCard } from "@/shared/ui/card/AppCard";
import { SUPPORTED_LANGUAGES } from "@/shared/config/i18n";

export const LanguageSettingsCard: React.FC = () => {
  const { t, i18n } = useTranslation("settings");

  return (
    <AppCard>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("language.title")}
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {t("language.description")}
      </p>
      <div className="flex gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              i18n.language === lang.code
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </AppCard>
  );
};
