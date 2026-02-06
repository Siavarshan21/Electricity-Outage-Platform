import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { OutageStatusBadge } from "@/features/outages/ui/OutageStatusBadge";
import { OutageTypeBadge } from "@/features/outages/ui/OutageTypeBadge";
import { formatDateTime, formatDuration } from "@/shared/utils/date";
import { formatNumber } from "@/shared/utils/formatters";
import type { Outage } from "@/entities/outage/model/outage.types";
import { staggerContainer, slideUp } from "@/shared/config/motion";

interface OutageSummaryCardsProps {
  outage: Outage;
}

export const OutageSummaryCards: React.FC<OutageSummaryCardsProps> = ({ outage }) => {
  const { t } = useTranslation("outages");

  const details = [
    { label: t("detail.status"), value: <OutageStatusBadge status={outage.status} /> },
    { label: t("detail.type"), value: <OutageTypeBadge type={outage.type} /> },
    { label: t("detail.region"), value: outage.regionName },
    { label: t("detail.city"), value: outage.city },
    { label: t("detail.affected"), value: formatNumber(outage.affectedCustomers) },
    { label: t("detail.duration"), value: formatDuration(outage.durationMinutes) },
    { label: t("detail.startedAt"), value: formatDateTime(outage.startedAt) },
    {
      label: t("detail.eta"),
      value: outage.estimatedRestorationAt
        ? formatDateTime(outage.estimatedRestorationAt)
        : t("detail.unknown"),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {details.map((item) => (
        <motion.div key={item.label} variants={slideUp}>
          <AppCard>
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {item.value}
            </div>
          </AppCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
