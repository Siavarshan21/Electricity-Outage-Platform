import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { AppButton } from "@/shared/ui/button/AppButton";
import { AppCard } from "@/shared/ui/card/AppCard";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { RegionStatusBadge } from "@/features/regions/ui/RegionStatusBadge";
import { ReliabilityScore } from "@/features/regions/ui/ReliabilityScore";
import { RegionOutageTrendChart } from "@/widgets/regions/RegionOutageTrendChart";
import { CityGrid } from "@/widgets/regions/CityGrid";
import { OutagesTable } from "@/widgets/outages/OutagesTable";
import { ThreeCanvasShell } from "@/widgets/three/ThreeCanvasShell";
import { EnergyFlowScene } from "@/widgets/three/EnergyFlowScene";
import { BabylonCanvas } from "@/widgets/babylon/BabylonCanvas";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import { formatNumber } from "@/shared/utils/formatters";
import { formatDuration } from "@/shared/utils/date";
import {
  pageTransition,
  staggerContainer,
  slideUp,
  bounceIn,
  popIn,
} from "@/shared/config/motion";

export const RegionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("regions");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: regionsQueryKeys.detail(id!),
    queryFn: () => regionsApi.getRegionById(id!),
    enabled: !!id,
  });

  if (isLoading) return <PageSpinner />;
  if (isError || !data) {
    return <EmptyState title={t("error.notFound")} description={t("error.notFoundDescription")} />;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <motion.div variants={bounceIn} initial="hidden" animate="visible">
          <Text variant="h1">{data.name}</Text>
          <Text variant="body" className="mt-1">
            {data.nameFA} — {data.code}
          </Text>
        </motion.div>
        <div className="flex items-center gap-3">
          <RegionStatusBadge status={data.status} />
          <AppButton variant="secondary" onClick={() => navigate(-1)}>
            {t("detail.back")}
          </AppButton>
        </div>
      </div>

      {/* Energy Flow 3D */}
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <ThreeCanvasShell height="180px" className="w-full">
          <EnergyFlowScene />
        </ThreeCanvasShell>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={popIn}>
          <AppCard className="flex flex-col items-center py-6">
            <ReliabilityScore score={data.reliabilityScore} size="lg" />
          </AppCard>
        </motion.div>
        <motion.div variants={popIn}>
          <AppCard>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("detail.customers")}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(data.totalCustomers)}
            </p>
          </AppCard>
        </motion.div>
        <motion.div variants={popIn}>
          <AppCard>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("detail.activeOutages")}</p>
            <motion.p
              className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400"
              animate={data.activeOutages > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {data.activeOutages}
            </motion.p>
          </AppCard>
        </motion.div>
        <motion.div variants={popIn}>
          <AppCard>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("detail.avgResolution")}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(data.avgResolutionTimeMinutes)}
            </p>
          </AppCard>
        </motion.div>
      </motion.div>

      {/* Babylon.js Transformer Scene */}
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <BabylonCanvas height="200px" scene="transformer" className="w-full" />
      </motion.div>

      {/* Cities Grid */}
      {data.cities && data.cities.length > 0 && (
        <motion.div variants={slideUp} initial="hidden" animate="visible">
          <CityGrid cities={data.cities} regionName={data.name} />
        </motion.div>
      )}

      <RegionOutageTrendChart outages={data.outages} />

      <div>
        <Text variant="h3" className="mb-4">
          {t("detail.outagesInRegion")}
        </Text>
        <OutagesTable data={data.outages} />
      </div>
    </motion.div>
  );
};
