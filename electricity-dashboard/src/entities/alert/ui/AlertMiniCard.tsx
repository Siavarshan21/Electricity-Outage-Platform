import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppBadge } from "@/shared/ui/badge/AppBadge";
import { formatRelativeTime } from "@/shared/utils/date";
import type { Alert } from "../model/alert.types";
import { ALERT_SEVERITY_COLORS } from "../model/alert.constants";

interface AlertMiniCardProps {
  alert: Alert;
  onClick?: () => void;
}

export const AlertMiniCard: React.FC<AlertMiniCardProps> = ({ alert, onClick }) => {
  const { t } = useTranslation("alerts");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {alert.title}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.regionName}</p>
        </div>
        <AppBadge
          variant={ALERT_SEVERITY_COLORS[alert.severity] as "info" | "warning" | "danger"}
          dot
        >
          {t(`severity.${alert.severity}`)}
        </AppBadge>
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {formatRelativeTime(alert.createdAt)}
      </p>
    </motion.div>
  );
};
