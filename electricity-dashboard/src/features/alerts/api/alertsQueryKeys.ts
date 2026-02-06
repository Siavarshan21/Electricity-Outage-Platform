import type { QueryParams } from "@/shared/api/apiTypes";

export const alertsQueryKeys = {
  all: ["alerts"] as const,
  lists: () => [...alertsQueryKeys.all, "list"] as const,
  list: (params: QueryParams) => [...alertsQueryKeys.lists(), params] as const,
  details: () => [...alertsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...alertsQueryKeys.details(), id] as const,
};
