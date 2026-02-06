import React from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ui/button/AppButton";

interface ExportReportsButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
}

export const ExportReportsButton: React.FC<ExportReportsButtonProps> = ({
  data,
  filename = "report",
}) => {
  const { t } = useTranslation("reports");

  const handleExport = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppButton variant="secondary" onClick={handleExport}>
      {t("exportCsv")}
    </AppButton>
  );
};
