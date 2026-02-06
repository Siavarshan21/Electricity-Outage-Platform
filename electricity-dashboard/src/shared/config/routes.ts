export const ROUTE_PATHS = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  OUTAGES: "/outages",
  OUTAGE_DETAILS: "/outages/:id",
  REGIONS: "/regions",
  REGION_DETAILS: "/regions/:id",
  ALERTS: "/alerts",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  PREFERENCES: "/settings/preferences",
  LOGIN: "/login",
  LOGOUT: "/logout",
  NOT_FOUND: "*",
  FORBIDDEN: "/forbidden",
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
