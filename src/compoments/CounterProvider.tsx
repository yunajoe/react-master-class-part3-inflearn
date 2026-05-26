import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface CounterState {
  count: number;
  increment: () => void;
}

const CounterContext = createContext<CounterState | null>(null);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);

  const value = useMemo(() => ({ count, increment }), [count, increment]);
  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) throw new Error("CounterProvider 내부에서만 사용 가능합니다.");
  return context;
}
