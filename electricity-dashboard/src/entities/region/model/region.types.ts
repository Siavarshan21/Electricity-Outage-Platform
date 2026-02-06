import { z } from "zod";
import type { RegionId } from "@/shared/types/brand";

export const regionStatusEnum = z.enum(["healthy", "degraded", "critical", "offline"]);
export type RegionStatus = z.infer<typeof regionStatusEnum>;

export const regionSchema = z.object({
  id: z.string() as unknown as z.ZodType<RegionId>,
  name: z.string(),
  code: z.string(),
  status: regionStatusEnum,
  reliabilityScore: z.number(),
  totalCustomers: z.number(),
  activeOutages: z.number(),
  totalOutages: z.number(),
  avgResolutionTimeMinutes: z.number(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Region = z.infer<typeof regionSchema>;
