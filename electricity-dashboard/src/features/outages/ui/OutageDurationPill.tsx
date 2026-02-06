import React from "react";
import { useTranslation } from "react-i18next";
import { formatDuration } from "@/shared/utils/date";

interface OutageDurationPillProps {
  durationMinutes: number;
}

export const OutageDurationPill: React.FC<OutageDurationPillProps> = ({ durationMinutes }) => {
  const { t } = useTranslation("outages");

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      title={t("duration")}
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formatDuration(durationMinutes)}
    </span>
  );
};
