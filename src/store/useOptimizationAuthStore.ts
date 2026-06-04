/**
 * Zustand의 useStore 훅은 기본적으로 아래와 같은 형태의 인자를 받도록 설계
 * useStore(selector, equalityFn?)
 *
 * 첫 번째 인자 (Selector): 스토어의 상태 중 어떤 것을 가져올지 결정하는 함수입니다.
 *  두 번째 인자 (Equality Function, 선택 사항): "가져온 데이터가 정말로 변했는지"를 판단하는 함수
 * 
 * 두 번째 인자인 비교 함수를 직접 작성해서 넘겨주면, Zustand는 내부적으로 다음과 같이 동작합니다:

   1. 상태(state)가 업데이트됨.
   2. 사용자가 지정한 Selector를 실행해 값을 가져옴 (예: state.user).  
   3. 이전 값(prev)과 새로운 값(next)을 두 번째 인자로 넘겨준 비교 함수에 넣음.
   4. 비교 함수가 true를 반환하면: "값이 같네!" → 컴포넌트 리렌더링 안 함.
   5. 비교 함수가 false를 반환하면: "값이 다르네!" → 컴포넌트 리렌더링 함.
 *
 */

import { create } from "zustand";

interface User {
  id: string;
  name: string;
  role: string;
  lastActive: number;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}

export const useOptimizationAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
