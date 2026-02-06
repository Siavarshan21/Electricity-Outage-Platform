import type { AlertSeverity, AlertSource } from "./alert.types";

export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  info: "info",
  warning: "warning",
  error: "danger",
  critical: "danger",
};

export const ALERT_SOURCE_COLORS: Record<AlertSource, string> = {
  system: "primary",
  sensor: "info",
  manual: "default",
  automated: "success",
};
