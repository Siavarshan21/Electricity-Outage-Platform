import { httpClient } from "@/shared/api/httpClient";
import type { QueryParams } from "@/shared/api/apiTypes";
import {
  outagesListResponseSchema,
  outageDetailResponseSchema,
  type OutagesListResponse,
  type OutageDetailResponse,
} from "./outagesSchemas";

export const outagesApi = {
  async getOutages(params?: QueryParams): Promise<OutagesListResponse> {
    const response = await httpClient.get<OutagesListResponse>("/outages", params);
    return outagesListResponseSchema.parse(response);
  },

  async getOutageById(id: string): Promise<OutageDetailResponse> {
    const response = await httpClient.get<OutageDetailResponse>(`/outages/${id}`);
    return outageDetailResponseSchema.parse(response);
  },
};
