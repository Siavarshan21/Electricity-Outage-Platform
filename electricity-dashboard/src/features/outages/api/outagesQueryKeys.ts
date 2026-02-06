import type { QueryParams } from "@/shared/api/apiTypes";

export const outagesQueryKeys = {
  all: ["outages"] as const,
  lists: () => [...outagesQueryKeys.all, "list"] as const,
  list: (params: QueryParams) => [...outagesQueryKeys.lists(), params] as const,
  details: () => [...outagesQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...outagesQueryKeys.details(), id] as const,
};
