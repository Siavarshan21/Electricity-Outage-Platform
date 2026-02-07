import { createOutage } from "./factories/outage.factory";
import { createRegion } from "./factories/region.factory";
import { createAlert } from "./factories/alert.factory";
import { createUser } from "./factories/user.factory";
import type { Outage } from "@/entities/outage/model/outage.types";
import type { Region } from "@/entities/region/model/region.types";
import type { Alert } from "@/entities/alert/model/alert.types";
import type { User } from "@/entities/user/model/user.types";

export interface SeedData {
  outages: Outage[];
  regions: Region[];
  alerts: Alert[];
  users: User[];
}

export function seedDatabase(): SeedData {
  const outages = Array.from({ length: 50 }, (_, i) => createOutage(i));
  const regions = Array.from({ length: 31 }, (_, i) => createRegion(i));
  const alerts = Array.from({ length: 30 }, (_, i) => createAlert(i));
  const users = [createUser()];

  return { outages, regions, alerts, users };
}
