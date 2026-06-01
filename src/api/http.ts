import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const http = axios.create({
  baseURL: "<https://api.example.com>",
});

/**
 * 인터셉터는 일반 자바스크립트 함수입니다. (리액트 컴포넌트가 아님)
 */
http.interceptors.request.use((config) => {
  // ERROR: 훅(Hook)은 오직 리액트 컴포넌트 내부에서만 호출 가능합니다!
  // 리액트 엔진은 여기서 "Invalid hook call" 에러를 내뱉으며 앱을 멈춥니다.
  const token = useAuthStore((state) => state.token);

  if (token) {
    // 스토어에서 토큰을 가져올 수 없으니, 헤더에 신분증을 붙일 방법이 없습니다.
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
