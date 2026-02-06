import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { Skeleton } from "@/shared/ui/loader/Skeleton";
import { alertsApi } from "@/features/alerts/api/alertsApi";
import { alertsQueryKeys } from "@/features/alerts/api/alertsQueryKeys";
import { AlertSeverityBadge } from "@/features/alerts/ui/AlertSeverityBadge";
import { formatRelativeTime } from "@/shared/utils/date";
import { slideUp } from "@/shared/config/motion";

export const LiveAlertsPreview: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useQuery({
    queryKey: alertsQueryKeys.list({ page: 1, pageSize: 5 }),
    queryFn: () => alertsApi.getAlerts({ page: 1, pageSize: 5 }),
  });

  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible">
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("liveAlerts")}
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={48} variant="rectangular" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data?.data.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(alert.createdAt)}
                  </p>
                </div>
                <AlertSeverityBadge severity={alert.severity} />
              </div>
            ))}
          </div>
        )}
      </AppCard>
    </motion.div>
  );
};
