import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import {
  iranProvinces,
  waterBodies,
  IRAN_MAP_VIEWBOX,
  type IranProvincePath,
} from "@/shared/data/iranMapSvgData";
import type { Region } from "@/entities/region/model/region.types";

interface IranMapProps {
  regions: Region[];
}

const PROVINCE_COLORS: Record<string, string> = {
  TEH: "#e74c3c",
  ISF: "#7f8c8d",
  FAR: "#8b4513",
  KHR: "#d4a76a",
  EAZ: "#2c3e50",
  WAZ: "#c0392b",
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
  YZD: "#e67e22",
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

/** Compute approximate centroid of an SVG path using a hidden element */
function usePathCentroids(provinces: IranProvincePath[]) {
  const [centroids, setCentroids] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const result: Record<string, { x: number; y: number }> = {};
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    svg.appendChild(pathEl);

    for (const prov of provinces) {
      pathEl.setAttribute("d", prov.d);
      const bbox = pathEl.getBBox();
      result[prov.code] = {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
      };
    }

    svg.removeChild(pathEl);
    setCentroids(result);
  }, [provinces]);

  return { centroids, svgRef };
}

export const IranMap: React.FC<IranMapProps> = ({ regions }) => {
  const { t } = useTranslation("regions");
  const navigate = useNavigate();
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { centroids, svgRef } = usePathCentroids(iranProvinces);

  const regionByCode = useMemo(() => {
    const map = new Map<string, Region>();
    regions.forEach((r) => map.set(r.code, r));
    return map;
  }, [regions]);

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
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
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
      <div className="relative mx-auto" style={{ maxWidth: 700 }}>
        <svg
          ref={svgRef}
          viewBox={IRAN_MAP_VIEWBOX}
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))" }}
        >
          <defs>
            <filter id="provinceShadow">
              <feDropShadow
                dx="1"
                dy="1"
                stdDeviation="1.5"
                floodOpacity="0.25"
              />
            </filter>
            <filter id="provinceGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dark background */}
          <rect width="1200" height="1070.6" fill="#0f172a" rx="8" />

          {/* Water bodies (Caspian Sea, Persian Gulf) */}
          {waterBodies.map((wb) => (
            <path
              key={wb.id}
              d={wb.d}
              fill="#1a3a5c"
              stroke="#234e7a"
              strokeWidth="0.5"
              opacity="0.6"
              className="pointer-events-none"
            />
          ))}

          {/* Province polygons */}
          {iranProvinces.map((prov) => {
            const region = regionByCode.get(prov.code);
            const isHovered = hoveredCode === prov.code;
            const baseColor = PROVINCE_COLORS[prov.code] || "#6b7280";
            const overlay = region
              ? getStatusOverlay(region.status)
              : "transparent";
            const centroid = centroids[prov.code];

            return (
              <g key={prov.code}>
                {/* Province fill */}
                <path
                  d={prov.d}
                  fill={baseColor}
                  stroke="#1e293b"
                  strokeWidth={isHovered ? 3 : 1.2}
                  className="cursor-pointer"
                  style={{
                    transition:
                      "stroke-width 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
                    opacity: isHovered ? 1 : 0.85,
                    filter: isHovered
                      ? "url(#provinceGlow)"
                      : "url(#provinceShadow)",
                  }}
                  onMouseEnter={(e) => handleMouseEnter(prov.code, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredCode(null)}
                  onClick={() => handleClick(prov.code)}
                />

                {/* Status overlay for critical/offline */}
                {overlay !== "transparent" && (
                  <path
                    d={prov.d}
                    fill={overlay}
                    className="pointer-events-none"
                  />
                )}

                {/* Province label */}
                {centroid && (
                  <text
                    x={centroid.x}
                    y={centroid.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={isHovered ? "12" : "9"}
                    fontWeight={isHovered ? "bold" : "600"}
                    className="pointer-events-none select-none"
                    style={{
                      textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                      transition: "font-size 0.2s ease",
                    }}
                  >
                    {prov.name.length > 12 ? prov.code : prov.name}
                  </text>
                )}

                {/* Active outage badge */}
                {region &&
                  region.activeOutages > 0 &&
                  centroid && (
                    <g>
                      <circle
                        cx={centroid.x + 25}
                        cy={centroid.y - 16}
                        r="10"
                        fill="#ef4444"
                        stroke="#0f172a"
                        strokeWidth="2"
                      >
                        <animate
                          attributeName="r"
                          values="9;11;9"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <text
                        x={centroid.x + 25}
                        y={centroid.y - 16}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize="9"
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

          {/* Power grid lines connecting nearby province centers */}
          {Object.keys(centroids).length > 0 &&
            iranProvinces.map((p1, i) =>
              iranProvinces.slice(i + 1).map((p2) => {
                const c1 = centroids[p1.code];
                const c2 = centroids[p2.code];
                if (!c1 || !c2) return null;
                const dx = c1.x - c2.x;
                const dy = c1.y - c2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 120) return null;
                return (
                  <line
                    key={`grid-${p1.code}-${p2.code}`}
                    x1={c1.x}
                    y1={c1.y}
                    x2={c2.x}
                    y2={c2.y}
                    stroke="#3b82f6"
                    strokeOpacity="0.08"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    className="pointer-events-none"
                  />
                );
              }),
            )}

          {/* Animated energy particles */}
          {Object.keys(centroids).length > 0 &&
            iranProvinces.slice(0, 8).map((p, i) => {
              const next = iranProvinces[(i + 1) % iranProvinces.length];
              const c1 = centroids[p.code];
              const c2 = centroids[next.code];
              if (!c1 || !c2) return null;
              return (
                <circle key={`pulse-${i}`} r="3" fill="#60a5fa" opacity="0.7">
                  <animateMotion
                    dur={`${4 + i * 0.7}s`}
                    repeatCount="indefinite"
                    path={`M ${c1.x} ${c1.y} L ${c2.x} ${c2.y}`}
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
                left: Math.min(tooltipPos.x + 16, 500),
                top: tooltipPos.y - 60,
              }}
            >
              <p className="text-sm font-bold">{hoveredRegion.name}</p>
              <p className="text-gray-400">{hoveredRegion.nameFA}</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("detail.customers")}:
                  </span>
                  <span className="font-medium">
                    {hoveredRegion.totalCustomers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("detail.activeOutages")}:
                  </span>
                  <span
                    className={
                      hoveredRegion.activeOutages > 0
                        ? "font-bold text-red-400"
                        : "text-green-400"
                    }
                  >
                    {hoveredRegion.activeOutages}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t("reliability")}:</span>
                  <span className="font-medium">
                    {hoveredRegion.reliabilityScore.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-primary-400">
                {t("clickToView")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppCard>
  );
};
