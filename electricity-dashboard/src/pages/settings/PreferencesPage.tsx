import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { AppCard } from "@/shared/ui/card/AppCard";
import { usePreferencesStore } from "@/features/settings/model/preferencesStore";
import { pageTransition } from "@/shared/config/motion";

export const PreferencesPage: React.FC = () => {
  const { t } = useTranslation("settings");
  const {
    notificationsEnabled,
    emailNotifications,
    autoRefreshInterval,
    setNotificationsEnabled,
    setEmailNotifications,
    setAutoRefreshInterval,
  } = usePreferencesStore();

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <Text variant="h1">{t("preferences.title")}</Text>
        <Text variant="body" className="mt-1">
          {t("preferences.subtitle")}
        </Text>
      </div>

      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("preferences.notifications")}
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t("preferences.enableNotifications")}
            </span>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t("preferences.emailNotifications")}
            </span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
          </label>
        </div>
      </AppCard>

      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("preferences.autoRefresh")}
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={10}
            max={120}
            step={10}
            value={autoRefreshInterval}
            onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-16 text-sm text-gray-700 dark:text-gray-300">
            {autoRefreshInterval}s
          </span>
        </div>
      </AppCard>
    </motion.div>
  );
};
