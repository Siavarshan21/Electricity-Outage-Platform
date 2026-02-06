export const reportsQueryKeys = {
  all: ["reports"] as const,
  summary: () => [...reportsQueryKeys.all, "summary"] as const,
};
