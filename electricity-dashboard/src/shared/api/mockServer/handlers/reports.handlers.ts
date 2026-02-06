import { http, HttpResponse, delay } from "msw";
import { getDb } from "../db/db";
import { randomDelay } from "../utils/delay";

export const reportsHandlers = [
  http.get("/api/reports/summary", async () => {
    await delay(randomDelay());
    const db = getDb();

    const totalOutages = db.outages.length;
    const activeOutages = db.outages.filter((o) => o.status === "active").length;
    const resolvedOutages = db.outages.filter((o) => o.status === "resolved").length;
    const totalAffectedCustomers = db.outages.reduce((sum, o) => sum + o.affectedCustomers, 0);
    const avgResolutionTime = Math.round(
      db.outages
        .filter((o) => o.status === "resolved")
        .reduce((sum, o) => sum + o.durationMinutes, 0) / Math.max(resolvedOutages, 1),
    );
    const totalAlerts = db.alerts.length;
    const criticalAlerts = db.alerts.filter((a) => a.severity === "critical").length;
    const avgReliabilityScore =
      db.regions.reduce((sum, r) => sum + r.reliabilityScore, 0) / db.regions.length;

    const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2025, i).toLocaleString("en", { month: "short" }),
      outages: Math.floor(Math.random() * 30) + 5,
      resolved: Math.floor(Math.random() * 25) + 3,
    }));

    const severityDistribution = [
      { severity: "low", count: db.outages.filter((o) => o.severity === "low").length },
      { severity: "medium", count: db.outages.filter((o) => o.severity === "medium").length },
      { severity: "high", count: db.outages.filter((o) => o.severity === "high").length },
      { severity: "critical", count: db.outages.filter((o) => o.severity === "critical").length },
    ];

    return HttpResponse.json({
      totalOutages,
      activeOutages,
      resolvedOutages,
      totalAffectedCustomers,
      avgResolutionTime,
      totalAlerts,
      criticalAlerts,
      avgReliabilityScore: Number(avgReliabilityScore.toFixed(1)),
      monthlyTrend,
      severityDistribution,
    });
  }),
];
