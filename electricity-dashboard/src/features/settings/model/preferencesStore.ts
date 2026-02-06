import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferencesState {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  autoRefreshInterval: number;
  setNotificationsEnabled: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setAutoRefreshInterval: (interval: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      emailNotifications: false,
      autoRefreshInterval: 30,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setAutoRefreshInterval: (interval) => set({ autoRefreshInterval: interval }),
    }),
    { name: "preferences-storage" },
  ),
);
