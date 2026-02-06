import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import { formatPercentage } from "@/shared/utils/formatters";
import type { Region } from "../model/region.types";
import { REGION_STATUS_COLORS } from "../model/region.constants";

interface RegionMiniCardProps {
  region: Region;
  onClick?: () => void;
}

export const RegionMiniCard: React.FC<RegionMiniCardProps> = ({ region, onClick }) => {
  const { t } = useTranslation("regions");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{region.name}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{region.code}</p>
        </div>
        <AppBadge
          variant={REGION_STATUS_COLORS[region.status] as "success" | "warning" | "danger" | "default"}
          dot
        >
          {t(`status.${region.status}`)}
        </AppBadge>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {t("reliability")}: {formatPercentage(region.reliabilityScore)}
        </span>
        <span>
          {region.activeOutages} {t("activeOutages")}
        </span>
      </div>
    </motion.div>
  );
};
