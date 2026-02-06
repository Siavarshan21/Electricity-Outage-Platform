import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { Skeleton } from "@/shared/ui/loader/Skeleton";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import { RegionStatusBadge } from "@/features/regions/ui/RegionStatusBadge";
import { formatPercentage } from "@/shared/utils/formatters";
import { slideUp } from "@/shared/config/motion";

export const RegionHealthRanking: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading } = useQuery({
    queryKey: regionsQueryKeys.list({ page: 1, pageSize: 10 }),
    queryFn: () => regionsApi.getRegions({ page: 1, pageSize: 10 }),
  });

  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible">
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("regionHealth")}
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={40} variant="rectangular" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {data?.data
              .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
              .map((region, index) => (
                <div
                  key={region.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {region.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {region.activeOutages} {t("activeOutages")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {formatPercentage(region.reliabilityScore)}
                    </span>
                    <RegionStatusBadge status={region.status} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </AppCard>
    </motion.div>
  );
};
