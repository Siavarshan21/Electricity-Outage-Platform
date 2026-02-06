import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import type { Outage } from "@/entities/outage/model/outage.types";

interface RegionOutageTrendChartProps {
  outages: Outage[];
}

export const RegionOutageTrendChart: React.FC<RegionOutageTrendChartProps> = ({ outages }) => {
  const { t } = useTranslation("regions");

  const statusCounts = outages.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <AppCard>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("outageTrend")}
      </h3>
      <div className="flex items-end gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(count / maxCount) * 120}px` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`w-full rounded-t-md ${
                status === "active"
                  ? "bg-danger-400"
                  : status === "resolved"
                    ? "bg-success-400"
                    : status === "scheduled"
                      ? "bg-primary-400"
                      : "bg-warning-400"
              }`}
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {t(`outageStatus.${status}`, { defaultValue: status })}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
          </div>
        ))}
      </div>
    </AppCard>
  );
};
