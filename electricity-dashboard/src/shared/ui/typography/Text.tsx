import React from "react";
import { clsx } from "@/shared/lib/clsx";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "overline";

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const variantStyles: Record<TextVariant, string> = {
  h1: "text-3xl font-bold text-gray-900 dark:text-white",
  h2: "text-2xl font-semibold text-gray-900 dark:text-white",
  h3: "text-xl font-semibold text-gray-900 dark:text-white",
  h4: "text-lg font-medium text-gray-900 dark:text-white",
  body: "text-sm text-gray-600 dark:text-gray-300",
  caption: "text-xs text-gray-500 dark:text-gray-400",
  overline: "text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400",
};

const defaultElements: Record<TextVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  caption: "span",
  overline: "span",
};

export const Text: React.FC<TextProps> = ({ variant = "body", children, className, as }) => {
  const Component = as || defaultElements[variant];
  return <Component className={clsx(variantStyles[variant], className)}>{children}</Component>;
};
