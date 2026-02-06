import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { AppButton } from "@/shared/ui/button/AppButton";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { OutageSummaryCards } from "@/widgets/outages/OutageSummaryCards";
import { OutageTimeline } from "@/widgets/outages/OutageTimeline";
import { ThreeCanvasShell } from "@/widgets/three/ThreeCanvasShell";
import { OutageHeatScene } from "@/widgets/three/OutageHeatScene";
import { outagesApi } from "@/features/outages/api/outagesApi";
import { outagesQueryKeys } from "@/features/outages/api/outagesQueryKeys";
import { pageTransition } from "@/shared/config/motion";

export const OutageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("outages");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: outagesQueryKeys.detail(id!),
    queryFn: () => outagesApi.getOutageById(id!),
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
        <div>
          <Text variant="h1">{data.title}</Text>
          <Text variant="body" className="mt-1">
            {data.description}
          </Text>
        </div>
        <AppButton variant="secondary" onClick={() => navigate(-1)}>
          {t("detail.back")}
        </AppButton>
      </div>

      <ThreeCanvasShell height="200px" className="w-full">
        <OutageHeatScene />
      </ThreeCanvasShell>

      <OutageSummaryCards outage={data} />

      <OutageTimeline events={data.timeline} />
    </motion.div>
  );
};
