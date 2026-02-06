import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ROUTE_PATHS } from "@/shared/config/routes";

export const UserMenu: React.FC = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
          {user.name}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => {
                navigate(ROUTE_PATHS.SETTINGS);
                setOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t("auth.settings")}
            </button>
            <button
              onClick={() => {
                clearAuth();
                navigate(ROUTE_PATHS.LOGIN);
                setOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 dark:text-danger-400 dark:hover:bg-gray-700"
            >
              {t("auth.logout")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
