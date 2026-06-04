import { create } from "zustand";
import { logger } from "./middleware/logger";

interface LoggerState {
  user: string | null;
  login: (name: string) => void;
}

export const useLoggerStore = create<LoggerState>()(
  logger(
    (set) => ({
      user: null,
      login: (name) => set({ user: name }),
    }),
    "LoggerState",
  ),
);
