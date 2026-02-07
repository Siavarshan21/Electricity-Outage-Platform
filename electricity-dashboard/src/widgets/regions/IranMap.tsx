import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { geoMercator, geoPath } from "d3-geo";
import { AppCard } from "@/shared/ui/card/AppCard";
import {
  iranProvincesGeoJSON,
  type IranProvinceFeature,
} from "@/shared/data/iranProvincesGeo";
import type { Region } from "@/entities/region/model/region.types";

interface IranMapProps {
  regions: Region[];
}

const MAP_WIDTH = 700;
const MAP_HEIGHT = 750;

const PROVINCE_COLORS: Record<string, string> = {
  TEH: "#e74c3c",
  ISF: "#7f8c8d",
  FAR: "#8b4513",
  KHR: "#d4a76a",
  EAZ: "#2c3e50",
  WAZ: "#e74c3c",
  KHZ: "#27ae60",
  KER: "#5d6d3f",
  ALB: "#f39c12",
  QAZ: "#8b8b00",
  GIL: "#3498db",
  MAZ: "#5dade2",
  MRK: "#e8a0bf",
  HRM: "#2ecc71",
  LOR: "#27ae60",
  SBL: "#2c3e50",
  KRD: "#c0392b",
  HAM: "#f5cba7",
  KSH: "#8e44ad",
  SKH: "#a0522d",
  NKH: "#7d9f85",
  YZD: "#e74c3c",
  QOM: "#d5a6bd",
  ZAN: "#2ecc71",
  SEM: "#e8a0bf",
  ARD: "#16a085",
  BSH: "#f1948a",
  GOL: "#a9dfbf",
  ILM: "#17a589",
  CHB: "#f4d03f",
  KBA: "#d35400",
};

const getStatusOverlay = (status: string): string => {
  switch (status) {
    case "critical":
      return "rgba(239, 68, 68, 0.4)";
    case "offline":
      return "rgba(107, 114, 128, 0.5)";
    default:
      return "transparent";
  }
};

