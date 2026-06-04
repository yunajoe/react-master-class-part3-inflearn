/* [File Path]: src/store/useAuthStore.ts
   [Copyright]: © nhcodingstudio 소유
*/
import { create } from "zustand";

interface AuthState {
  user: { name: string; role: string } | null;
  isLoggedIn: boolean;
  // 서버에서 가져온 초기 데이터를 스토어에 한 번에 주입하기 위한 특수 함수
  initState: (user: { name: string; role: string }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  initState: (user) => set({ user, isLoggedIn: true }),
}));
