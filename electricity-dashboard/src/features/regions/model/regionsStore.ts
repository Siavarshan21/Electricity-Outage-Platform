import { create } from "zustand";

interface RegionsState {
  search: string;
  setSearch: (search: string) => void;
}

export const useRegionsStore = create<RegionsState>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));
