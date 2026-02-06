import { outagesHandlers } from "./handlers/outages.handlers";
import { regionsHandlers } from "./handlers/regions.handlers";
import { alertsHandlers } from "./handlers/alerts.handlers";
import { reportsHandlers } from "./handlers/reports.handlers";
import { authHandlers } from "./handlers/auth.handlers";

export const handlers = [
  ...outagesHandlers,
  ...regionsHandlers,
  ...alertsHandlers,
  ...reportsHandlers,
  ...authHandlers,
];
