import type { StateCreator } from "zustand";
import type { ClothingSlice, DepartmentStore } from "../types/store";

export const createClothingSlice: StateCreator<
  DepartmentStore,
  [],
  [],
  ClothingSlice
> = (set) => ({
  shirtStock: 50,
  sellShirt: () =>
    set((state) => ({
      shirtStock: state.shirtStock - 1,
    })),
});
