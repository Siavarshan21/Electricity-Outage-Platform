import React from "react";
import { clsx } from "@/shared/lib/clsx";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md";

interface AppBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
  success: "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
  danger: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-gray-400",
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  info: "bg-blue-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export const AppBadge: React.FC<AppBadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
  className,
  dot = false,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot && <span className={clsx("h-1.5 w-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
};
