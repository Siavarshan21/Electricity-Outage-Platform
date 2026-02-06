import { httpClient } from "@/shared/api/httpClient";
import type { QueryParams } from "@/shared/api/apiTypes";
import { alertsListResponseSchema, type AlertsListResponse } from "./alertsSchemas";
import { alertSchema } from "@/entities/alert/model/alert.types";
import type { Alert } from "@/entities/alert/model/alert.types";

export const alertsApi = {
  async getAlerts(params?: QueryParams): Promise<AlertsListResponse> {
    const response = await httpClient.get<AlertsListResponse>("/alerts", params);
    return alertsListResponseSchema.parse(response);
  },

  async getAlertById(id: string): Promise<Alert> {
    const response = await httpClient.get<Alert>(`/alerts/${id}`);
    return alertSchema.parse(response);
  },
};
