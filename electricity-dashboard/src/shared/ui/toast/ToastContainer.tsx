import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useToastStore } from "./toast";

const TOAST_DURATION = 5000;

const icons: Record<string, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const colorClasses: Record<
  string,
  { container: string; icon: string; progress: string }
> = {
  success: {
    container:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
    icon: "text-green-500 dark:text-green-400",
    progress: "bg-green-500 dark:bg-green-400",
  },
  error: {
    container:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
    icon: "text-red-500 dark:text-red-400",
    progress: "bg-red-500 dark:bg-red-400",
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200",
    icon: "text-amber-500 dark:text-amber-400",
    progress: "bg-amber-500 dark:bg-amber-400",
  },
  info: {
    container:
      "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
    icon: "text-blue-500 dark:text-blue-400",
    progress: "bg-blue-500 dark:bg-blue-400",
  },
};

function ProgressBar({ type, id }: { type: string; id: string }) {
  const [progress, setProgress] = useState(100);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        removeToast(id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [id, removeToast]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg">
      <div
        className={`h-full transition-none ${colorClasses[type].progress}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className={`relative pointer-events-auto border rounded-lg shadow-lg overflow-hidden ${colorClasses[t.type].container}`}
          >
            <div className="flex items-start gap-3 p-4 pr-10">
              <span className={`flex-shrink-0 mt-0.5 ${colorClasses[t.type].icon}`}>
                {icons[t.type]}
              </span>
              <p className="text-sm font-medium leading-5">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="absolute top-3 right-3 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
              aria-label="Close"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ProgressBar type={t.type} id={t.id} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
