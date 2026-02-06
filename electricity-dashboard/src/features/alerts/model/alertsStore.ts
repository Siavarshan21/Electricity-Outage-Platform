import { create } from "zustand";
import type { AlertSeverity } from "@/entities/alert/model/alert.types";

interface AlertsState {
  selectedSeverity: AlertSeverity | "";
  setSelectedSeverity: (severity: AlertSeverity | "") => void;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  selectedSeverity: "",
  setSelectedSeverity: (severity) => set({ selectedSeverity: severity }),
}));
