import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import type { Region } from "@/entities/region/model/region.types";
import { formatPercentage } from "@/shared/utils/formatters";

interface RegionReliabilityChartProps {
  regions: Region[];
}

export const RegionReliabilityChart: React.FC<RegionReliabilityChartProps> = ({ regions }) => {
  const { t } = useTranslation("regions");

  const sorted = [...regions].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  return (
    <AppCard>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("reliabilityChart")}
      </h3>
      <div className="space-y-3">
        {sorted.map((region) => (
          <div key={region.id} className="flex items-center gap-3">
            <span className="w-32 text-sm text-gray-700 dark:text-gray-300">{region.name}</span>
            <div className="flex-1">
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${region.reliabilityScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    region.reliabilityScore >= 99
                      ? "bg-success-500"
                      : region.reliabilityScore >= 95
                        ? "bg-warning-500"
                        : "bg-danger-500"
                  }`}
                />
              </div>
            </div>
            <span className="w-16 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatPercentage(region.reliabilityScore)}
            </span>
          </div>
        ))}
      </div>
    </AppCard>
  );
};
