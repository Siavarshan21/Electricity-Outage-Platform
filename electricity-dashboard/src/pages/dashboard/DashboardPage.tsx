import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { DashboardKpis } from "@/widgets/dashboard/DashboardKpis";
import { OutageMapPreview } from "@/widgets/dashboard/OutageMapPreview";
import { LiveAlertsPreview } from "@/widgets/dashboard/LiveAlertsPreview";
import { RegionHealthRanking } from "@/widgets/dashboard/RegionHealthRanking";
import { IranMap } from "@/widgets/regions/IranMap";

// Lazy load heavy 3D components for code splitting
const ThreeCanvasShell = lazy(() =>
  import("@/widgets/three/ThreeCanvasShell").then((m) => ({ default: m.ThreeCanvasShell })),
);
const ElectricityGlobe = lazy(() =>
  import("@/widgets/three/ElectricityGlobe").then((m) => ({ default: m.ElectricityGlobe })),
);
const EnergyFlowScene = lazy(() =>
  import("@/widgets/three/EnergyFlowScene").then((m) => ({ default: m.EnergyFlowScene })),
);
const LightningBoltScene = lazy(() =>
  import("@/widgets/three/LightningBoltScene").then((m) => ({ default: m.LightningBoltScene })),
);
const BabylonCanvas = lazy(() =>
  import("@/widgets/babylon/BabylonCanvas").then((m) => ({ default: m.BabylonCanvas })),
);

const Scene3DFallback = () => (
  <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" style={{ height: "200px" }}>
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading 3D...
    </div>
  </div>
);
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

      {/* 3D Globe - lazy loaded */}
      <motion.div variants={bounceIn} initial="hidden" animate="visible">
        <Suspense fallback={<Scene3DFallback />}>
          <ThreeCanvasShell height="250px" className="w-full">
            <ElectricityGlobe />
          </ThreeCanvasShell>
        </Suspense>
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
            <Suspense fallback={<Scene3DFallback />}>
              <ThreeCanvasShell height="200px" className="w-full">
                <EnergyFlowScene />
              </ThreeCanvasShell>
            </Suspense>
          </div>
        </motion.div>
        <motion.div variants={slideUp}>
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              {t("powerGrid3d")}
            </h3>
            <Suspense fallback={<Scene3DFallback />}>
              <BabylonCanvas height="200px" scene="powerGrid" className="w-full" />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightning Scene - lazy loaded */}
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <Suspense fallback={<Scene3DFallback />}>
          <ThreeCanvasShell height="220px" className="w-full">
            <LightningBoltScene />
          </ThreeCanvasShell>
        </Suspense>
      </motion.div>

      <RegionHealthRanking />
    </motion.div>
  );
};
