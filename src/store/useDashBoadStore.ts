import { create } from "zustand";

interface DashboardState {
  user: { name: string; role: string };
  chartData: number[];
  updateChart: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: { name: "James", role: "Admin" },
  chartData: [10, 20, 30],
  updateChart: () =>
    set((state) => ({
      chartData: [...state.chartData, Math.floor(Math.random() * 100)],
    })),
}));
