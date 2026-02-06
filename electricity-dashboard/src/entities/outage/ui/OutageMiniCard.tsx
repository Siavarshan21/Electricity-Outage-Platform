import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import { formatRelativeTime } from "@/shared/utils/date";
import type { Outage } from "../model/outage.types";
import { OUTAGE_STATUS_COLORS } from "../model/outage.constants";

interface OutageMiniCardProps {
  outage: Outage;
  onClick?: () => void;
}

export const OutageMiniCard: React.FC<OutageMiniCardProps> = ({ outage, onClick }) => {
  const { t } = useTranslation("outages");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {outage.title}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {outage.regionName} — {outage.city}
          </p>
        </div>
        <AppBadge
          variant={OUTAGE_STATUS_COLORS[outage.status] as "danger" | "success" | "warning" | "info"}
          dot
        >
          {t(`status.${outage.status}`)}
        </AppBadge>
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {formatRelativeTime(outage.startedAt)}
      </p>
    </motion.div>
  );
};
