import type { Alert } from "@/entities/alert/model/alert.types";
import type { AlertId } from "@/shared/types/brand";
import { randomInt } from "@/shared/utils/numbers";

const severities = ["info", "warning", "error", "critical"] as const;
const sources = ["system", "sensor", "manual", "automated"] as const;
const regionNames = [
  "Central Region",
  "Western Region",
  "Eastern Region",
  "Northern Region",
  "Southern Region",
];

const alertTitles = [
  "Voltage Drop Detected",
  "High Load Warning",
  "Equipment Temperature Alert",
  "Grid Frequency Deviation",
  "Transformer Overload",
  "Cable Fault Detected",
  "Switchgear Malfunction",
  "Power Factor Low",
  "Demand Spike Alert",
  "System Backup Activated",
];

const alertMessages = [
  "Voltage levels have dropped below threshold in the monitored zone.",
  "System load approaching maximum capacity. Consider load shedding.",
  "Equipment temperature exceeding normal operating range.",
  "Grid frequency deviation detected, automatic correction initiated.",
  "Transformer load exceeding rated capacity. Immediate attention required.",
  "Underground cable fault detected via fault indicators.",
  "Switchgear operation anomaly detected during routine monitoring.",
  "Power factor dropping below acceptable limits in the distribution network.",
  "Unusual demand spike detected, reserve capacity being allocated.",
  "Primary system fault detected, backup systems engaged.",
];

export function createAlert(index: number): Alert {
  const createdAt = new Date();
  createdAt.setMinutes(createdAt.getMinutes() - randomInt(5, 1440));

  return {
    id: `alert_${index + 1}` as AlertId,
    title: alertTitles[index % alertTitles.length],
    message: alertMessages[index % alertMessages.length],
    severity: severities[index % severities.length],
    source: sources[index % sources.length],
    regionName: regionNames[index % regionNames.length],
    acknowledged: index % 3 === 0,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  };
}
