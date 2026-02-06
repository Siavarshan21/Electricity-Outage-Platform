import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { RegionsGrid } from "@/widgets/regions/RegionsGrid";
import { RegionReliabilityChart } from "@/widgets/regions/RegionReliabilityChart";
import { regionsApi } from "@/features/regions/api/regionsApi";
import { regionsQueryKeys } from "@/features/regions/api/regionsQueryKeys";
import { useRegionsStore } from "@/features/regions/model/regionsStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { pageTransition } from "@/shared/config/motion";

export const RegionsPage: React.FC = () => {
  const { t } = useTranslation("regions");
  const { search, setSearch } = useRegionsStore();
  const debouncedSearch = useDebounce(search);

  const { data, isLoading, isError } = useQuery({
    queryKey: regionsQueryKeys.list({ page: 1, pageSize: 10, search: debouncedSearch }),
    queryFn: () => regionsApi.getRegions({ page: 1, pageSize: 10, search: debouncedSearch }),
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
      <div className="flex items-center justify-between">
        <div>
          <Text variant="h1">{t("title")}</Text>
          <Text variant="body" className="mt-1">
            {t("subtitle")}
          </Text>
        </div>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        />
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title={t("empty.title")} description={t("empty.description")} />
      ) : (
        <>
          <RegionsGrid regions={data?.data ?? []} />
          <RegionReliabilityChart regions={data?.data ?? []} />
        </>
      )}
    </motion.div>
  );
};
