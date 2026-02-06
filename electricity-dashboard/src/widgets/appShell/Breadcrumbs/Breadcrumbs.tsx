import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation("navigation");
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200">
            {t("home")}
          </Link>
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = t(segment, { defaultValue: segment });

          return (
            <li key={path} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
              ) : (
                <Link to={path} className="hover:text-gray-700 dark:hover:text-gray-200">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
