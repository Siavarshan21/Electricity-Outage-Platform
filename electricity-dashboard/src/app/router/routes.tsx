import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/config/routes";

import { RootLayout } from "./layouts/RootLayout";
import { AppShellLayout } from "./layouts/AppShellLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { RequireAuth } from "./guards/RequireAuth";

import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { OutagesPage } from "@/pages/outages/OutagesPage";
import { OutageDetailsPage } from "@/pages/outages/OutageDetailsPage";
import { RegionsPage } from "@/pages/regions/RegionsPage";
import { RegionDetailsPage } from "@/pages/regions/RegionDetailsPage";
import { AlertsPage } from "@/pages/alerts/AlertsPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { PreferencesPage } from "@/pages/settings/PreferencesPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { LogoutPage } from "@/pages/auth/LogoutPage";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { ForbiddenPage } from "@/pages/errors/ForbiddenPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.LOGOUT} element={<LogoutPage />} />
        </Route>

        {/* Protected app routes */}
        <Route
          element={
            <RequireAuth>
              <AppShellLayout />
            </RequireAuth>
          }
        >
          <Route path={ROUTE_PATHS.HOME} element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
          <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTE_PATHS.OUTAGES} element={<OutagesPage />} />
          <Route path={ROUTE_PATHS.OUTAGE_DETAILS} element={<OutageDetailsPage />} />
          <Route path={ROUTE_PATHS.REGIONS} element={<RegionsPage />} />
          <Route path={ROUTE_PATHS.REGION_DETAILS} element={<RegionDetailsPage />} />
          <Route path={ROUTE_PATHS.ALERTS} element={<AlertsPage />} />
          <Route path={ROUTE_PATHS.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTE_PATHS.PREFERENCES} element={<PreferencesPage />} />
          <Route path={ROUTE_PATHS.FORBIDDEN} element={<ForbiddenPage />} />
        </Route>

        {/* 404 */}
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
