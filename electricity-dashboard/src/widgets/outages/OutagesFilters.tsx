import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppButton } from "@/shared/ui/button/AppButton";
import { useOutagesFiltersStore } from "@/features/outages/model/outagesFiltersStore";
import { slideUp } from "@/shared/config/motion";

export const OutagesFilters: React.FC = () => {
  const { t } = useTranslation("outages");
  const { search, status, type, severity, setSearch, setStatus, setType, setSeverity, resetFilters } =
    useOutagesFiltersStore();

  const selectClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300";

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-3"
    >
      <input
        type="text"
        placeholder={t("filters.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${selectClass} w-64`}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={selectClass}>
        <option value="">{t("filters.allStatuses")}</option>
        <option value="active">{t("status.active")}</option>
        <option value="resolved">{t("status.resolved")}</option>
        <option value="scheduled">{t("status.scheduled")}</option>
        <option value="investigating">{t("status.investigating")}</option>
      </select>
      <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={selectClass}>
        <option value="">{t("filters.allTypes")}</option>
        <option value="planned">{t("type.planned")}</option>
        <option value="unplanned">{t("type.unplanned")}</option>
        <option value="emergency">{t("type.emergency")}</option>
        <option value="maintenance">{t("type.maintenance")}</option>
      </select>
      <select value={severity} onChange={(e) => setSeverity(e.target.value as typeof severity)} className={selectClass}>
        <option value="">{t("filters.allSeverities")}</option>
        <option value="low">{t("severity.low")}</option>
        <option value="medium">{t("severity.medium")}</option>
        <option value="high">{t("severity.high")}</option>
        <option value="critical">{t("severity.critical")}</option>
      </select>
      <AppButton variant="ghost" size="sm" onClick={resetFilters}>
        {t("filters.reset")}
      </AppButton>
    </motion.div>
  );
};
