import { httpClient } from "@/shared/api/httpClient";
import { reportsSummarySchema, type ReportsSummary } from "./reportsSchemas";

export const reportsApi = {
  async getSummary(): Promise<ReportsSummary> {
    const response = await httpClient.get<ReportsSummary>("/reports/summary");
    return reportsSummarySchema.parse(response);
  },
};
