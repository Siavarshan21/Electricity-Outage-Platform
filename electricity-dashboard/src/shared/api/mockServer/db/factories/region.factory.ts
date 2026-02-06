import type { Region } from "@/entities/region/model/region.types";
import type { RegionId } from "@/shared/types/brand";
import { randomInt, randomFloat } from "@/shared/utils/numbers";

const regions = [
  { name: "Central Region", code: "CR", lat: 24.7136, lng: 46.6753 },
  { name: "Western Region", code: "WR", lat: 21.4225, lng: 39.8262 },
  { name: "Eastern Region", code: "ER", lat: 26.4207, lng: 50.0888 },
  { name: "Northern Region", code: "NR", lat: 28.3838, lng: 36.5718 },
  { name: "Southern Region", code: "SR", lat: 18.2164, lng: 42.5053 },
];

const statuses = ["healthy", "degraded", "critical", "offline"] as const;

export function createRegion(index: number): Region {
  const region = regions[index % regions.length];
  const activeOutages = randomInt(0, 8);

  return {
    id: `region_${index + 1}` as RegionId,
    name: region.name,
    code: region.code,
    status: statuses[Math.min(index, statuses.length - 1)],
    reliabilityScore: randomFloat(85, 99.9),
    totalCustomers: randomInt(50000, 500000),
    activeOutages,
    totalOutages: activeOutages + randomInt(10, 100),
    avgResolutionTimeMinutes: randomInt(30, 300),
    coordinates: { lat: region.lat, lng: region.lng },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
