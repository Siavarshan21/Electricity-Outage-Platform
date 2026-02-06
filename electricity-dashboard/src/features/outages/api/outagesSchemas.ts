import { z } from "zod";
import { outageSchema, outageTimelineEventSchema } from "@/entities/outage/model/outage.types";
import { paginationSchema } from "@/shared/api/apiTypes";

export const outagesListResponseSchema = z.object({
  data: z.array(outageSchema),
  pagination: paginationSchema,
});

export type OutagesListResponse = z.infer<typeof outagesListResponseSchema>;

export const outageDetailResponseSchema = outageSchema.extend({
  timeline: z.array(outageTimelineEventSchema),
});

export type OutageDetailResponse = z.infer<typeof outageDetailResponseSchema>;
