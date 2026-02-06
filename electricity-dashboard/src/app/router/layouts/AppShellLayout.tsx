import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/widgets/appShell/Sidebar/Sidebar";
import { Topbar } from "@/widgets/appShell/Topbar/Topbar";
import { Breadcrumbs } from "@/widgets/appShell/Breadcrumbs/Breadcrumbs";

export const AppShellLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
