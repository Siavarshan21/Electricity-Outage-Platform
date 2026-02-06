import React from "react";
import { motion } from "framer-motion";

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
}

export const SidebarCollapseButton: React.FC<SidebarCollapseButtonProps> = ({
  collapsed,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
    >
      <motion.svg
        animate={{ rotate: collapsed ? 180 : 0 }}
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </motion.svg>
    </button>
  );
};
