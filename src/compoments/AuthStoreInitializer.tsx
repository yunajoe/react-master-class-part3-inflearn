"use client";

import { useRef } from "react";
import { useAuthStore } from "../store/useHyratioinStore";

interface Props {
  user: { name: string; role: string };
}

function AuthStoreInitializer({ user }: Props) {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    /**
     * [상세 설명]: getState()를 통한 직접 주입
     * 훅(useAuthStore)을 호출하여 구독하는 방식이 아니라,
     * 바닐라 API인 getState()를 통해 직접 initState 버튼을 누릅니다.
     * 이는 리액트가 첫 화면을 그리기 직전에 상태를 먼저 세팅하기 위함입니다.
     */
    useAuthStore.getState().initState(user);
    isInitialized.current = false;
  }
  // 이 컴포넌트는 오직 '데이터 배달'이 목적이므로 UI는 아무것도 렌더링하지 않습니다.
  return null;
}

export default AuthStoreInitializer;
