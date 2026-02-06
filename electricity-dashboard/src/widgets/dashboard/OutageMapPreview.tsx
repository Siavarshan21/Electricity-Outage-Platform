import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { Skeleton } from "@/shared/ui/loader/Skeleton";
import { outagesApi } from "@/features/outages/api/outagesApi";
import { outagesQueryKeys } from "@/features/outages/api/outagesQueryKeys";
import { OutageStatusBadge } from "@/features/outages/ui/OutageStatusBadge";
import { slideUp } from "@/shared/config/motion";

export const OutageMapPreview: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useQuery({
    queryKey: outagesQueryKeys.list({ page: 1, pageSize: 5, status: "active" }),
    queryFn: () => outagesApi.getOutages({ page: 1, pageSize: 5, status: "active" }),
  });

  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible">
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("activeOutagesMap")}
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={48} variant="rectangular" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data?.data.map((outage) => (
              <div
                key={outage.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {outage.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {outage.regionName} — {outage.city}
                  </p>
                </div>
                <OutageStatusBadge status={outage.status} />
              </div>
            ))}
            {data?.data.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">{t("noActiveOutages")}</p>
            )}
          </div>
        )}
      </AppCard>
    </motion.div>
  );
};
