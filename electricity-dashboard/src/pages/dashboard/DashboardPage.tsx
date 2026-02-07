import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { DashboardKpis } from "@/widgets/dashboard/DashboardKpis";
import { OutageMapPreview } from "@/widgets/dashboard/OutageMapPreview";
import { LiveAlertsPreview } from "@/widgets/dashboard/LiveAlertsPreview";
import { RegionHealthRanking } from "@/widgets/dashboard/RegionHealthRanking";
import { ThreeCanvasShell } from "@/widgets/three/ThreeCanvasShell";
import { ElectricityGlobe } from "@/widgets/three/ElectricityGlobe";
import { EnergyFlowScene } from "@/widgets/three/EnergyFlowScene";
import { LightningBoltScene } from "@/widgets/three/LightningBoltScene";
import { BabylonCanvas } from "@/widgets/babylon/BabylonCanvas";
import { IranMap } from "@/widgets/regions/IranMap";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import {
  pageTransition,
  staggerContainer,
  slideUp,
  electricFlicker,
  bounceIn,
} from "@/shared/config/motion";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation("dashboard");

  const { data: regionsData } = useQuery({
    queryKey: regionsQueryKeys.list({ page: 1, pageSize: 31 }),
    queryFn: () => regionsApi.getRegions({ page: 1, pageSize: 31 }),
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <motion.div
        variants={electricFlicker}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <Text variant="h1">{t("title")}</Text>
          <Text variant="body" className="mt-1">
            {t("subtitle")}
          </Text>
        </div>
      </motion.div>

      {/* 3D Globe */}
      <motion.div variants={bounceIn} initial="hidden" animate="visible">
        <ThreeCanvasShell height="250px" className="w-full">
          <ElectricityGlobe />
        </ThreeCanvasShell>
      </motion.div>

      <DashboardKpis />

      {/* Iran Map */}
      {regionsData?.data && regionsData.data.length > 0 && (
        <motion.div variants={slideUp} initial="hidden" animate="visible">
          <IranMap regions={regionsData.data} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OutageMapPreview />
        <LiveAlertsPreview />
      </div>

      {/* 3D Visualizations Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <motion.div variants={slideUp}>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              {t("energyFlow")}
            </h3>
            <ThreeCanvasShell height="200px" className="w-full">
              <EnergyFlowScene />
            </ThreeCanvasShell>
          </div>
        </motion.div>
        <motion.div variants={slideUp}>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              {t("powerGrid3d")}
            </h3>
            <BabylonCanvas height="200px" scene="powerGrid" className="w-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Lightning Scene */}
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <ThreeCanvasShell height="220px" className="w-full">
          <LightningBoltScene />
        </ThreeCanvasShell>
      </motion.div>

      <RegionHealthRanking />
    </motion.div>
  );
};
