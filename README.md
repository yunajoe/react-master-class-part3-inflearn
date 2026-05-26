## section1

## section2

```markdown
비교 항목,🛑 Context API (The Old Way),🚀 Zustand (The Modern Way)
핵심 역할,의존성 주입 도구 (DI),전역 상태 관리 스토어
상태 저장소,리액트 컴포넌트 트리 내부,리액트 컴포넌트 트리 외부 (독립 창고)
렌더링 방식,값이 바뀌면 해당 Context를 구독하는 모든 하위 컴포넌트가 리렌더링 (전염성),셀렉터(Selector) 패턴을 통해 오직 구독한 데이터가 바뀔 때만 정밀 리렌더링
최적화 비용,"useMemo, useCallback 강제 및 복잡한 분리 필요","라이브러리 자체에서 최적화 지원, 보일러플레이트 없음"
런타임 안정성,Provider 외부에서 호출 시 에러 발생 (런타임 불안정),"Provider 불필요, 어디서든 안전하게 즉시 접근 가능"
```

```JavaScript
interface CounterState {
  count: number;
  increment: () => void;
}

// 컨텍스트를 생성합니다. 초기값 null 처리가 항상 우리를 괴롭히는 복병이 됩니다.
const CounterContext = createContext<CounterState | null>(null);

// 데이터를 공급할 '보자기(Provider)' 컴포넌트를 설계합니다.
export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);

  // 리렌더링 폭주를 막기 위해 함수를 일일이 'useCallback'으로 묶어주는 수고가 동반됩니다.
  const increment = useCallback(() => setCount(prev => prev + 1), []);

  // 보자기 안의 값이 바뀔 때마다 전체가 다시 그려지는 것을 방지하려 'useMemo'를 필수적으로 사용합니다.
  const value = useMemo(() => ({ count, increment }), [count, increment]);

  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
}

// 안전한 사용을 위해 매번 null 체크를 수행하는 커스텀 훅을 별도로 정의해야 합니다.
export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) throw new Error("CounterProvider 내부에서만 사용 가능합니다.");
  return context;
}
```

- 상세 코드 분석 (Context API)
  복잡한 보일러플레이트: 숫자 하나를 위해 인터페이스, 컨텍스트, 프로바이더, 커스텀 훅까지 총 4단계를 구축해야 합니다.
  성능 최적화의 짐: useCallback과 useMemo를 강제적으로 사용하여 객체 참조 무결성을 지켜야 합니다. 이를 놓치면 하위의 모든 컴포넌트가 무차별적으로 리렌더링됩니다.
  런타임 불안정성: Provider 밖에서 훅을 호출하면 앱이 즉시 터지기 때문에, 항상 예외 처리 로직이 코드에 포함되어야 합니다.

```JavaScript

import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
}


export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function CounterDisplay() {
  const count = useCounterStore((state) => state.count);
  return <h1>현재 숫자: {count}</h1>;
}
```

- 상세 코드 분석 (Zustand)
  압도적 간결함: create 함수 하나로 모든 정의가 끝납니다. 리액트 컴포넌트 트리를 Provider로 감싸는 작업이 완전히 사라져 코드가 훨씬 깨끗해집니다.
  정밀한 리렌더링: (state) => state.count 셀렉터를 사용하면, 리액트는 이 컴포넌트가 오직 count 변화에만 반응하도록 최적화합니다. 창고 내의 다른 데이터가 수만 번 바뀌어도 이 컴포넌트는 침묵을 유지합니다.
  불변성 자동 관리: set 함수 내부에서 이전 상태(state)를 안전하게 참조하여 업데이트할 수 있으며, 복잡한 스프레드 연산 없이도 상태를 우아하게 변경합니다.

- 전략적 선택: 중앙 창고 vs 지역적 설정
  Zustand가 강력하다고 해서 Context API가 아예 쓸모없는 것은 아닙니다. 아키텍트의 전략적 선택이 필요합니다.
  Zustand (중앙 엔진): 앱 전체를 관통하는 비즈니스 데이터(사용자 정보, 장바구니 등)와 빈번하게 업데이트되는 성능 민감 상태에 사용합니다.
  Context API (지역적 설정): 한 번 결정되면 거의 바뀌지 않는 정적인 데이터(다크 모드, 다국어 설정)나 컴포넌트 트리 일부에만 적용되는 의존성 주입에 적합합니다.
