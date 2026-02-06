import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { ThemeSettingsCard } from "@/features/settings/ui/ThemeSettingsCard";
import { LanguageSettingsCard } from "@/features/settings/ui/LanguageSettingsCard";
import { pageTransition } from "@/shared/config/motion";

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation("settings");

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <Text variant="h1">{t("title")}</Text>
        <Text variant="body" className="mt-1">
          {t("subtitle")}
        </Text>
      </div>

      <ThemeSettingsCard />
      <LanguageSettingsCard />
    </motion.div>
  );
};
