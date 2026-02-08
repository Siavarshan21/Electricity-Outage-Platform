import React, { Suspense } from "react";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./router/routes";
import { PageSpinner } from "@/shared/ui/loader/PageSpinner";
import { ToastContainer } from "@/shared/ui/toast/ToastContainer";

export const App: React.FC = () => {
  return (
    <Suspense fallback={<PageSpinner />}>
      <AppProviders>
        <AppRoutes />
        <ToastContainer />
      </AppProviders>
    </Suspense>
  );
};
