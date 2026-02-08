import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { Skeleton } from "@/shared/ui/loader/Skeleton";
import { reportsApi } from "@/features/reports/api/reportsApi";
import { reportsQueryKeys } from "@/features/reports/api/reportsQueryKeys";
import { AnimatedCounter } from "@/shared/ui/counter/AnimatedCounter";
import { formatDuration } from "@/shared/utils/date";
import { staggerContainer, slideUp } from "@/shared/config/motion";

export const DashboardKpis: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useQuery({
    queryKey: reportsQueryKeys.summary(),
    queryFn: () => reportsApi.getSummary(),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AppCard key={i}>
            <Skeleton height={20} className="mb-2" />
            <Skeleton height={32} width="60%" />
          </AppCard>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    {
      label: t("kpi.activeOutages"),
      numericValue: data.activeOutages,
      suffix: "",
      color: "text-danger-600 dark:text-danger-400",
      bgColor: "bg-danger-50 dark:bg-danger-900/20",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      label: t("kpi.affectedCustomers"),
      numericValue: data.totalAffectedCustomers,
      suffix: "",
      color: "text-warning-600 dark:text-warning-400",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      label: t("kpi.avgResolutionTime"),
      displayValue: formatDuration(data.avgResolutionTime),
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: t("kpi.reliability"),
      numericValue: data.avgReliabilityScore,
      suffix: "%",
      color: "text-success-600 dark:text-success-400",
      bgColor: "bg-success-50 dark:bg-success-900/20",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {kpis.map((kpi) => (
        <motion.div key={kpi.label} variants={slideUp}>
          <AppCard hover gradient>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {kpi.label}
              </p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bgColor}`}
              >
                <svg
                  className={`h-4 w-4 ${kpi.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={kpi.icon}
                  />
                </svg>
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>
              {"numericValue" in kpi && kpi.numericValue !== undefined ? (
                <AnimatedCounter
                  value={kpi.numericValue}
                  suffix={kpi.suffix}
                />
              ) : (
                <span>{kpi.displayValue}</span>
              )}
            </div>
          </AppCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
