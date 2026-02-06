import React from "react";
import { NavLink } from "react-router-dom";
import { clsx } from "@/shared/lib/clsx";
import { motion } from "framer-motion";

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ to, label, icon, collapsed = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
        )
      }
    >
      <motion.span whileHover={{ scale: 1.1 }} className="flex-shrink-0">
        {icon}
      </motion.span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};
