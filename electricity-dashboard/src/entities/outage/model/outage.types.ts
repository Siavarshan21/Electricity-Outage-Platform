import { z } from "zod";
import type { OutageId, RegionId } from "@/shared/types/brand";

export const outageStatusEnum = z.enum(["active", "resolved", "scheduled", "investigating"]);
export type OutageStatus = z.infer<typeof outageStatusEnum>;

export const outageTypeEnum = z.enum(["planned", "unplanned", "emergency", "maintenance"]);
export type OutageType = z.infer<typeof outageTypeEnum>;

export const outageSeverityEnum = z.enum(["low", "medium", "high", "critical"]);
export type OutageSeverity = z.infer<typeof outageSeverityEnum>;

export const outageSchema = z.object({
  id: z.string() as unknown as z.ZodType<OutageId>,
  title: z.string(),
  description: z.string(),
  status: outageStatusEnum,
  type: outageTypeEnum,
  severity: outageSeverityEnum,
  regionId: z.string() as unknown as z.ZodType<RegionId>,
  regionName: z.string(),
  city: z.string(),
  affectedCustomers: z.number(),
  startedAt: z.string(),
  estimatedRestorationAt: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  durationMinutes: z.number(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Outage = z.infer<typeof outageSchema>;

export const outageTimelineEventSchema = z.object({
  id: z.string(),
  outageId: z.string(),
  status: outageStatusEnum,
  message: z.string(),
  timestamp: z.string(),
});

export type OutageTimelineEvent = z.infer<typeof outageTimelineEventSchema>;
