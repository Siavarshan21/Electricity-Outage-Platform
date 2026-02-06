import { z } from "zod";
import { alertSchema } from "@/entities/alert/model/alert.types";
import { paginationSchema } from "@/shared/api/apiTypes";

export const alertsListResponseSchema = z.object({
  data: z.array(alertSchema),
  pagination: paginationSchema,
});

export type AlertsListResponse = z.infer<typeof alertsListResponseSchema>;
