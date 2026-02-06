import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import type { OutageStatus } from "@/entities/outage/model/outage.types";
import { OUTAGE_STATUS_COLORS } from "@/entities/outage/model/outage.constants";

interface OutageStatusBadgeProps {
  status: OutageStatus;
}

export const OutageStatusBadge: React.FC<OutageStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation("outages");

  return (
    <AppBadge
      variant={OUTAGE_STATUS_COLORS[status] as "danger" | "success" | "warning" | "info"}
      dot
    >
      {t(`status.${status}`)}
    </AppBadge>
  );
};
