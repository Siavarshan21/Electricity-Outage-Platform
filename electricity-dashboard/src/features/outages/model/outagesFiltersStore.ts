import { create } from "zustand";
import type { OutageStatus, OutageType, OutageSeverity } from "@/entities/outage/model/outage.types";

interface OutagesFiltersState {
  search: string;
  status: OutageStatus | "";
  type: OutageType | "";
  severity: OutageSeverity | "";
  city: string;
  regionName: string;
  setSearch: (search: string) => void;
  setStatus: (status: OutageStatus | "") => void;
  setType: (type: OutageType | "") => void;
  setSeverity: (severity: OutageSeverity | "") => void;
  setCity: (city: string) => void;
  setRegionName: (regionName: string) => void;
  resetFilters: () => void;
}

export const useOutagesFiltersStore = create<OutagesFiltersState>((set) => ({
  search: "",
  status: "",
  type: "",
  severity: "",
  city: "",
  regionName: "",
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),
  setSeverity: (severity) => set({ severity }),
  setCity: (city) => set({ city }),
  setRegionName: (regionName) => set({ regionName }),
  resetFilters: () =>
    set({ search: "", status: "", type: "", severity: "", city: "", regionName: "" }),
}));