export const IranMap: React.FC<IranMapProps> = ({ regions }) => {
  const { t } = useTranslation("regions");
  const navigate = useNavigate();
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Create a map from region code to region data
  const regionByCode = useMemo(() => {
    const map = new Map<string, Region>();
    regions.forEach((r) => map.set(r.code, r));
    return map;
  }, [regions]);

  // Create d3-geo projection and path generator
  const { projection, pathGenerator } = useMemo(() => {
    const proj = geoMercator()
      .center([53.5, 32.5])
      .scale(2800)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

    const pg = geoPath().projection(proj);
    return { projection: proj, pathGenerator: pg };
  }, []);

  // Pre-compute province paths and centroids
  const provinceRenderData = useMemo(() => {
    return iranProvincesGeoJSON.features.map((feature) => {
      const path = pathGenerator(feature as unknown as GeoJSON.Feature) || "";
      const centroid = pathGenerator.centroid(feature as unknown as GeoJSON.Feature);
      return {
        feature,
        path,
        centroid,
        code: feature.properties.code,
        name: feature.properties.name,
        nameFA: feature.properties.nameFA,
      };
    });
  }, [pathGenerator]);

  const hoveredRegion = useMemo(() => {
    if (!hoveredCode) return null;
    return regionByCode.get(hoveredCode) ?? null;
  }, [hoveredCode, regionByCode]);

  const handleMouseEnter = useCallback(
    (code: string, e: React.MouseEvent<SVGPathElement>) => {
      setHoveredCode(code);
      const svg = (e.target as SVGElement).ownerSVGElement;
      if (svg) {
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTooltipPos({ x, y });
      }
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      const svg = (e.target as SVGElement).ownerSVGElement;
      if (svg) {
        const rect = svg.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [],
  );

  const handleClick = useCallback(
    (code: string) => {
      const region = regionByCode.get(code);
      if (region) {
        navigate(`/regions/${region.id}`);
      }
    },
    [regionByCode, navigate],
  );

  return (
    <AppCard className="relative overflow-hidden">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("iranMap")}
      </h3>
      <div className="relative mx-auto" style={{ maxWidth: MAP_WIDTH }}>
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))" }}
        >
          <defs>
            <filter id="provinceShadow">
              <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.25" />
            </filter>
            <filter id="provinceGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0f172a" rx="8" />

          {/* Province polygons */}
          {provinceRenderData.map((prov) => {
            const region = regionByCode.get(prov.code);
            const isHovered = hoveredCode === prov.code;
            const baseColor = PROVINCE_COLORS[prov.code] || "#6b7280";
            const overlay = region ? getStatusOverlay(region.status) : "transparent";

            return (
              <g key={prov.code}>
                {/* Province fill */}
                <path
                  d={prov.path}
                  fill={baseColor}
                  stroke="#1e293b"
                  strokeWidth={isHovered ? 2.5 : 1}
                  className="cursor-pointer"
                  style={{
                    transition: "stroke-width 0.2s ease, opacity 0.2s ease",
                    opacity: isHovered ? 1 : 0.85,
                    filter: isHovered ? "url(#provinceGlow)" : "url(#provinceShadow)",
                  }}
                  onMouseEnter={(e) => handleMouseEnter(prov.code, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredCode(null)}
                  onClick={() => handleClick(prov.code)}
                />

                {/* Status overlay for critical/offline */}
                {overlay !== "transparent" && (
                  <path
                    d={prov.path}
                    fill={overlay}
                    className="pointer-events-none"
                  />
                )}

                {/* Province label */}
                {prov.centroid[0] && prov.centroid[1] && (
                  <text
                    x={prov.centroid[0]}
                    y={prov.centroid[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={isHovered ? "9" : "7"}
                    fontWeight={isHovered ? "bold" : "600"}
                    className="pointer-events-none select-none"
                    style={{
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                      transition: "font-size 0.2s ease",
                    }}
                  >
                    {prov.name.length > 12 ? prov.code : prov.name.toUpperCase()}
                  </text>
                )}

                {/* Active outage badge */}
                {region && region.activeOutages > 0 && prov.centroid[0] && prov.centroid[1] && (
                  <g>
                    <circle
                      cx={prov.centroid[0] + 18}
                      cy={prov.centroid[1] - 12}
                      r="8"
                      fill="#ef4444"
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    >
                      <animate
                        attributeName="r"
                        values="7;9;7"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={prov.centroid[0] + 18}
                      y={prov.centroid[1] - 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="7"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {region.activeOutages}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Power grid lines connecting province centers */}
          {provinceRenderData.map((p1, i) =>
            provinceRenderData.slice(i + 1).map((p2, j) => {
              if (!p1.centroid[0] || !p2.centroid[0]) return null;
              const dx = p1.centroid[0] - p2.centroid[0];
              const dy = p1.centroid[1] - p2.centroid[1];
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 80) return null;
              return (
                <line
                  key={`grid-${i}-${j}`}
                  x1={p1.centroid[0]}
                  y1={p1.centroid[1]}
                  x2={p2.centroid[0]}
                  y2={p2.centroid[1]}
                  stroke="#3b82f6"
                  strokeOpacity="0.08"
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                  className="pointer-events-none"
                />
              );
            }),
          )}

          {/* Animated energy particles */}
          {provinceRenderData.slice(0, 8).map((p, i) => {
            const next = provinceRenderData[(i + 1) % provinceRenderData.length];
            if (!p.centroid[0] || !next.centroid[0]) return null;
            return (
              <circle key={`pulse-${i}`} r="2" fill="#60a5fa" opacity="0.7">
                <animateMotion
                  dur={`${4 + i * 0.7}s`}
                  repeatCount="indefinite"
                  path={`M ${p.centroid[0]} ${p.centroid[1]} L ${next.centroid[0]} ${next.centroid[1]}`}
                />
              </circle>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-20 min-w-[180px] rounded-lg border border-gray-600 bg-gray-900/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-sm"
              style={{
                left: Math.min(tooltipPos.x + 16, MAP_WIDTH - 200),
                top: tooltipPos.y - 60,
              }}
            >
              <p className="text-sm font-bold">{hoveredRegion.name}</p>
              <p className="text-gray-400">{hoveredRegion.nameFA}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("detail.customers")}:</span>
                  <span className="font-medium">{hoveredRegion.totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("detail.activeOutages")}:</span>
                  <span className={hoveredRegion.activeOutages > 0 ? "font-bold text-red-400" : "text-green-400"}>
                    {hoveredRegion.activeOutages}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("reliability")}:</span>
                  <span className="font-medium">{hoveredRegion.reliabilityScore.toFixed(1)}%</span>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-primary-400">{t("clickToView")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppCard>
  );
};
