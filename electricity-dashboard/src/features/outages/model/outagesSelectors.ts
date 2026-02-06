import type { Outage } from "@/entities/outage/model/outage.types";

export function selectActiveOutages(outages: Outage[]): Outage[] {
  return outages.filter((o) => o.status === "active");
}

export function selectTotalAffectedCustomers(outages: Outage[]): number {
  return outages.reduce((sum, o) => sum + o.affectedCustomers, 0);
}
