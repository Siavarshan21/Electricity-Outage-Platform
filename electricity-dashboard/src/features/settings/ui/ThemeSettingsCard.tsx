import React from "react";
import { useTranslation } from "react-i18next";
import { AppCard } from "@/shared/ui/card/AppCard";
import { useThemeStore } from "../model/themeStore";

export const ThemeSettingsCard: React.FC = () => {
  const { t } = useTranslation("settings");
  const { theme, setTheme } = useThemeStore();

  const themes = ["light", "dark", "system"] as const;

  return (
    <AppCard>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("theme.title")}
      </h3>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{t("theme.description")}</p>
      <div className="flex gap-3">
        {themes.map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              theme === themeOption
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {t(`theme.${themeOption}`)}
          </button>
        ))}
      </div>
    </AppCard>
  );
};
