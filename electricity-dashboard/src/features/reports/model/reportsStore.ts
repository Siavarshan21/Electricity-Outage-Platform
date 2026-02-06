import { create } from "zustand";

interface ReportsState {
  dateRange: "7d" | "30d" | "90d" | "1y";
  setDateRange: (range: "7d" | "30d" | "90d" | "1y") => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  dateRange: "30d",
  setDateRange: (range) => set({ dateRange: range }),
}));
