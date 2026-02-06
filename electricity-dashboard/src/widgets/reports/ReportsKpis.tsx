import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { formatNumber, formatPercentage } from "@/shared/utils/formatters";
import { formatDuration } from "@/shared/utils/date";
import type { ReportsSummary } from "@/features/reports/api/reportsSchemas";
import { staggerContainer, slideUp } from "@/shared/config/motion";

interface ReportsKpisProps {
  summary: ReportsSummary;
}

export const ReportsKpis: React.FC<ReportsKpisProps> = ({ summary }) => {
  const { t } = useTranslation("reports");

  const kpis = [
    { label: t("kpi.totalOutages"), value: summary.totalOutages.toString() },
    { label: t("kpi.activeOutages"), value: summary.activeOutages.toString() },
    { label: t("kpi.resolvedOutages"), value: summary.resolvedOutages.toString() },
    { label: t("kpi.affectedCustomers"), value: formatNumber(summary.totalAffectedCustomers) },
    { label: t("kpi.avgResolution"), value: formatDuration(summary.avgResolutionTime) },
    { label: t("kpi.totalAlerts"), value: summary.totalAlerts.toString() },
    { label: t("kpi.criticalAlerts"), value: summary.criticalAlerts.toString() },
    { label: t("kpi.reliability"), value: formatPercentage(summary.avgReliabilityScore) },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
    >
      {kpis.map((kpi) => (
        <motion.div key={kpi.label} variants={slideUp}>
          <AppCard>
            <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
          </AppCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
