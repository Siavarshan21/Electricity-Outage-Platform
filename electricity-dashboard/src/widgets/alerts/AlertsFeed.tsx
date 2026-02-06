import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AlertSeverityBadge } from "@/features/alerts/ui/AlertSeverityBadge";
import { AlertSourceBadge } from "@/features/alerts/ui/AlertSourceBadge";
import { formatRelativeTime } from "@/shared/utils/date";
import type { Alert } from "@/entities/alert/model/alert.types";
import { slideUp } from "@/shared/config/motion";

interface AlertsFeedProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({ alerts, onAlertClick }) => {
  const { t } = useTranslation("alerts");

  if (alerts.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">{t("noAlerts")}</div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            onClick={() => onAlertClick?.(alert)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </h4>
                  {!alert.acknowledged && (
                    <span className="h-2 w-2 rounded-full bg-danger-500" />
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.message}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <AlertSeverityBadge severity={alert.severity} />
                <AlertSourceBadge source={alert.source} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{alert.regionName}</span>
              <span>{formatRelativeTime(alert.createdAt)}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
