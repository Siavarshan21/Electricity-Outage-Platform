import React from "react";
import { useTranslation } from "react-i18next";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AppCard } from "@/shared/ui/card/AppCard";
import type { ReportsSummary } from "@/features/reports/api/reportsSchemas";

interface ReportsChartsProps {
  summary: ReportsSummary;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#22c55e",
};

export const ReportsCharts: React.FC<ReportsChartsProps> = ({ summary }) => {
  const { t } = useTranslation("reports");

  const pieData = summary.severityDistribution.map((item) => ({
    name: t(`charts.severity.${item.severity}`, { defaultValue: item.severity }),
    value: item.count,
    severity: item.severity,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Monthly Trend Area Chart */}
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.monthlyTrend")}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={summary.monthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="gradientOutages" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#f3f4f6",
              }}
              itemStyle={{ color: "#f3f4f6" }}
              labelStyle={{ color: "#f3f4f6", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="outages"
              name={t("charts.outages")}
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradientOutages)"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              name={t("charts.resolved")}
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#gradientResolved)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </AppCard>

      {/* Severity Distribution Pie Chart */}
      <AppCard>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {t("charts.severityDistribution")}
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#9ca3af" }}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.severity}
                  fill={SEVERITY_COLORS[entry.severity] ?? "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
                color: "#f3f4f6",
              }}
              itemStyle={{ color: "#f3f4f6" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </AppCard>
    </div>
  );
};
