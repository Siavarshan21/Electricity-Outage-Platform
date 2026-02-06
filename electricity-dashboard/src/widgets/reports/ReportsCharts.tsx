import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import type { ReportsSummary } from "@/features/reports/api/reportsSchemas";

interface ReportsChartsProps {
  summary: ReportsSummary;
}

export const ReportsCharts: React.FC<ReportsChartsProps> = ({ summary }) => {
  const { t } = useTranslation("reports");

  const maxOutages = Math.max(...summary.monthlyTrend.map((m) => m.outages), 1);
  const maxSeverity = Math.max(...summary.severityDistribution.map((s) => s.count), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.monthlyTrend")}
        </h3>
        <div className="flex items-end gap-1" style={{ height: "200px" }}>
          {summary.monthlyTrend.map((month) => (
            <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(month.outages / maxOutages) * 160}px` }}
                transition={{ duration: 0.8 }}
                className="w-full rounded-t bg-primary-400 dark:bg-primary-600"
              />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{month.month}</span>
            </div>
          ))}
        </div>
      </AppCard>

      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.severityDistribution")}
        </h3>
        <div className="space-y-3">
          {summary.severityDistribution.map((item) => (
            <div key={item.severity} className="flex items-center gap-3">
              <span className="w-20 text-sm capitalize text-gray-700 dark:text-gray-300">
                {t(`charts.severity.${item.severity}`, { defaultValue: item.severity })}
              </span>
              <div className="flex-1">
                <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxSeverity) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      item.severity === "critical"
                        ? "bg-danger-500"
                        : item.severity === "high"
                          ? "bg-warning-500"
                          : item.severity === "medium"
                            ? "bg-primary-500"
                            : "bg-success-500"
                    }`}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </AppCard>
    </div>
  );
};
