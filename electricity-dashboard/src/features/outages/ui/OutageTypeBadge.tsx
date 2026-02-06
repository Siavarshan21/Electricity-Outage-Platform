import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import type { OutageType } from "@/entities/outage/model/outage.types";
import { OUTAGE_TYPE_COLORS } from "@/entities/outage/model/outage.constants";

interface OutageTypeBadgeProps {
  type: OutageType;
}

export const OutageTypeBadge: React.FC<OutageTypeBadgeProps> = ({ type }) => {
  const { t } = useTranslation("outages");

  return (
    <AppBadge variant={OUTAGE_TYPE_COLORS[type] as "primary" | "danger" | "warning"}>
      {t(`type.${type}`)}
    </AppBadge>
  );
};
