import type { Region } from "@/entities/region/model/region.types";

export function selectHealthyRegions(regions: Region[]): Region[] {
  return regions.filter((r) => r.status === "healthy");
}

export function selectAvgReliability(regions: Region[]): number {
  if (regions.length === 0) return 0;
  return regions.reduce((sum, r) => sum + r.reliabilityScore, 0) / regions.length;
}
