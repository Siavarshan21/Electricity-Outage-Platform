import React from "react";
import { useTranslation } from "react-i18next";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import type { RegionStatus } from "@/entities/region/model/region.types";
import { REGION_STATUS_COLORS } from "@/entities/region/model/region.constants";

interface RegionStatusBadgeProps {
  status: RegionStatus;
}

export const RegionStatusBadge: React.FC<RegionStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation("regions");

  return (
    <AppBadge
      variant={REGION_STATUS_COLORS[status] as "success" | "warning" | "danger" | "default"}
      dot
    >
      {t(`status.${status}`)}
    </AppBadge>
  );
};
