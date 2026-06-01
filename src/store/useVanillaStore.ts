import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
interface AuthStore {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const authStore = createStore<AuthStore>()((set) => ({
  token: null,
  isLoggedIn: false,
  setToken: (token) => set({ token, isLoggedIn: true }),
  logout: () => set({ token: null, isLoggedIn: false }),
}));

export const useAuth = () => useStore(authStore);
