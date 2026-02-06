import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { MotionProvider } from "./MotionProvider";
import { I18nProvider } from "./I18nProvider";
import { ErrorBoundaryProvider } from "./ErrorBoundaryProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundaryProvider>
      <I18nProvider>
        <QueryProvider>
          <ThemeProvider>
            <MotionProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </MotionProvider>
          </ThemeProvider>
        </QueryProvider>
      </I18nProvider>
    </ErrorBoundaryProvider>
  );
};
