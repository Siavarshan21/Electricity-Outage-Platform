import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { RegionStatusBadge } from "@/features/regions/ui/RegionStatusBadge";
import { ReliabilityScore } from "@/features/regions/ui/ReliabilityScore";
import { formatNumber } from "@/shared/utils/formatters";
import type { Region } from "@/entities/region/model/region.types";
import { staggerContainer, slideUp } from "@/shared/config/motion";

interface RegionsGridProps {
  regions: Region[];
}

export const RegionsGrid: React.FC<RegionsGridProps> = ({ regions }) => {
  const { t } = useTranslation("regions");
  const navigate = useNavigate();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {regions.map((region) => (
        <motion.div key={region.id} variants={slideUp}>
          <AppCard hover className="cursor-pointer" padding="md">
            <div onClick={() => navigate(`/regions/${region.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {region.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{region.code}</p>
                </div>
                <RegionStatusBadge status={region.status} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <ReliabilityScore score={region.reliabilityScore} size="sm" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(region.totalCustomers)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("customers")}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {region.activeOutages} {t("activeOutages")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {region.totalOutages} {t("totalOutages")}
                </span>
              </div>
            </div>
          </AppCard>
        </motion.div>
      ))}
    </motion.div>
  );
};
