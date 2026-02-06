import React from "react";
import { clsx } from "@/shared/lib/clsx";
import { motion } from "framer-motion";
import { scaleIn } from "@/shared/config/motion";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
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
  padding = "md",
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
        hover && "transition-shadow hover:shadow-md",
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </motion.div>
  );
};
