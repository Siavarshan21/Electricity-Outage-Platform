import React from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "@/shared/lib/clsx";
import { formatPercentage } from "@/shared/utils/formatters";

interface ReliabilityScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 99) return "text-success-600 dark:text-success-400";
  if (score >= 95) return "text-warning-600 dark:text-warning-400";
  return "text-danger-600 dark:text-danger-400";
}

export const ReliabilityScore: React.FC<ReliabilityScoreProps> = ({ score, size = "md" }) => {
  const { t } = useTranslation("regions");

  const sizeStyles = {
    sm: "text-lg font-semibold",
    md: "text-2xl font-bold",
    lg: "text-4xl font-bold",
  };

  return (
    <div className="flex flex-col items-center">
      <span className={clsx(sizeStyles[size], getScoreColor(score))}>
        {formatPercentage(score)}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{t("reliability")}</span>
    </div>
  );
};
