import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Text } from "@/shared/ui/typography/Text";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { EmptyState } from "@/shared/ui/emptyState/EmptyState";
import { OutagesTable } from "@/widgets/outages/OutagesTable";
import { OutagesFilters } from "@/widgets/outages/OutagesFilters";
import { outagesApi } from "@/features/outages/api/outagesApi";
import { outagesQueryKeys } from "@/features/outages/api/outagesQueryKeys";
import { useOutagesFiltersStore } from "@/features/outages/model/outagesFiltersStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { pageTransition } from "@/shared/config/motion";

export const OutagesPage: React.FC = () => {
  const { t } = useTranslation("outages");
  const filters = useOutagesFiltersStore();
  const debouncedSearch = useDebounce(filters.search);

  const { data, isLoading, isError } = useQuery({
    queryKey: outagesQueryKeys.list({
      page: 1,
      pageSize: 25,
      search: debouncedSearch,
      status: filters.status || undefined,
      type: filters.type || undefined,
      severity: filters.severity || undefined,
      city: filters.city || undefined,
      regionName: filters.regionName || undefined,
    }),
    queryFn: () =>
      outagesApi.getOutages({
        page: 1,
        pageSize: 25,
        search: debouncedSearch,
        status: filters.status || undefined,
        type: filters.type || undefined,
        severity: filters.severity || undefined,
      }),
  });

  if (isError) {
    return (
      <EmptyState
        title={t("error.title")}
        description={t("error.description")}
      />
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div>
        <Text variant="h1">{t("title")}</Text>
        <Text variant="body" className="mt-1">
          {t("subtitle")}
        </Text>
      </div>

      <OutagesFilters />

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <EmptyState title={t("empty.title")} description={t("empty.description")} />
      ) : (
        <OutagesTable data={data?.data ?? []} />
      )}
    </motion.div>
  );
};
