import { httpClient } from "@/shared/api/httpClient";
import type { QueryParams } from "@/shared/api/apiTypes";
import {
  regionsListResponseSchema,
  regionDetailResponseSchema,
  type RegionsListResponse,
  type RegionDetailResponse,
} from "./regionsSchemas";

export const regionsApi = {
  async getRegions(params?: QueryParams): Promise<RegionsListResponse> {
    const response = await httpClient.get<RegionsListResponse>("/regions", params);
    return regionsListResponseSchema.parse(response);
  },

  async getRegionById(id: string): Promise<RegionDetailResponse> {
    const response = await httpClient.get<RegionDetailResponse>(`/regions/${id}`);
    return regionDetailResponseSchema.parse(response);
  },
};
