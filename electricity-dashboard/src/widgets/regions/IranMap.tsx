import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { AppCard } from "@/shared/ui/card/AppCard";
import type { Region } from "@/entities/region/model/region.types";

interface IranMapProps {
  regions: Region[];
}

interface ProvinceShape {
  code: string;
  name: string;
  cx: number;
  cy: number;
  path: string;
}

const IRAN_MAP_WIDTH = 600;
const IRAN_MAP_HEIGHT = 700;

function latLngToXY(lat: number, lng: number): { x: number; y: number } {
  const minLat = 25;
  const maxLat = 40;
  const minLng = 44;
  const maxLng = 63.5;
  const x = ((lng - minLng) / (maxLng - minLng)) * IRAN_MAP_WIDTH;
  const y = ((maxLat - lat) / (maxLat - minLat)) * IRAN_MAP_HEIGHT;
  return { x, y };
}

function generateProvincePath(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  const sides = 6 + Math.floor(Math.random() * 3);
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const jitter = 0.75 + Math.random() * 0.5;
    const r = size * jitter;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    points.push(`${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return points.join(" ") + " Z";
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "healthy":
      return "#22c55e";
    case "degraded":
      return "#f59e0b";
    case "critical":
      return "#ef4444";
    case "offline":
      return "#6b7280";
    default:
      return "#3b82f6";
  }
};

const getStatusGlow = (status: string): string => {
  switch (status) {
    case "healthy":
      return "#22c55e40";
    case "degraded":
      return "#f59e0b40";
    case "critical":
      return "#ef444440";
    case "offline":
      return "#6b728040";
    default:
      return "#3b82f640";
  }
};

export const IranMap: React.FC<IranMapProps> = ({ regions }) => {
  const { t } = useTranslation("regions");
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const provinceShapes: ProvinceShape[] = useMemo(() => {
    return regions.map((region) => {
      const { x, y } = latLngToXY(region.coordinates.lat, region.coordinates.lng);
      const size = 28 + (region.totalCustomers / 500000) * 12;
      return {
        code: region.code,
        name: region.name,
        cx: x,
        cy: y,
        path: generateProvincePath(x, y, size),
      };
    });
  }, [regions]);

  const hoveredRegionData = regions.find((r) => r.id === hoveredRegion);

  return (
    <AppCard className="relative overflow-hidden">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {t("iranMap")}
      </h3>
      <div className="relative w-full" style={{ aspectRatio: `${IRAN_MAP_WIDTH}/${IRAN_MAP_HEIGHT}` }}>
        <svg
          viewBox={`0 0 ${IRAN_MAP_WIDTH} ${IRAN_MAP_HEIGHT}`}
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0.15))" }}
        >
          <defs>
            <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.6" />
            </radialGradient>
            {regions.map((region) => (
              <filter key={`glow-${region.id}`} id={`glow-${region.id}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          <rect width={IRAN_MAP_WIDTH} height={IRAN_MAP_HEIGHT} fill="url(#mapBg)" rx="8" />

          {/* Connection lines between neighboring provinces */}
          {provinceShapes.map((p1, i) =>
            provinceShapes.slice(i + 1).map((p2, j) => {
              const dist = Math.sqrt((p1.cx - p2.cx) ** 2 + (p1.cy - p2.cy) ** 2);
              if (dist > 100) return null;
              return (
                <line
                  key={`conn-${i}-${j}`}
                  x1={p1.cx}
                  y1={p1.cy}
                  x2={p2.cx}
                  y2={p2.cy}
                  stroke="#3b82f6"
                  strokeOpacity="0.15"
                  strokeWidth="0.5"
                  strokeDasharray="4 2"
                />
              );
            })
          )}

          {/* Province shapes */}
          {provinceShapes.map((shape, idx) => {
            const region = regions[idx];
            if (!region) return null;
            const isHovered = hoveredRegion === region.id;
            const color = getStatusColor(region.status);
            const glow = getStatusGlow(region.status);

            return (
              <g key={region.id}>
                {/* Glow circle */}
                <circle
                  cx={shape.cx}
                  cy={shape.cy}
                  r={isHovered ? 35 : 20}
                  fill={glow}
                  style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
                />

                {/* Province shape */}
                <path
                  d={shape.path}
                  fill={isHovered ? color : `${color}60`}
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 1}
                  className="cursor-pointer"
                  style={{
                    transition: "fill 0.3s ease, stroke-width 0.3s ease",
                    filter: isHovered ? `url(#glow-${region.id})` : "none",
                  }}
                  onMouseEnter={(e) => {
                    setHoveredRegion(region.id);
                    const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
                    if (rect) {
                      const scaleX = rect.width / IRAN_MAP_WIDTH;
                      const scaleY = rect.height / IRAN_MAP_HEIGHT;
                      setTooltipPos({
                        x: shape.cx * scaleX,
                        y: shape.cy * scaleY,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => navigate(`/regions/${region.id}`)}
                />

                {/* Province name */}
                <text
                  x={shape.cx}
                  y={shape.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="8"
                  fontWeight={isHovered ? "bold" : "normal"}
                  className="pointer-events-none select-none"
                  style={{ transition: "font-weight 0.2s ease" }}
                >
                  {region.code}
                </text>

                {/* Active outage indicator */}
                {region.activeOutages > 0 && (
                  <>
                    <circle
                      cx={shape.cx + 15}
                      cy={shape.cy - 15}
                      r="7"
                      fill="#ef4444"
                      stroke="#1e293b"
                      strokeWidth="1"
                    >
                      <animate
                        attributeName="r"
                        values="6;8;6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={shape.cx + 15}
                      y={shape.cy - 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="7"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {region.activeOutages}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Animated electricity particles on connections */}
          {provinceShapes.slice(0, 10).map((p, i) => {
            const next = provinceShapes[(i + 1) % provinceShapes.length];
            return (
              <circle key={`particle-${i}`} r="2" fill="#60a5fa" opacity="0.8">
                <animateMotion
                  dur={`${3 + i * 0.5}s`}
                  repeatCount="indefinite"
                  path={`M ${p.cx} ${p.cy} L ${next.cx} ${next.cy}`}
                />
              </circle>
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredRegionData && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-20 rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-xs text-white shadow-xl backdrop-blur-sm"
              style={{
                left: tooltipPos.x + 20,
                top: tooltipPos.y - 40,
              }}
            >
              <p className="font-bold text-sm">{hoveredRegionData.name}</p>
              <p className="text-gray-400">{hoveredRegionData.nameFA}</p>
              <div className="mt-1 space-y-0.5">
                <p>
                  <span className="text-gray-400">{t("detail.customers")}:</span>{" "}
                  {hoveredRegionData.totalCustomers.toLocaleString()}
                </p>
                <p>
                  <span className="text-gray-400">{t("detail.activeOutages")}:</span>{" "}
                  <span className={hoveredRegionData.activeOutages > 0 ? "text-red-400 font-bold" : "text-green-400"}>
                    {hoveredRegionData.activeOutages}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">{t("reliability")}:</span>{" "}
                  {hoveredRegionData.reliabilityScore.toFixed(1)}%
                </p>
              </div>
              <p className="mt-1 text-[10px] text-primary-400">{t("clickToView")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppCard>
  );
};
