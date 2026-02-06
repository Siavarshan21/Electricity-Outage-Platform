import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { AlertsFeed } from "@/widgets/alerts/AlertsFeed";
import { AlertDetailsDrawer } from "@/widgets/alerts/AlertDetailsDrawer";
import { alertsApi } from "@/features/alerts/api/alertsApi";
import { alertsQueryKeys } from "@/features/alerts/api/alertsQueryKeys";
import { useAlertsStore } from "@/features/alerts/model/alertsStore";
import type { Alert } from "@/entities/alert/model/alert.types";
import { pageTransition } from "@/shared/config/motion";

export const AlertsPage: React.FC = () => {
  const { t } = useTranslation("alerts");
  const { selectedSeverity, setSelectedSeverity } = useAlertsStore();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: alertsQueryKeys.list({
      page: 1,
      pageSize: 20,
      severity: selectedSeverity || undefined,
    }),
    queryFn: () =>
      alertsApi.getAlerts({
        page: 1,
        pageSize: 20,
        severity: selectedSeverity || undefined,
      }),
  });

  if (isError) {
    return <EmptyState title={t("error.title")} description={t("error.description")} />;
  }

  const selectClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300";

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
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value as typeof selectedSeverity)}
          className={selectClass}
        >
          <option value="">{t("filters.allSeverities")}</option>
          <option value="info">{t("severity.info")}</option>
          <option value="warning">{t("severity.warning")}</option>
          <option value="error">{t("severity.error")}</option>
          <option value="critical">{t("severity.critical")}</option>
        </select>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title={t("empty.title")} description={t("empty.description")} />
      ) : (
        <AlertsFeed alerts={data?.data ?? []} onAlertClick={setSelectedAlert} />
      )}

      <AlertDetailsDrawer
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </motion.div>
  );
};
