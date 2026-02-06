import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { SidebarNav } from "./SidebarNav";
import { SidebarCollapseButton } from "./SidebarCollapseButton";

export const Sidebar: React.FC = () => {
  const { t } = useTranslation("navigation");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-primary-600 dark:text-primary-400"
          >
            {t("appName")}
          </motion.h1>
        )}
        <SidebarCollapseButton collapsed={collapsed} onClick={() => setCollapsed(!collapsed)} />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav collapsed={collapsed} />
      </div>
    </motion.aside>
  );
};
