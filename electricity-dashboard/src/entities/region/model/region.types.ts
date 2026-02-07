import { z } from "zod";
import type { RegionId } from "@/shared/types/brand";

export const regionStatusEnum = z.enum(["healthy", "degraded", "critical", "offline"]);
export type RegionStatus = z.infer<typeof regionStatusEnum>;

export const citySchema = z.object({
  name: z.string(),
  nameFA: z.string(),
  population: z.number(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  activeOutages: z.number(),
});

export type City = z.infer<typeof citySchema>;

export const regionSchema = z.object({
  id: z.string() as unknown as z.ZodType<RegionId>,
  name: z.string(),
  nameFA: z.string(),
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
  cities: z.array(citySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Region = z.infer<typeof regionSchema>;
