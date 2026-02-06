import React from "react";

export const MissingTranslationDebugger: React.FC = () => {
  if (import.meta.env.PROD) return null;

  return null;
};
