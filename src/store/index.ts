import { create } from "zustand";
import type { DepartmentStore } from "../types/store";
import { createClothingSlice } from "./clothingSlice";
import { createCosmeticsSlice } from "./cosmeticsSlice";

export const useDepartmentStore = create<DepartmentStore>()((...rest) => ({
  // 각 층 전문가들에게 마스터키를 넘겨주며 방을 합칩니다.
  ...createCosmeticsSlice(...rest),
  ...createClothingSlice(...rest),
}));
