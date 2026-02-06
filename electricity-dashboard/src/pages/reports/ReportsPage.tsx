import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { ReportsKpis } from "@/widgets/reports/ReportsKpis";
import { ReportsCharts } from "@/widgets/reports/ReportsCharts";
import { ExportReportsButton } from "@/features/reports/ui/ExportReportsButton";
import { reportsApi } from "@/features/reports/api/reportsApi";
import { reportsQueryKeys } from "@/features/reports/api/reportsQueryKeys";
import { pageTransition } from "@/shared/config/motion";

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation("reports");

  const { data, isLoading, isError } = useQuery({
    queryKey: reportsQueryKeys.summary(),
    queryFn: () => reportsApi.getSummary(),
  });

  if (isError) {
    return <EmptyState title={t("error.title")} description={t("error.description")} />;
  }

  if (isLoading) return <PageSpinner />;
  if (!data) return null;

  const exportData = data.monthlyTrend.map((m) => ({
    month: m.month,
    outages: m.outages,
    resolved: m.resolved,
  }));

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h1">{t("title")}</Text>
          <Text variant="body" className="mt-1">
            {t("subtitle")}
          </Text>
        </div>
        <ExportReportsButton data={exportData} filename="outage-report" />
      </div>

      <ReportsKpis summary={data} />
      <ReportsCharts summary={data} />
    </motion.div>
  );
};
