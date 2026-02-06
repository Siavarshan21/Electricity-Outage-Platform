import { z } from "zod";
import type { AlertId } from "@/shared/types/brand";

export const alertSeverityEnum = z.enum(["info", "warning", "error", "critical"]);
export type AlertSeverity = z.infer<typeof alertSeverityEnum>;

export const alertSourceEnum = z.enum(["system", "sensor", "manual", "automated"]);
export type AlertSource = z.infer<typeof alertSourceEnum>;

export const alertSchema = z.object({
  id: z.string() as unknown as z.ZodType<AlertId>,
  title: z.string(),
  message: z.string(),
  severity: alertSeverityEnum,
  source: alertSourceEnum,
  regionName: z.string(),
  acknowledged: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Alert = z.infer<typeof alertSchema>;
