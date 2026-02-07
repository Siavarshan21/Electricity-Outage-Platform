import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { RegionsGrid } from "@/widgets/regions/RegionsGrid";
import { RegionReliabilityChart } from "@/widgets/regions/RegionReliabilityChart";
import { IranMap } from "@/widgets/regions/IranMap";
import { ThreeCanvasShell } from "@/widgets/three/ThreeCanvasShell";
import { PowerLineScene } from "@/widgets/three/PowerLineScene";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import { useRegionsStore } from "@/features/regions/model/regionsStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { pageTransition, slideUp, electricFlicker } from "@/shared/config/motion";

export const RegionsPage: React.FC = () => {
  const { t } = useTranslation("regions");
  const { search, setSearch } = useRegionsStore();
  const debouncedSearch = useDebounce(search);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");

  const { data, isLoading, isError } = useQuery({
    queryKey: regionsQueryKeys.list({ page: 1, pageSize: 31, search: debouncedSearch }),
    queryFn: () => regionsApi.getRegions({ page: 1, pageSize: 31, search: debouncedSearch }),
  });

  if (isError) {
    return <EmptyState title={t("error.title")} description={t("error.description")} />;
  }

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
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              } rounded-l-lg`}
            >
              {t("mapView")}
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              } rounded-r-lg`}
            >
              {t("gridView")}
            </button>
          </div>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
      </motion.div>

      {/* Power Line 3D Scene */}
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <ThreeCanvasShell height="180px" className="w-full">
          <PowerLineScene />
        </ThreeCanvasShell>
      </motion.div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title={t("empty.title")} description={t("empty.description")} />
      ) : (
        <>
          {viewMode === "map" ? (
            <motion.div variants={slideUp} initial="hidden" animate="visible">
              <IranMap regions={data?.data ?? []} />
            </motion.div>
          ) : (
            <RegionsGrid regions={data?.data ?? []} />
          )}
          <RegionReliabilityChart regions={data?.data ?? []} />
        </>
      )}
    </motion.div>
  );
};
