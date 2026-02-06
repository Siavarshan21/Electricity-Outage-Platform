import React from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useToastStore } from "@/shared/ui/toast/toast";
import { motion } from "framer-motion";

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const colorMap = {
    success: "bg-success-500",
    error: "bg-danger-500",
    warning: "bg-warning-500",
    info: "bg-primary-500",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${colorMap[toast.type]}`}
          >
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
              x
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
};
