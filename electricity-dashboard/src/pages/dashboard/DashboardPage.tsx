import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { DashboardKpis } from "@/widgets/dashboard/DashboardKpis";
import { OutageMapPreview } from "@/widgets/dashboard/OutageMapPreview";
import { LiveAlertsPreview } from "@/widgets/dashboard/LiveAlertsPreview";
import { RegionHealthRanking } from "@/widgets/dashboard/RegionHealthRanking";
import { ThreeCanvasShell } from "@/widgets/three/ThreeCanvasShell";
import { ElectricityGlobe } from "@/widgets/three/ElectricityGlobe";
import { pageTransition } from "@/shared/config/motion";

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation("dashboard");

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
      </div>

      <ThreeCanvasShell height="250px" className="w-full">
        <ElectricityGlobe />
      </ThreeCanvasShell>

      <DashboardKpis />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OutageMapPreview />
        <LiveAlertsPreview />
      </div>

      <RegionHealthRanking />
    </motion.div>
  );
};
