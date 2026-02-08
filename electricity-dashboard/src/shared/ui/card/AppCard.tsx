import React from "react";
import { clsx } from "@/shared/lib/clsx";
import { motion } from "framer-motion";
import { scaleIn } from "@/shared/config/motion";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  gradient?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className,
  hover = false,
  glass = false,
  gradient = false,
  padding = "md",
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={clsx(
        "rounded-xl border shadow-sm",
        glass
          ? "border-white/10 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-gray-800/60"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        gradient &&
          "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
        hover &&
          "transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 dark:hover:shadow-primary-400/5",
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
