import { create } from 'zustand';

interface ProvinceState {
  currentMonth: number;
  isMapReady: boolean;
  setCurrentMonth: (month: number) => void;
  setIsMapReady: (isReady: boolean) => void;
}

export const useProvinceStore = create<ProvinceState>((set) => ({
  currentMonth: 1, // Start at the beginning of the timeline (Jun 2025)
  isMapReady: false,
  setCurrentMonth: (month) => set({ currentMonth: month }),
  setIsMapReady: (isReady) => set({ isMapReady: isReady }),
}));