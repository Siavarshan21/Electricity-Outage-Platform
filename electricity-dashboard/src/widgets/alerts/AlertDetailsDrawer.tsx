import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AlertSeverityBadge } from "@/features/alerts/ui/AlertSeverityBadge";
import { AlertSourceBadge } from "@/features/alerts/ui/AlertSourceBadge";
import { formatDateTime } from "@/shared/utils/date";
import type { Alert } from "@/entities/alert/model/alert.types";

interface AlertDetailsDrawerProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertDetailsDrawer: React.FC<AlertDetailsDrawerProps> = ({
  alert,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("alerts");

  return (
    <AnimatePresence>
      {isOpen && alert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-96 overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("details.title")}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {alert.title}
                </h3>
                <div className="mt-2 flex gap-2">
                  <AlertSeverityBadge severity={alert.severity} />
                  <AlertSourceBadge source={alert.source} />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <p className="text-sm text-gray-700 dark:text-gray-300">{alert.message}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("details.region")}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.regionName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("details.acknowledged")}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.acknowledged ? t("details.yes") : t("details.no")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t("details.createdAt")}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDateTime(alert.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
