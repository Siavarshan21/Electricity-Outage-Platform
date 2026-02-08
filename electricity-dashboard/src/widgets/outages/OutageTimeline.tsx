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

const statusColors: Record<string, string> = {
  active: "bg-red-500 shadow-red-500/50",
  investigating: "bg-amber-500 shadow-amber-500/50",
  scheduled: "bg-blue-500 shadow-blue-500/50",
  resolved: "bg-green-500 shadow-green-500/50",
};

const statusLineColors: Record<string, string> = {
  active: "from-red-500 to-red-300",
  investigating: "from-amber-500 to-amber-300",
  scheduled: "from-blue-500 to-blue-300",
  resolved: "from-green-500 to-green-300",
};

export const OutageTimeline: React.FC<OutageTimelineProps> = ({ events }) => {
  const { t } = useTranslation("outages");

  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        {t("timeline.title")}
      </h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-0 pl-8"
      >
        {/* Animated timeline line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-3 top-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-300 to-transparent dark:from-primary-400 dark:via-primary-600"
        />

        {events.map((event, index) => {
          const dotColor = statusColors[event.status] || "bg-gray-400";
          const isLast = index === events.length - 1;

          return (
            <motion.div
              key={event.id}
              variants={slideUp}
              className="relative pb-6"
            >
              {/* Connector dot with pulse */}
              <div className="absolute -left-5 top-3">
                <div
                  className={`h-3.5 w-3.5 rounded-full ${dotColor} shadow-lg ring-4 ring-white dark:ring-gray-900`}
                />
                {index === 0 && (
                  <div
                    className={`absolute inset-0 h-3.5 w-3.5 animate-ping rounded-full ${dotColor} opacity-40`}
                  />
                )}
              </div>

              {/* Event card */}
              <motion.div
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`ml-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 ${
                  index === 0
                    ? "ring-1 ring-primary-200 dark:ring-primary-800"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <OutageStatusBadge status={event.status} />
                    {index === 0 && (
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(event.timestamp)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {event.message}
                </p>

                {/* Time delta from previous event */}
                {index < events.length - 1 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {getTimeDelta(
                        event.timestamp,
                        events[index + 1]?.timestamp,
                      )}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

function getTimeDelta(current: string, previous: string | undefined): string {
  if (!previous) return "";
  const diff = Math.abs(
    new Date(current).getTime() - new Date(previous).getTime(),
  );
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m after previous`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m after previous`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h after previous`;
}
