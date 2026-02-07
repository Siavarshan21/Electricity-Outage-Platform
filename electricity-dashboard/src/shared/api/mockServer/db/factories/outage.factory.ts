import type { Outage, OutageTimelineEvent } from "@/entities/outage/model/outage.types";
import type { OutageId, RegionId } from "@/shared/types/brand";
import { randomInt, randomFloat } from "@/shared/utils/numbers";
import { IRAN_PROVINCES } from "./region.factory";

const titles = [
  "Power Line Fault",
  "Transformer Failure",
  "Grid Overload",
  "Cable Damage",
  "Substation Issue",
  "Scheduled Maintenance",
  "Storm Damage",
  "Equipment Malfunction",
  "Voltage Fluctuation",
  "Distribution Failure",
  "High Voltage Tower Collapse",
  "Underground Cable Rupture",
  "Capacitor Bank Failure",
  "Relay Protection Trip",
  "Generator Outage",
];

const statuses = ["active", "resolved", "scheduled", "investigating"] as const;
const types = ["planned", "unplanned", "emergency", "maintenance"] as const;
const severities = ["low", "medium", "high", "critical"] as const;

export function createOutage(index: number): Outage {
  const status = statuses[index % statuses.length];
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - randomInt(1, 72));
  const durationMinutes = randomInt(30, 480);

  const province = IRAN_PROVINCES[index % IRAN_PROVINCES.length];
  const city = province.cities[index % province.cities.length];

  const resolvedAt =
    status === "resolved"
      ? new Date(startDate.getTime() + durationMinutes * 60000).toISOString()
      : null;

  const estimatedRestorationAt =
    status !== "resolved"
      ? new Date(startDate.getTime() + randomInt(60, 600) * 60000).toISOString()
      : null;

  return {
    id: `outage_${index + 1}` as OutageId,
    title: titles[index % titles.length],
    description: `${titles[index % titles.length]} affecting ${city.name} area in ${province.name} province. Teams are working on resolution.`,
    status,
    type: types[index % types.length],
    severity: severities[index % severities.length],
    regionId: `region_${(index % IRAN_PROVINCES.length) + 1}` as RegionId,
    regionName: province.name,
    city: city.name,
    affectedCustomers: randomInt(100, 50000),
    startedAt: startDate.toISOString(),
    estimatedRestorationAt,
    resolvedAt,
    durationMinutes,
    coordinates: {
      lat: city.lat + randomFloat(-0.1, 0.1),
      lng: city.lng + randomFloat(-0.1, 0.1),
    },
    createdAt: startDate.toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createOutageTimeline(outageId: string): OutageTimelineEvent[] {
  const events: OutageTimelineEvent[] = [];
  const baseTime = new Date();
  baseTime.setHours(baseTime.getHours() - 4);

  const timelineStatuses = ["investigating", "active", "investigating", "resolved"] as const;
  const messages = [
    "Issue reported and investigation started",
    "Outage confirmed, teams dispatched",
    "Root cause identified, repair in progress",
    "Power restored to all affected areas",
  ];

  timelineStatuses.forEach((status, i) => {
    const timestamp = new Date(baseTime.getTime() + i * 3600000);
    events.push({
      id: `event_${outageId}_${i}`,
      outageId,
      status,
      message: messages[i],
      timestamp: timestamp.toISOString(),
    });
  });

  return events;
}
