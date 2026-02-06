import { z } from "zod";

export const monthlyTrendSchema = z.object({
  month: z.string(),
  outages: z.number(),
  resolved: z.number(),
});

export const severityDistributionSchema = z.object({
  severity: z.string(),
  count: z.number(),
});

export const reportsSummarySchema = z.object({
  totalOutages: z.number(),
  activeOutages: z.number(),
  resolvedOutages: z.number(),
  totalAffectedCustomers: z.number(),
  avgResolutionTime: z.number(),
  totalAlerts: z.number(),
  criticalAlerts: z.number(),
  avgReliabilityScore: z.number(),
  monthlyTrend: z.array(monthlyTrendSchema),
  severityDistribution: z.array(severityDistributionSchema),
});

export type ReportsSummary = z.infer<typeof reportsSummarySchema>;
