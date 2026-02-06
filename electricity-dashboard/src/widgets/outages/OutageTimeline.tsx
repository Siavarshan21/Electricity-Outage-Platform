import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { OutageStatusBadge } from "@/features/outages/ui/OutageStatusBadge";
import { formatDateTime } from "@/shared/utils/date";
import type { OutageTimelineEvent } from "@/entities/outage/model/outage.types";
import { staggerContainer, slideUp } from "@/shared/config/motion";

interface OutageTimelineProps {
  events: OutageTimelineEvent[];
}

export const OutageTimeline: React.FC<OutageTimelineProps> = ({ events }) => {
  const { t } = useTranslation("outages");

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("timeline.title")}
      </h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-4 pl-6"
      >
        <div className="absolute bottom-0 left-2.5 top-0 w-px bg-gray-200 dark:bg-gray-700" />
        {events.map((event) => (
          <motion.div key={event.id} variants={slideUp} className="relative">
            <div className="absolute -left-3.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-primary-500 dark:border-gray-800" />
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <OutageStatusBadge status={event.status} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTime(event.timestamp)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{event.message}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
