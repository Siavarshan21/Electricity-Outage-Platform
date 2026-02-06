import type { OutageStatus, OutageType, OutageSeverity } from "./outage.types";

export const OUTAGE_STATUS_COLORS: Record<OutageStatus, string> = {
  active: "danger",
  resolved: "success",
  scheduled: "info",
  investigating: "warning",
};

export const OUTAGE_TYPE_COLORS: Record<OutageType, string> = {
  planned: "primary",
  unplanned: "danger",
  emergency: "danger",
  maintenance: "warning",
};

export const OUTAGE_SEVERITY_COLORS: Record<OutageSeverity, string> = {
  low: "default",
  medium: "warning",
  high: "danger",
  critical: "danger",
};
