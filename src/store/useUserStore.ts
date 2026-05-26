import { create } from "zustand";

interface UserStore {
  username: string;
  points: number;
  isLoggedIn: boolean;
  increasePoints: (amount: number) => void;
  readUser: () => void;
}

export const userStore = create<UserStore>((set, get) => ({
  username: "아키텍트",
  points: 100,
  isLoggedIn: true,
  increasePoints: (amount: number) =>
    set((state) => ({
      points: state.points + amount,
    })),
  readUser: () => {
    const currentPoints = get().points;
    if (currentPoints > 0) {
      console.log(`${get().username}님의 ${currentPoints}포인트가 소멸됩니다.`);
      set({ username: "", points: 0, isLoggedIn: false });
    }
  },
}));
