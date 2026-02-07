import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import { formatNumber } from "@/shared/utils/formatters";
import type { City } from "@/entities/region/model/region.types";
import { staggerContainer, slideUp } from "@/shared/config/motion";

interface CityGridProps {
  cities: City[];
  regionName: string;
}

const getOutageColor = (outages: number): string => {
  if (outages === 0) return "text-green-500";
  if (outages <= 1) return "text-yellow-500";
  return "text-red-500";
};

export const CityGrid: React.FC<CityGridProps> = ({ cities, regionName }) => {
  const { t } = useTranslation("regions");

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("citiesIn", { region: regionName })}
      </h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cities.map((city, index) => (
          <motion.div key={city.name} variants={slideUp} custom={index}>
            <AppCard hover className="relative overflow-hidden" padding="md">
              {/* Animated power indicator */}
              <div className="absolute right-0 top-0 h-1 w-full">
                <motion.div
                  className={`h-full ${city.activeOutages === 0 ? "bg-green-500" : city.activeOutages <= 1 ? "bg-yellow-500" : "bg-red-500"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                />
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    {city.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{city.nameFA}</p>
                </div>
                <motion.div
                  className="flex items-center gap-1"
                  animate={city.activeOutages > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className={`h-5 w-5 ${getOutageColor(city.activeOutages)}`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                  </svg>
                  <span className={`text-sm font-bold ${getOutageColor(city.activeOutages)}`}>
                    {city.activeOutages}
                  </span>
                </motion.div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("population")}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(city.population)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("coordinates")}
                  </p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
                    {city.coordinates.lat.toFixed(2)}, {city.coordinates.lng.toFixed(2)}
                  </p>
                </div>
              </div>
            </AppCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
