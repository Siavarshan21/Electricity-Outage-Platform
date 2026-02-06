import type { QueryParams } from "@/shared/api/apiTypes";

export const regionsQueryKeys = {
  all: ["regions"] as const,
  lists: () => [...regionsQueryKeys.all, "list"] as const,
  list: (params: QueryParams) => [...regionsQueryKeys.lists(), params] as const,
  details: () => [...regionsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...regionsQueryKeys.details(), id] as const,
};
