import type { Alert } from "@/entities/alert/model/alert.types";

export function selectUnacknowledgedAlerts(alerts: Alert[]): Alert[] {
  return alerts.filter((a) => !a.acknowledged);
}

export function selectCriticalAlerts(alerts: Alert[]): Alert[] {
  return alerts.filter((a) => a.severity === "critical");
}
