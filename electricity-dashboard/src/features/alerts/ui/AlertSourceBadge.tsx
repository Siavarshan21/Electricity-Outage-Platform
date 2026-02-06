import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import type { AlertSource } from "@/entities/alert/model/alert.types";
import { ALERT_SOURCE_COLORS } from "@/entities/alert/model/alert.constants";

interface AlertSourceBadgeProps {
  source: AlertSource;
}

export const AlertSourceBadge: React.FC<AlertSourceBadgeProps> = ({ source }) => {
  const { t } = useTranslation("alerts");

  return (
    <AppBadge variant={ALERT_SOURCE_COLORS[source] as "primary" | "info" | "default" | "success"}>
      {t(`source.${source}`)}
    </AppBadge>
  );
};
