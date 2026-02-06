import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanguageDir } from "@/shared/config/i18n";
import "@/shared/lib/i18next";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = getLanguageDir(i18n.language);
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
};
