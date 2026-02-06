import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { AppTable } from "@/shared/ui/table/AppTable";
import { OutageStatusBadge } from "@/features/outages/ui/OutageStatusBadge";
import { OutageTypeBadge } from "@/features/outages/ui/OutageTypeBadge";
import { OutageDurationPill } from "@/features/outages/ui/OutageDurationPill";
import { OutageImpactChip } from "@/features/outages/ui/OutageImpactChip";
import { formatDateTime } from "@/shared/utils/date";
import type { Outage } from "@/entities/outage/model/outage.types";

interface OutagesTableProps {
  data: Outage[];
  loading?: boolean;
}

const columnHelper = createColumnHelper<Outage>();

export const OutagesTable: React.FC<OutagesTableProps> = ({ data, loading }) => {
  const { t } = useTranslation("outages");
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("title", {
      header: t("table.title"),
      cell: (info) => (
        <button
          onClick={() => navigate(`/outages/${info.row.original.id}`)}
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor("status", {
      header: t("table.status"),
      cell: (info) => <OutageStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("type", {
      header: t("table.type"),
      cell: (info) => <OutageTypeBadge type={info.getValue()} />,
    }),
    columnHelper.accessor("regionName", {
      header: t("table.region"),
    }),
    columnHelper.accessor("city", {
      header: t("table.city"),
    }),
    columnHelper.accessor("affectedCustomers", {
      header: t("table.affected"),
      cell: (info) => <OutageImpactChip affectedCustomers={info.getValue()} />,
    }),
    columnHelper.accessor("durationMinutes", {
      header: t("table.duration"),
      cell: (info) => <OutageDurationPill durationMinutes={info.getValue()} />,
    }),
    columnHelper.accessor("startedAt", {
      header: t("table.startedAt"),
      cell: (info) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDateTime(info.getValue())}
        </span>
      ),
    }),
  ];

  return <AppTable data={data} columns={columns as ColumnDef<Outage, unknown>[]} loading={loading} />;
};
