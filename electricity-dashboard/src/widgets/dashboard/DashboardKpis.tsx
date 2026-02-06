import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { Skeleton } from "@/shared/ui/loader/Skeleton";
import { reportsApi } from "@/features/reports/api/reportsApi";
import { reportsQueryKeys } from "@/features/reports/api/reportsQueryKeys";
import { formatCompactNumber, formatPercentage } from "@/shared/utils/formatters";
import { formatDuration } from "@/shared/utils/date";
import { staggerContainer, slideUp } from "@/shared/config/motion";

export const DashboardKpis: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useQuery({
    queryKey: reportsQueryKeys.summary(),
    queryFn: () => reportsApi.getSummary(),
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
      value: data.activeOutages.toString(),
      color: "text-danger-600 dark:text-danger-400",
    },
    {
      label: t("kpi.affectedCustomers"),
      value: formatCompactNumber(data.totalAffectedCustomers),
      color: "text-warning-600 dark:text-warning-400",
    },
    {
      label: t("kpi.avgResolutionTime"),
      value: formatDuration(data.avgResolutionTime),
      color: "text-primary-600 dark:text-primary-400",
    },
    {
      label: t("kpi.reliability"),
      value: formatPercentage(data.avgReliabilityScore),
      color: "text-success-600 dark:text-success-400",
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
          <AppCard hover>
            <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
            <p className={`mt-1 text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </AppCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
