import { z } from "zod";
import { regionSchema } from "@/entities/region/model/region.types";
import { outageSchema } from "@/entities/outage/model/outage.types";
import { paginationSchema } from "@/shared/api/apiTypes";

export const regionsListResponseSchema = z.object({
  data: z.array(regionSchema),
  pagination: paginationSchema,
});

export type RegionsListResponse = z.infer<typeof regionsListResponseSchema>;

export const regionDetailResponseSchema = regionSchema.extend({
  outages: z.array(outageSchema),
});

export type RegionDetailResponse = z.infer<typeof regionDetailResponseSchema>;
