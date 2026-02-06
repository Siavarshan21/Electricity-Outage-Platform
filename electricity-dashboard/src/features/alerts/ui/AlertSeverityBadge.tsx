import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import type { AlertSeverity } from "@/entities/alert/model/alert.types";
import { ALERT_SEVERITY_COLORS } from "@/entities/alert/model/alert.constants";

interface AlertSeverityBadgeProps {
  severity: AlertSeverity;
}

export const AlertSeverityBadge: React.FC<AlertSeverityBadgeProps> = ({ severity }) => {
  const { t } = useTranslation("alerts");

  return (
    <AppBadge
      variant={ALERT_SEVERITY_COLORS[severity] as "info" | "warning" | "danger"}
      dot
    >
      {t(`severity.${severity}`)}
    </AppBadge>
  );
};
