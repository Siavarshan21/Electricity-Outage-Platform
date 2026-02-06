import type { RegionStatus } from "./region.types";

export const REGION_STATUS_COLORS: Record<RegionStatus, string> = {
  healthy: "success",
  degraded: "warning",
  critical: "danger",
  offline: "default",
};
